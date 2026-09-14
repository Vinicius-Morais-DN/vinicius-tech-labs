from dotenv import load_dotenv
load_dotenv()

import os
import re
import json
from datetime import datetime, timezone, timedelta
from typing import Annotated, List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, Field
from pathlib import Path
import io
import uuid
import zipfile
import asyncio
import urllib.request
import urllib.error
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
GITHUB_DOCS_OWNER = os.environ.get("GITHUB_DOCS_OWNER", "Vinicius-Morais-DN")
GITHUB_DOCS_REPO = os.environ.get("GITHUB_DOCS_REPO", "vinicius-tech-labs")
GITHUB_DOCS_BRANCH = os.environ.get("GITHUB_DOCS_BRANCH", "main")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
DOCS_CACHE_TTL = int(os.environ.get("DOCS_CACHE_TTL", "300"))
JWT_ALGORITHM = "HS256"

AREA_ICONS = {
    "networking": "network",
    "linux": "terminal",
    "cybersecurity": "shield",
    "databases": "database",
    "projects": "code",
}
SKIP_PATH_PREFIXES = (".github/", "assets/", "css/", "js/", "node_modules/")
SKIP_FILES = {".gitkeep", ".gitignore", "LICENSE", "index.html"}

_docs_cache: dict = {"tree": None, "expires": 0.0}

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()
api = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in data:
            data["_id"] = ObjectId(data["_id"])
        return data

    @classmethod
    def from_mongo(cls, doc: dict):
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return cls(**doc)


def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def ensure_utc(value) -> Optional[datetime]:
    if value is None:
        return None
    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    if not isinstance(value, datetime):
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


async def check_mongodb() -> bool:
    try:
        await client.admin.command("ping")
        return True
    except (ServerSelectionTimeoutError, ConnectionFailure, Exception):
        return False


def create_access_token(user_id: str, username: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        user["id"] = str(user.pop("_id"))
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ---------- Models ----------

class LoginRequest(BaseModel):
    username: str
    password: str


class Skill(BaseModel):
    name: str
    level: int = 50
    icon: str = "terminal"


class SoftSkill(BaseModel):
    name: str
    description: str = ""


class SiteContent(BaseModel):
    name: str = "Vinicius de Morais"
    title: str = "Estudante de Infraestrutura de Redes & Linux"
    bio: str = ""
    aboutText: str = ""
    photo: str = ""
    resumeUrl: str = ""
    location: str = "Brasil"
    email: str = ""
    phone: str = ""
    linkedin: str = "https://www.linkedin.com/in/vinicius-morais-b39a27413/"
    github: str = "https://github.com/"
    badges: List[str] = []
    separatorText: str = ""
    heroTag: str = ""
    heroStatus: str = ""
    hardSkills: List[Skill] = []
    softSkills: List[SoftSkill] = []


class Area(BaseModel):
    slug: str
    name: str
    icon: str = "folder"
    description: str = ""
    order: int = 0


class DocPage(BaseModel):
    area: str
    slug: str
    title: str
    content: str = ""
    order: int = 0


class Project(BaseModel):
    title: str
    description: str = ""
    tags: List[str] = []
    status: str = "Em andamento"
    link: str = ""
    image: str = ""
    order: int = 0


class Certification(BaseModel):
    title: str
    issuer: str = ""
    year: str = ""
    description: str = ""
    tags: List[str] = []
    link: str = ""
    image: str = ""
    order: int = 0


class ContactMessage(BaseModel):
    name: str
    email: str
    message: str


# ---------- Auth ----------

@api.get("/health")
async def health():
    mongo_ok = await check_mongodb()
    return {
        "api": True,
        "mongodb": mongo_ok,
        "message": "Portfolio API online" if mongo_ok else "API online, mas MongoDB não está acessível",
    }


@api.post("/auth/login")
async def login(body: LoginRequest, request: Request):
    try:
        if not await check_mongodb():
            raise HTTPException(
                status_code=503,
                detail="MongoDB não está rodando. Inicie com start.ps1 ou mongod na porta 27017.",
            )

        username = body.username.lower().strip()
        if not username:
            raise HTTPException(status_code=400, detail="Informe o usuário")

        client_host = request.client.host if request.client else "unknown"
        identifier = f"{client_host}:{username}"
        attempt = await db.login_attempts.find_one({"identifier": identifier})
        if attempt and attempt.get("count", 0) >= 5:
            locked_until = ensure_utc(attempt.get("locked_until"))
            if locked_until and locked_until > utc_now():
                remaining = int((locked_until - utc_now()).total_seconds() // 60) + 1
                raise HTTPException(
                    status_code=429,
                    detail=f"Muitas tentativas. Aguarde {remaining} min ou rode: python clear_lockout.py",
                )

        user = await db.users.find_one({"username": username})
        if not user or not verify_password(body.password, user["password_hash"]):
            new_count = (attempt.get("count", 0) if attempt else 0) + 1
            update = {"$inc": {"count": 1}}
            if new_count >= 5:
                update["$set"] = {"locked_until": utc_now() + timedelta(minutes=15)}
            await db.login_attempts.update_one({"identifier": identifier}, update, upsert=True)
            remaining = max(0, 5 - new_count)
            detail = "Usuário ou senha incorretos"
            if remaining > 0:
                detail += f" ({remaining} tentativa(s) restante(s))"
            raise HTTPException(status_code=401, detail=detail)

        await db.login_attempts.delete_one({"identifier": identifier})
        token = create_access_token(str(user["_id"]), user["username"])
        return {
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "role": user.get("role", "admin"),
            },
        }
    except HTTPException:
        raise
    except (ServerSelectionTimeoutError, ConnectionFailure):
        raise HTTPException(
            status_code=503,
            detail="MongoDB não está rodando. Inicie com start.ps1 ou mongod na porta 27017.",
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro no login: {exc}")


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Public ----------

@api.get("/")
async def root():
    return {"message": "Portfolio API online"}


@api.get("/content")
async def get_content():
    doc = await db.content.find_one({"key": "site"})
    if not doc:
        return SiteContent().model_dump()
    doc.pop("_id", None)
    doc.pop("key", None)
    return doc


@api.get("/areas")
async def get_areas():
    areas = await db.areas.find().sort("order", 1).to_list(100)
    pages = await db.docpages.find().sort("order", 1).to_list(500)
    result = []
    for area in areas:
        a = serialize(area)
        a["pages"] = [serialize(p) for p in pages if p["area"] == a["slug"]]
        result.append(a)
    return result


@api.get("/projects")
async def get_projects():
    projects = await db.projects.find().sort("order", 1).to_list(100)
    return [serialize(p) for p in projects]


@api.get("/certifications")
async def get_certifications():
    certs = await db.certifications.find().sort("order", 1).to_list(100)
    return [serialize(c) for c in certs]


@api.post("/contact")
async def contact(body: ContactMessage):
    await db.messages.insert_one({
        **body.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


# ---------- GitHub Docs (somente leitura) ----------

def _github_headers() -> dict:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "vm-labs-portfolio",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


def _github_fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=_github_headers())
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _github_fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "vm-labs-portfolio"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8")


def _should_skip_path(path: str) -> bool:
    if not path or path == "README.md":
        return True
    if path.startswith(SKIP_PATH_PREFIXES):
        return True
    name = path.rsplit("/", 1)[-1]
    return name in SKIP_FILES


def _title_from_filename(filename: str) -> str:
    base = filename.rsplit(".", 1)[0]
    parts = base.split("-")
    if len(parts) > 3 and parts[0].isdigit() and len(parts[0]) == 4:
        parts = parts[3:]
    title = " ".join(parts).replace("_", " ")
    return title.strip().title() or base


def _insert_tree_node(root: list, parts: list[str], page: dict):
    if not parts:
        return
    name = parts[0]
    is_last = len(parts) == 1

    if is_last:
        root.append(page)
        return

    for node in root:
        if node.get("type") == "folder" and node.get("name") == name:
            _insert_tree_node(node.setdefault("children", []), parts[1:], page)
            return

    folder = {"name": name, "slug": name, "type": "folder", "children": []}
    root.append(folder)
    _insert_tree_node(folder["children"], parts[1:], page)


def _build_github_docs_tree(flat_tree: list) -> dict:
    areas = []
    area_map: dict[str, dict] = {}

    for item in flat_tree:
        if item.get("type") != "blob":
            continue
        path = item.get("path", "")
        if not path.endswith(".md") or _should_skip_path(path):
            continue

        parts = path.split("/")
        filename = parts[-1]
        area_slug = parts[0]
        rel_parts = parts[1:-1]

        page = {
            "name": filename.rsplit(".", 1)[0],
            "slug": filename.rsplit(".", 1)[0],
            "type": "page",
            "title": _title_from_filename(filename),
            "path": path,
            "github_url": (
                f"https://github.com/{GITHUB_DOCS_OWNER}/{GITHUB_DOCS_REPO}"
                f"/blob/{GITHUB_DOCS_BRANCH}/{path}"
            ),
        }

        if area_slug not in area_map:
            area_map[area_slug] = {
                "name": area_slug.replace("-", " ").title(),
                "slug": area_slug,
                "icon": AREA_ICONS.get(area_slug, "folder"),
                "type": "area",
                "children": [],
            }
            areas.append(area_map[area_slug])

        _insert_tree_node(area_map[area_slug]["children"], rel_parts, page)

    areas.sort(key=lambda a: a["name"])
    return {
        "repo": f"{GITHUB_DOCS_OWNER}/{GITHUB_DOCS_REPO}",
        "branch": GITHUB_DOCS_BRANCH,
        "areas": areas,
    }


async def _fetch_github_docs_tree(force: bool = False) -> dict:
    now = utc_now().timestamp()
    if not force and _docs_cache["tree"] and _docs_cache["expires"] > now:
        cached = dict(_docs_cache["tree"])
        cached["cached"] = True
        return cached

    url = (
        f"https://api.github.com/repos/{GITHUB_DOCS_OWNER}/{GITHUB_DOCS_REPO}"
        f"/git/trees/{GITHUB_DOCS_BRANCH}?recursive=1"
    )
    try:
        data = await asyncio.to_thread(_github_fetch_json, url)
    except urllib.error.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"GitHub API error: {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise HTTPException(status_code=502, detail=f"Não foi possível acessar o GitHub: {exc.reason}") from exc

    tree = _build_github_docs_tree(data.get("tree", []))
    tree["cached_at"] = utc_now().isoformat()
    tree["cached"] = False
    _docs_cache["tree"] = tree
    _docs_cache["expires"] = now + DOCS_CACHE_TTL
    return tree


def _find_page_in_tree(areas: list, doc_path: str) -> Optional[dict]:
    target = doc_path if doc_path.endswith(".md") else f"{doc_path}.md"

    def walk(nodes):
        for node in nodes:
            if node.get("type") == "page" and node.get("path") == target:
                return node
            if node.get("type") in ("area", "folder"):
                found = walk(node.get("children", []))
                if found:
                    return found
        return None

    for area in areas:
        if area.get("type") == "area":
            found = walk(area.get("children", []))
            if found:
                return found
    return None


def _first_page_path(areas: list) -> Optional[str]:
    def walk(nodes):
        for node in nodes:
            if node.get("type") == "page":
                return node["path"]
            if node.get("children"):
                found = walk(node["children"])
                if found:
                    return found
        return None

    for area in areas:
        found = walk(area.get("children", []))
        if found:
            return found
    return None


@api.get("/github/docs/tree")
async def github_docs_tree(refresh: bool = False):
    return await _fetch_github_docs_tree(force=refresh)


@api.get("/github/docs/content")
async def github_docs_content(path: str):
    if not path or ".." in path:
        raise HTTPException(status_code=400, detail="Caminho inválido")
    if not path.endswith(".md"):
        path = f"{path}.md"
    if _should_skip_path(path):
        raise HTTPException(status_code=400, detail="Arquivo não permitido")

    tree = await _fetch_github_docs_tree()
    page = _find_page_in_tree(tree.get("areas", []), path)
    if not page:
        raise HTTPException(status_code=404, detail="Documento não encontrado no repositório")

    raw_url = (
        f"https://raw.githubusercontent.com/{GITHUB_DOCS_OWNER}/{GITHUB_DOCS_REPO}"
        f"/{GITHUB_DOCS_BRANCH}/{path}"
    )
    try:
        content = await asyncio.to_thread(_github_fetch_text, raw_url)
    except urllib.error.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar Markdown: {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise HTTPException(status_code=502, detail=f"Não foi possível baixar o arquivo: {exc.reason}") from exc

    return {
        "path": path,
        "title": page.get("title"),
        "content": content,
        "github_url": page.get("github_url"),
        "repo": tree.get("repo"),
    }


# ---------- Admin ----------

@api.put("/admin/content")
async def update_content(body: SiteContent, user: dict = Depends(get_current_user)):
    data = {**body.model_dump(), "key": "site"}
    await db.content.update_one({"key": "site"}, {"$set": data}, upsert=True)
    # Salvar no arquivo JSON
    doc = await db.content.find_one({"key": "site"})
    if doc:
        doc["_id"] = str(doc["_id"])
        save_to_file("content", doc)
    return {"ok": True}


@api.post("/admin/areas")
async def create_area(body: Area, user: dict = Depends(get_current_user)):
    existing = await db.areas.find_one({"slug": body.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug já existe")
    await db.areas.insert_one(body.model_dump())
    # Salvar todas as áreas e páginas
    areas = await db.areas.find().to_list(200)
    pages = await db.docpages.find().to_list(500)
    save_to_file("areas", [serialize(a) for a in areas])
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.put("/admin/areas/{slug}")
async def update_area(slug: str, body: Area, user: dict = Depends(get_current_user)):
    await db.areas.update_one({"slug": slug}, {"$set": body.model_dump()})
    if body.slug != slug:
        await db.docpages.update_many({"area": slug}, {"$set": {"area": body.slug}})
    # Salvar todas as áreas e páginas
    areas = await db.areas.find().to_list(200)
    pages = await db.docpages.find().to_list(500)
    save_to_file("areas", [serialize(a) for a in areas])
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.delete("/admin/areas/{slug}")
async def delete_area(slug: str, user: dict = Depends(get_current_user)):
    await db.areas.delete_one({"slug": slug})
    await db.docpages.delete_many({"area": slug})
    # Salvar todas as áreas e páginas
    areas = await db.areas.find().to_list(200)
    pages = await db.docpages.find().to_list(500)
    save_to_file("areas", [serialize(a) for a in areas])
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.post("/admin/pages")
async def create_page(body: DocPage, user: dict = Depends(get_current_user)):
    existing = await db.docpages.find_one({"area": body.area, "slug": body.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug já existe nesta área")
    await db.docpages.insert_one({**body.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()})
    # Salvar todas as páginas
    pages = await db.docpages.find().to_list(500)
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.put("/admin/pages/{page_id}")
async def update_page(page_id: str, body: DocPage, user: dict = Depends(get_current_user)):
    await db.docpages.update_one(
        {"_id": ObjectId(page_id)},
        {"$set": {**body.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    # Salvar todas as páginas
    pages = await db.docpages.find().to_list(500)
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str, user: dict = Depends(get_current_user)):
    await db.docpages.delete_one({"_id": ObjectId(page_id)})
    # Salvar todas as páginas
    pages = await db.docpages.find().to_list(500)
    save_to_file("docpages", [serialize(p) for p in pages])
    return {"ok": True}


@api.post("/admin/projects")
async def create_project(body: Project, user: dict = Depends(get_current_user)):
    result = await db.projects.insert_one(body.model_dump())
    # Salvar todos os projetos
    projects = await db.projects.find().to_list(200)
    save_to_file("projects", [serialize(p) for p in projects])
    return {"ok": True, "id": str(result.inserted_id)}


@api.put("/admin/projects/{project_id}")
async def update_project(project_id: str, body: Project, user: dict = Depends(get_current_user)):
    await db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": body.model_dump()})
    # Salvar todos os projetos
    projects = await db.projects.find().to_list(200)
    save_to_file("projects", [serialize(p) for p in projects])
    return {"ok": True}


@api.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, user: dict = Depends(get_current_user)):
    await db.projects.delete_one({"_id": ObjectId(project_id)})
    # Salvar todos os projetos
    projects = await db.projects.find().to_list(200)
    save_to_file("projects", [serialize(p) for p in projects])
    return {"ok": True}


@api.get("/admin/messages")
async def get_messages(user: dict = Depends(get_current_user)):
    messages = await db.messages.find().sort("created_at", -1).to_list(200)
    return [serialize(m) for m in messages]


@api.post("/admin/export-saves")
async def export_saves(user: dict = Depends(get_current_user)):
    await export_all_to_saves()
    return {"ok": True, "message": "Dados exportados para backend/saves/"}


@api.get("/admin/saves-status")
async def saves_status(user: dict = Depends(get_current_user)):
    files = []
    for name in ("content", "areas", "docpages", "projects", "certifications"):
        path = SAVES_DIR / f"{name}.json"
        files.append({
            "name": name,
            "exists": path.exists(),
            "updated_at": datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).isoformat() if path.exists() else None,
        })
    return {"files": files, "saves_dir": str(SAVES_DIR)}


@api.post("/admin/sync-github-docs")
async def sync_github_docs(user: dict = Depends(get_current_user)):
    """Importa todos os arquivos .md do GitHub e substitui a documentação atual."""
    try:
        # Buscar árvore de arquivos do GitHub
        tree = await _fetch_github_docs_tree(force=True)
        
        # Limpar documentação atual (substituir tudo)
        await db.areas.delete_many({})
        await db.docpages.delete_many({})
        
        # Importar novas áreas e páginas
        imported_areas = []
        imported_pages = []
        
        for area_data in tree.get("areas", []):
            # Criar área
            area = {
                "slug": area_data["slug"],
                "name": area_data["name"],
                "icon": area_data.get("icon", "folder"),
                "description": f"Importado do GitHub: {area_data['name']}",
                "order": len(imported_areas),
            }
            await db.areas.insert_one(area)
            imported_areas.append(area["slug"])
            
            # Importar páginas recursivamente
            async def import_pages(nodes, area_slug):
                count = 0
                for node in nodes:
                    if node.get("type") == "page":
                        # Buscar conteúdo do arquivo
                        path = node.get("path", "")
                        if path.endswith(".md"):
                            try:
                                content_data = await github_docs_content(path)
                                page = {
                                    "area": area_slug,
                                    "slug": node["slug"],
                                    "title": node.get("title", node["slug"]),
                                    "content": content_data.get("content", ""),
                                    "order": count,
                                    "updated_at": datetime.now(timezone.utc).isoformat(),
                                }
                                await db.docpages.insert_one(page)
                                count += 1
                            except Exception as e:
                                print(f"Erro ao importar {path}: {e}")
                    elif node.get("type") == "folder" and node.get("children"):
                        count += await import_pages(node["children"], area_slug)
                return count
            
            page_count = await import_pages(area_data.get("children", []), area["slug"])
            imported_pages.append(page_count)
        
        # Salvar backups
        areas = await db.areas.find().sort("order", 1).to_list(200)
        pages = await db.docpages.find().sort("order", 1).to_list(500)
        save_to_file("areas", [serialize(a) for a in areas])
        save_to_file("docpages", [serialize(p) for p in pages])
        
        total_pages = sum(imported_pages)
        return {
            "ok": True,
            "message": f"Importação concluída: {len(imported_areas)} áreas e {total_pages} páginas do GitHub",
            "areas": imported_areas,
            "pages_per_area": imported_pages,
            "total_pages": total_pages,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao sincronizar com GitHub: {str(e)}")


@api.post("/admin/certifications")
async def create_certification(body: Certification, user: dict = Depends(get_current_user)):
    result = await db.certifications.insert_one(body.model_dump())
    # Salvar todas as certificações
    certs = await db.certifications.find().to_list(200)
    save_to_file("certifications", [serialize(c) for c in certs])
    return {"ok": True, "id": str(result.inserted_id)}


@api.put("/admin/certifications/{cert_id}")
async def update_certification(cert_id: str, body: Certification, user: dict = Depends(get_current_user)):
    await db.certifications.update_one({"_id": ObjectId(cert_id)}, {"$set": body.model_dump()})
    # Salvar todas as certificações
    certs = await db.certifications.find().to_list(200)
    save_to_file("certifications", [serialize(c) for c in certs])
    return {"ok": True}


@api.delete("/admin/certifications/{cert_id}")
async def delete_certification(cert_id: str, user: dict = Depends(get_current_user)):
    await db.certifications.delete_one({"_id": ObjectId(cert_id)})
    # Salvar todas as certificações
    certs = await db.certifications.find().to_list(200)
    save_to_file("certifications", [serialize(c) for c in certs])
    return {"ok": True}


UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

SAVES_DIR = Path(__file__).parent / "saves"
SAVES_DIR.mkdir(exist_ok=True)


def save_to_file(collection_name: str, data):
    """Salva dados da coleção MongoDB em arquivo JSON na pasta saves/"""
    file_path = SAVES_DIR / f"{collection_name}.json"
    file_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False, default=str),
        encoding="utf-8"
    )


def load_from_file(collection_name: str):
    file_path = SAVES_DIR / f"{collection_name}.json"
    if not file_path.exists():
        return None
    try:
        return json.loads(file_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


async def export_all_to_saves():
    doc = await db.content.find_one({"key": "site"})
    if doc:
        doc["_id"] = str(doc["_id"])
        save_to_file("content", doc)

    areas = await db.areas.find().sort("order", 1).to_list(200)
    pages = await db.docpages.find().sort("order", 1).to_list(500)
    projects = await db.projects.find().sort("order", 1).to_list(200)
    certs = await db.certifications.find().sort("order", 1).to_list(200)

    save_to_file("areas", [serialize(a) for a in areas])
    save_to_file("docpages", [serialize(p) for p in pages])
    save_to_file("projects", [serialize(p) for p in projects])
    save_to_file("certifications", [serialize(c) for c in certs])


async def restore_from_saves():
    restored = []

    content_data = load_from_file("content")
    if isinstance(content_data, dict):
        content_data.pop("_id", None)
        content_data.pop("id", None)
        content_data["key"] = "site"
        await db.content.update_one({"key": "site"}, {"$set": content_data}, upsert=True)
        restored.append("content")

    areas_data = load_from_file("areas")
    if isinstance(areas_data, list):
        for item in areas_data:
            item = dict(item)
            item.pop("id", None)
            item.pop("pages", None)
            slug = item.get("slug")
            if slug:
                await db.areas.update_one({"slug": slug}, {"$set": item}, upsert=True)
        restored.append("areas")

    pages_data = load_from_file("docpages")
    if isinstance(pages_data, list):
        for item in pages_data:
            item = dict(item)
            item_id = item.pop("id", None)
            query = {"area": item.get("area"), "slug": item.get("slug")}
            if item_id:
                try:
                    await db.docpages.update_one({"_id": ObjectId(item_id)}, {"$set": item}, upsert=True)
                    continue
                except Exception:
                    pass
            await db.docpages.update_one(query, {"$set": item}, upsert=True)
        restored.append("docpages")

    projects_data = load_from_file("projects")
    if isinstance(projects_data, list):
        for item in projects_data:
            item = dict(item)
            item_id = item.pop("id", None)
            if item_id:
                try:
                    await db.projects.update_one({"_id": ObjectId(item_id)}, {"$set": item}, upsert=True)
                    continue
                except Exception:
                    pass
            await db.projects.insert_one(item)
        restored.append("projects")

    certs_data = load_from_file("certifications")
    if isinstance(certs_data, list):
        for item in certs_data:
            item = dict(item)
            item_id = item.pop("id", None)
            if item_id:
                try:
                    await db.certifications.update_one({"_id": ObjectId(item_id)}, {"$set": item}, upsert=True)
                    continue
                except Exception:
                    pass
            await db.certifications.insert_one(item)
        restored.append("certifications")

    return restored


@api.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "png"
    if ext not in {"png", "jpg", "jpeg", "webp", "gif"}:
        raise HTTPException(status_code=400, detail="Formato não suportado (use png, jpg, webp ou gif)")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Arquivo muito grande (máx 5MB)")
    name = f"{uuid.uuid4().hex}.{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/api/uploads/{name}"}


@api.post("/admin/upload-file")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    if ext not in {"pdf", "doc", "docx"}:
        raise HTTPException(status_code=400, detail="Formato não suportado (use pdf, doc ou docx)")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Arquivo muito grande (máx 10MB)")
    name = f"{uuid.uuid4().hex}.{ext}"
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"/api/uploads/{name}"}


ZIP_FILES = [
    "backend/server.py", "backend/requirements.txt", "backend/.env.example",
    "frontend/package.json", "frontend/yarn.lock", "frontend/tailwind.config.js",
    "frontend/postcss.config.js", "frontend/craco.config.js", "frontend/jsconfig.json",
    "frontend/components.json", "frontend/.env.example",
    "install.sh", "README.md", "memory/test_credentials.md",
]
ZIP_DIRS = ["frontend/src", "frontend/public", "frontend/plugins"]
ZIP_SKIP_NAMES = {".env", "vm-labs-portfolio.zip"}
ZIP_SKIP_PARTS = {"node_modules", ".git", "__pycache__", "venv", "uploads"}


@api.get("/download/project.zip")
async def download_project():
    base = Path(__file__).parent.parent
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for rel in ZIP_FILES:
            p = base / rel
            if p.exists():
                zf.write(p, rel)
        for folder in ZIP_DIRS:
            root = base / folder
            if not root.exists():
                continue
            for path in root.rglob("*"):
                if not path.is_file():
                    continue
                if path.name in ZIP_SKIP_NAMES or ZIP_SKIP_PARTS.intersection(path.parts):
                    continue
                zf.write(path, path.relative_to(base))
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=vm-labs-portfolio.zip"},
    )


# ---------- Seed ----------

DEFAULT_CONTENT = {
    "key": "site",
    "name": "Vinicius de Morais",
    "title": "Estudante de Infraestrutura de Redes & Linux",
    "bio": "Estudante focado em infraestrutura de redes, administração de sistemas Linux e cybersegurança. Construo home labs para praticar cenários reais: configuração de switches gerenciáveis, VLANs, firewalls, servidores e automação. Este site é meu repositório vivo de documentação, labs e projetos.",
    "aboutText": "Olá! Sou Vinicius de Morais, estudante de Infraestrutura de Redes e apaixonado por tecnologia desde cedo. Tenho me dedicado a construir um home lab próprio para praticar na prática tudo que estudo: redes, Linux, firewalls e segurança da informação.\n\nMeu objetivo é atuar na área de infraestrutura e cibersegurança, trazendo soluções sólidas e bem documentadas. Cada projeto que você vê aqui foi montado, testado e documentado por mim — porque acredito que aprender fazendo é o caminho mais eficiente.\n\nSempre disponível para novas oportunidades, estágios e colaborações técnicas.",
    "photo": "",
    "resumeUrl": "",
    "location": "Brasil",
    "email": "1vinicius.morais1@gmail.com",
    "phone": "(11) 97889-8143",
    "linkedin": "https://www.linkedin.com/in/vinicius-morais-b39a27413/",
    "github": "https://github.com/",
    "badges": ["Redes", "Linux", "Cybersegurança", "Home Lab"],
    "separatorText": "",
    "heroTag": "",
    "heroStatus": "",
    "hardSkills": [
        {"name": "Redes TCP/IP", "level": 70, "icon": "network"},
        {"name": "Linux (SysAdmin)", "level": 75, "icon": "terminal"},
        {"name": "Cisco / Packet Tracer", "level": 65, "icon": "router"},
        {"name": "Firewall / pfSense", "level": 55, "icon": "shield"},
        {"name": "Cybersegurança", "level": 60, "icon": "lock"},
        {"name": "Bash & Python", "level": 50, "icon": "code"},
    ],
    "softSkills": [
        {"name": "Resolução de Problemas", "description": "Troubleshooting metódico: isolar, testar, documentar e corrigir a causa raiz."},
        {"name": "Documentação Técnica", "description": "Registro detalhado de cada lab e configuração, como um runbook pessoal."},
        {"name": "Aprendizado Contínuo", "description": "Estudo constante de novas tecnologias através de labs práticos."},
        {"name": "Trabalho em Equipe", "description": "Comunicação clara e colaboração em projetos técnicos."},
    ],
}

DEFAULT_AREAS = [
    {"slug": "redes", "name": "Redes", "icon": "network", "description": "Fundamentos de rede, switching, VLANs, roteamento e labs Cisco.", "order": 0},
    {"slug": "cyberseguranca", "name": "Cybersegurança", "icon": "shield", "description": "Hardening, análise de tráfego, boas práticas de segurança e labs defensivos.", "order": 1},
    {"slug": "infraestrutura", "name": "Infraestrutura / SysAdmin", "icon": "server", "description": "Servidores, virtualização, firewalls e administração de sistemas.", "order": 2},
    {"slug": "programacao", "name": "Programação", "icon": "code", "description": "Scripts, automação e ferramentas desenvolvidas para o dia a dia de infra.", "order": 3},
]

DEFAULT_PAGES = [
    {
        "area": "redes", "slug": "config-switch-gerenciavel", "title": "Configuração de Switch Gerenciável", "order": 0,
        "content": """# Configuração de Switch Gerenciável

Lab de configuração inicial de um switch gerenciável (Cisco Catalyst / Packet Tracer): hostname, senhas, VLAN de gerenciamento e salvamento da configuração.

## Setup Inicial

1. Conectar via console e entrar no modo privilegiado
2. Definir hostname e senhas (enable secret, console, VTY)
3. Configurar IP de gerenciamento na VLAN 1
4. Salvar em NVRAM

```bash
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-LAB01
SW-LAB01(config)# enable secret MinhaSenhaForte
SW-LAB01(config)# line console 0
SW-LAB01(config-line)# password console123
SW-LAB01(config-line)# login
SW-LAB01(config-line)# exit
SW-LAB01(config)# interface vlan 1
SW-LAB01(config-if)# ip address 192.168.50.2 255.255.255.0
SW-LAB01(config-if)# no shutdown
SW-LAB01(config-if)# end
SW-LAB01# write memory
```

## Verificação

```bash
SW-LAB01# show ip interface brief
SW-LAB01# show running-config
```

## Lições Aprendidas

- Sempre usar `enable secret` (criptografado) em vez de `enable password`
- Documentar cada porta e sua função antes de configurar
- `write memory` após qualquer mudança validada
""",
    },
    {
        "area": "redes", "slug": "vlans-e-trunking", "title": "VLANs e Trunking 802.1Q", "order": 1,
        "content": """# VLANs e Trunking 802.1Q

Segmentação da rede do lab em VLANs e configuração de trunk entre switches.

## VLANs do Lab

| VLAN | Nome | Sub-rede |
|------|------|----------|
| 10 | Servers | 192.168.10.0/24 |
| 20 | Infraestrutura | 192.168.20.0/24 |
| 40 | Clients | 192.168.40.0/24 |
| 99 | Native | — |

## Criação das VLANs

```bash
SW-LAB01(config)# vlan 10
SW-LAB01(config-vlan)# name Servers
SW-LAB01(config-vlan)# vlan 20
SW-LAB01(config-vlan)# name Infraestrutura
SW-LAB01(config-vlan)# vlan 40
SW-LAB01(config-vlan)# name Clients
SW-LAB01(config-vlan)# vlan 99
SW-LAB01(config-vlan)# name Native
```

## Porta de Acesso

```bash
SW-LAB01(config)# interface fa0/2
SW-LAB01(config-if)# switchport mode access
SW-LAB01(config-if)# switchport access vlan 20
SW-LAB01(config-if)# spanning-tree portfast
```

## Trunk 802.1Q

```bash
SW-LAB01(config)# interface fa0/23
SW-LAB01(config-if)# switchport mode trunk
SW-LAB01(config-if)# switchport trunk native vlan 99
SW-LAB01(config-if)# switchport trunk allowed vlan 1,10,20,40,99
```

## Verificação

```bash
SW-LAB01# show vlan brief
SW-LAB01# show interfaces trunk
```

> **Boas práticas:** nunca usar a VLAN 1 para dados, mover portas não utilizadas para uma VLAN "blackhole" e desligá-las (`shutdown`).
""",
    },
    {
        "area": "cyberseguranca", "slug": "hardening-linux", "title": "Hardening de Servidores Linux", "order": 0,
        "content": """# Hardening de Servidores Linux

Checklist de endurecimento aplicado nos servidores do home lab (Ubuntu/Debian).

## 1. Atualizações e Pacotes

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install unattended-upgrades ufw fail2ban -y
```

## 2. SSH Seguro

Edite `/etc/ssh/sshd_config`:

```bash
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
MaxAuthTries 3
```

```bash
sudo systemctl restart sshd
```

## 3. Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp
sudo ufw enable
```

## 4. Fail2Ban

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

## 5. Auditoria

- `sudo ss -tulpn` — portas abertas
- `sudo last -20` — logins recentes
- Logs em `/var/log/auth.log`

> Regra de ouro: **menor privilégio possível** — serviço que não precisa existir, não deve estar instalado.
""",
    },
    {
        "area": "cyberseguranca", "slug": "analise-wireshark", "title": "Análise de Pacotes com Wireshark", "order": 1,
        "content": """# Análise de Pacotes com Wireshark

Captura e análise de tráfego do lab para entender protocolos e detectar anomalias.

## Filtros Úteis

```text
ip.addr == 192.168.10.5        # tráfego de um host
tcp.port == 443                # HTTPS
dns                            # consultas DNS
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN scan
icmp                           # pings
```

## Metodologia

1. **Capturar** na interface correta (ou SPAN/mirror port no switch)
2. **Filtrar** pelo protocolo ou host de interesse
3. **Seguir o stream** TCP (Follow > TCP Stream) para ver a conversa completa
4. **Exportar** evidências (.pcap) e documentar os achados

## Achados do Lab

- Identificação de broadcast storms causados por loop L2 (STP desabilitado)
- Detecção de tentativas de brute-force SSH via múltiplos SYNs na porta 22
- Validação de que o trunk 802.1Q carrega apenas as VLANs permitidas
""",
    },
    {
        "area": "infraestrutura", "slug": "pfsense-firewall", "title": "Firewall pfSense — Setup Inicial", "order": 0,
        "content": """# Firewall pfSense — Setup Inicial

Instalação e configuração do pfSense como roteador/firewall do home lab.

## Topologia

- **WAN:** DHCP do roteador do provedor (192.168.1.0/24)
- **LAN:** 192.168.50.1/24 — gateway de toda a rede do lab

## Passos

1. Instalar pfSense em VM (2 vCPU, 2GB RAM, 2 NICs)
2. Atribuir interfaces WAN/LAN pelo console
3. Definir IP da LAN e habilitar DHCP server para a LAN
4. Acessar a webGUI: `https://192.168.50.1`

## Regras de Firewall

| Regra | Ação | Justificativa |
|-------|------|---------------|
| LAN → Any | Allow | acesso geral à internet |
| VLAN 40 → VLAN 10 | Block | clientes não acessam servidores |
| WAN → LAN | Block (default) | nada entra sem NAT explícito |

## NAT

Outbound NAT em modo híbrido: regras manuais para as sub-redes do lab (10/20/40/50).

## Lições

- Sempre testar conectividade após cada regra nova (`ping`, `traceroute`)
- Backup da config: **Diagnostics > Backup & Restore**
""",
    },
    {
        "area": "infraestrutura", "slug": "active-directory", "title": "Active Directory & Windows Server", "order": 1,
        "content": """# Active Directory & Windows Server

Lab de domínio com Windows Server: AD DS, DNS, DHCP e Group Policy.

## Estrutura do Domínio

- **Domínio:** `lab.local`
- **DC:** Windows Server 2022 (VM, 2 vCPU, 4GB RAM)
- **IP:** 192.168.20.10/24 (VLAN 20 — Infraestrutura)

## Instalação do AD DS

```powershell
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSForest -DomainName "lab.local" -InstallDns
```

## DHCP + Relay

Escopos por VLAN (10/20/40). Nos switches L3, relay apontando para o DC:

```bash
SW-L3(config)# interface vlan 40
SW-L3(config-if)# ip helper-address 192.168.20.10
```

## Group Policy (GPOs)

- Política de senha: mínimo 12 caracteres, complexidade habilitada
- Bloqueio de conta após 5 tentativas
- Mapeamento de drives por OU
- Restrição de Painel de Controle para usuários comuns

## Verificação

```powershell
Get-ADDomain
Get-ADUser -Filter *
dcdiag
```
""",
    },
    {
        "area": "programacao", "slug": "automacao-bash", "title": "Automação com Bash", "order": 0,
        "content": """# Automação com Bash

Scripts criados para automatizar tarefas repetitivas do home lab.

## Backup de Configs de Rede

```bash
#!/bin/bash
# backup-configs.sh — backup diário das configs do lab
BACKUP_DIR="/opt/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

for host in 192.168.50.2 192.168.50.3; do
    ssh admin@$host "show running-config" > "$BACKUP_DIR/switch-$host.cfg"
done

find /opt/backups -mtime +30 -delete
```

## Monitoramento Simples

```bash
#!/bin/bash
# check-hosts.sh — pinga os hosts críticos e alerta
HOSTS="192.168.50.1 192.168.20.10 192.168.10.5"
for h in $HOSTS; do
    if ! ping -c 2 -W 2 "$h" &>/dev/null; then
        echo "[ALERTA] $h fora do ar em $(date)" | tee -a /var/log/lab-alerts.log
    fi
done
```

## Agendamento (cron)

```bash
0 3 * * * /opt/scripts/backup-configs.sh
*/5 * * * * /opt/scripts/check-hosts.sh
```
""",
    },
    {
        "area": "programacao", "slug": "python-redes", "title": "Python para Redes", "order": 1,
        "content": """# Python para Redes

Scripts Python para interagir com a infraestrutura do lab.

## Scanner de Portas Simples

```python
import socket

def scan(host, ports):
    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        if s.connect_ex((host, port)) == 0:
            print(f"[+] {host}:{port} aberta")
        s.close()

scan("192.168.50.1", [22, 53, 80, 443, 3389])
```

## Coleta de Facts via SSH (Netmiko)

```python
from netmiko import ConnectHandler

switch = {
    "device_type": "cisco_ios",
    "host": "192.168.50.2",
    "username": "admin",
    "password": "senha",
}

with ConnectHandler(**switch) as conn:
    vlans = conn.send_command("show vlan brief")
    print(vlans)
```

## Próximos Passos

- Automatizar backup de configs com Netmiko + cron
- Gerar relatório de portas abertas em CSV
- Estudar Ansible para configuração declarativa
""",
    },
    {
        "area": "infraestrutura", "slug": "instalacao-portfolio", "title": "Como Instalar Este Portfólio", "order": 2,
        "content": """# Como Instalar Este Portfólio

Guia completo para rodar o projeto **vm-labs-portfolio** localmente. O projeto é composto por:

- **Frontend** — React 19 + Tailwind CSS + craco
- **Backend** — FastAPI + Motor (MongoDB async)
- **Banco** — MongoDB 7.x

---

## Pré-requisitos

| Ferramenta | Versão mínima | Como verificar |
|-----------|---------------|----------------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Python | 3.11+ | `python --version` |
| MongoDB | 6+ | `mongod --version` |

> **Windows sem MongoDB instalado?** Veja a seção *MongoDB Portable* ao final.

---

## 1. Clonar / extrair o projeto

```bash
# Se tiver Git:
git clone https://github.com/seu-usuario/vm-labs-portfolio.git
cd vm-labs-portfolio

# Ou extraia o .zip e entre na pasta raiz
```

---

## 2. Configurar o Backend

```bash
cd backend

# Copiar variáveis de ambiente
cp .env.example .env
```

Abra o `.env` e ajuste se necessário:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="portfolio"
JWT_SECRET="troque-por-uma-string-aleatoria-longa"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="suasenhaforte"
```

### Instalar dependências Python

```bash
# Crie e ative um virtualenv (recomendado)
python -m venv venv

# Linux / macOS:
source venv/bin/activate

# Windows (PowerShell):
.\\venv\\Scripts\\Activate.ps1

# Instalar pacotes
pip install -r requirements.txt
```

### Iniciar o backend

```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

O backend estará disponível em `http://localhost:8001`.
Acesse `http://localhost:8001/api/` para confirmar: deve retornar `{"message":"Portfolio API online"}`.

---

## 3. Configurar o Frontend

```bash
cd ../frontend

# Copiar variáveis de ambiente
cp .env.example .env
```

O `.env` já deve conter:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Instalar dependências Node

```bash
npm install --legacy-peer-deps
```

> O flag `--legacy-peer-deps` é necessário por conflito de versão entre `react-day-picker` e `date-fns`.

### Iniciar o frontend

```bash
npm start
```

O site abrirá automaticamente em `http://localhost:3000`.

---

## 4. Acessar o painel Admin

1. Acesse `http://localhost:3000/admin`
2. Use as credenciais configuradas no `.env`:
   - Usuário: `admin` (ou o que você definiu em `ADMIN_USERNAME`)
   - Senha: `admin123` (ou o que você definiu em `ADMIN_PASSWORD`)

No admin você pode editar: nome, foto, bio, texto Sobre Mim, currículo, skills, projetos, certificações e documentação.

---

## 5. MongoDB Portable (Windows, sem instalação)

Se não quiser instalar o MongoDB via instalador:

```powershell
# 1. Baixar o zip portable (MongoDB 7.0)
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.21.zip"
Invoke-WebRequest -Uri $url -OutFile "$env:USERPROFILE\\mongodb.zip" -UseBasicParsing

# 2. Extrair
Expand-Archive -Path "$env:USERPROFILE\\mongodb.zip" -DestinationPath "$env:USERPROFILE\\mongodb" -Force

# 3. Criar diretório de dados
New-Item -ItemType Directory -Path "$env:USERPROFILE\\mongodb-data" -Force

# 4. Iniciar o mongod
& "C:\\Users\\MASTER\\mongodb\\mongodb-win32-x86_64-windows-7.0.21\\bin\\mongod.exe" --dbpath "C:\\Users\\MASTER\\mongodb-data" --port 27017 --bind_ip 127.0.0.1
```

Deixe o terminal aberto. O banco estará disponível em `localhost:27017`.

---

## Estrutura de Pastas

```
vm-labs-portfolio/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── requirements.txt   # Dependências Python
│   ├── .env               # Variáveis de ambiente (não commitar)
│   ├── .env.example       # Exemplo de .env
│   └── uploads/           # Imagens e arquivos enviados via admin
└── frontend/
    ├── src/
    │   ├── components/    # Hero, AboutMe, Skills, Projects...
    │   ├── pages/         # Home, AdminPage, DocsWiki
    │   └── context/       # ThemeContext, AuthContext
    ├── public/
    ├── package.json
    └── .env
```

---

## Problemas Comuns

| Problema | Solução |
|---------|---------|
| `ERESOLVE` no npm install | Use `npm install --legacy-peer-deps` |
| Backend não conecta ao MongoDB | Verifique se o `mongod` está rodando na porta 27017 |
| Imagens não carregam no admin | Confirme que `backend/uploads/` existe e tem permissão de escrita |
| Login admin não funciona | Verifique `ADMIN_USERNAME` e `ADMIN_PASSWORD` no `.env` do backend |
| `Module not found` no frontend | Delete `node_modules` e rode `npm install --legacy-peer-deps` novamente |
""",
    },
]

DEFAULT_PROJECTS = [
    {
        "title": "Home Lab de Infraestrutura",
        "description": "Ambiente de virtualização com servidores Windows e Linux, switches gerenciáveis e firewall dedicado. Base de todos os meus estudos práticos.",
        "tags": ["Virtualização", "Linux", "Windows Server", "Redes"],
        "status": "Em andamento",
        "link": "",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA6MTJ8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwc2VydmVyJTIwbmV0d29yayUyMGluZnJhc3RydWN0dXJlfGVufDB8fHx8MTc4OTEwMDI1M3ww&ixlib=rb-4.1.0&q=85",
        "order": 0,
    },
    {
        "title": "Configuração de Switches Gerenciáveis",
        "description": "Setup completo de switches: VLANs, trunk 802.1Q, PortFast, VLAN de gerenciamento dedicada e blackhole VLAN para portas não utilizadas.",
        "tags": ["Cisco", "VLANs", "Trunking", "Packet Tracer"],
        "status": "Concluído",
        "link": "",
        "image": "https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA6MTJ8MHwxfHNlYXJjaHwyfHxjeWJlcnNlY3VyaXR5JTIwc2VydmVyJTIwbmV0d29yayUyMGluZnJhc3RydWN0dXJlfGVufDB8fHx8MTc4OTEwMDI1M3ww&ixlib=rb-4.1.0&q=85",
        "order": 1,
    },
    {
        "title": "Firewall pfSense — Segmentação de Rede",
        "description": "pfSense como gateway do lab: regras entre VLANs, NAT outbound, DHCP e validação de conectividade ponta a ponta.",
        "tags": ["pfSense", "Firewall", "NAT", "Segurança"],
        "status": "Em andamento",
        "link": "",
        "image": "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA6MTJ8MHwxfHNlYXJjaHwzfHxjeWJlcnNlY3VyaXR5JTIwc2VydmVyJTIwbmV0d29yayUyMGluZnJhc3RydWN0dXJlfGVufDB8fHx8MTc4OTEwMDI1M3ww&ixlib=rb-4.1.0&q=85",
        "order": 2,
    },
    {
        "title": "Análise de Tráfego com Wireshark",
        "description": "Captura e análise de pacotes do lab: detecção de loops L2, brute-force SSH e validação de trunks.",
        "tags": ["Wireshark", "Análise", "Blue Team"],
        "status": "Concluído",
        "link": "",
        "image": "",
        "order": 3,
    },
]


DEFAULT_CERTIFICATIONS = [
    {
        "title": "CCNA: Introduction to Networks",
        "issuer": "Cisco Networking Academy",
        "year": "2025",
        "description": "Fundamentos de redes: modelo OSI, TCP/IP, switching e roteamento básico.",
        "tags": ["Redes", "Cisco"],
        "link": "",
        "image": "",
        "order": 0,
    },
    {
        "title": "Linux Unhatched",
        "issuer": "Cisco Networking Academy",
        "year": "2025",
        "description": "Fundamentos do sistema Linux, linha de comando e administração básica.",
        "tags": ["Linux", "SysAdmin"],
        "link": "",
        "image": "",
        "order": 1,
    },
]


async def seed():
    await db.users.create_index("username", unique=True)
    await db.login_attempts.create_index("identifier")

    existing = await db.users.find_one({"username": ADMIN_USERNAME.lower()})
    if not existing:
        await db.users.insert_one({
            "username": ADMIN_USERNAME.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"username": ADMIN_USERNAME.lower()},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )

    if not await db.content.find_one({"key": "site"}):
        await db.content.insert_one(DEFAULT_CONTENT)
    else:
        # garante que novos campos sejam adicionados sem sobrescrever dados existentes
        await db.content.update_one(
            {"key": "site"},
            {"$set": {k: v for k, v in DEFAULT_CONTENT.items() if k not in ["hardSkills", "softSkills", "badges"]}},
            upsert=False,
        )
        # usa $setOnInsert-like logic: só define se o campo não existir
        doc = await db.content.find_one({"key": "site"})
        updates = {}
        for field in ["aboutText", "photo", "resumeUrl", "heroTag", "heroStatus", "separatorText"]:
            if field not in doc:
                updates[field] = DEFAULT_CONTENT.get(field, "")
        if updates:
            await db.content.update_one({"key": "site"}, {"$set": updates})
    if await db.areas.count_documents({}) == 0:
        await db.areas.insert_many(DEFAULT_AREAS)
    if await db.docpages.count_documents({}) == 0:
        await db.docpages.insert_many([
            {**p, "updated_at": datetime.now(timezone.utc).isoformat()} for p in DEFAULT_PAGES
        ])
    else:
        # Insere apenas páginas novas que ainda não existem (por area+slug)
        for p in DEFAULT_PAGES:
            exists = await db.docpages.find_one({"area": p["area"], "slug": p["slug"]})
            if not exists:
                await db.docpages.insert_one({**p, "updated_at": datetime.now(timezone.utc).isoformat()})
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many(DEFAULT_PROJECTS)
    if await db.certifications.count_documents({}) == 0:
        await db.certifications.insert_many(DEFAULT_CERTIFICATIONS)


@app.on_event("startup")
async def startup():
    await seed()
    restored = await restore_from_saves()
    if restored:
        print(f"[saves] Restaurado do disco: {', '.join(restored)}")
    else:
        await export_all_to_saves()
        print("[saves] Backup inicial criado em backend/saves/")


app.include_router(api)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
