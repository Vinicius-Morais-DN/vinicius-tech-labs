# VM Labs — Portfólio de Infraestrutura, Redes & Cybersegurança

Portfólio pessoal de **Vinicius de Morais** com wiki de documentação integrada, integração ao GitHub, 2FA com app autenticador e painel admin completo para editar todo o conteúdo sem tocar no código.

---

## Funcionalidades

| Seção | Descrição |
|-------|-----------|
| **Hero** | Terminal animado com typewriter, nome, título e CTAs |
| **Sobre Mim** | Foto de perfil, texto de apresentação, badges, links sociais e botão de download do currículo |
| **Skills** | Hard skills com barra de progresso e soft skills com descrição |
| **Certificações** | Cards de cursos e certificados com imagem, emissor e ano |
| **GitHub** | Repositórios públicos buscados em tempo real da API do GitHub |
| **Projetos & Labs** | Cards com tags, status, imagem e link |
| **Contato** | Cards de redes + formulário (mensagens chegam no painel admin) |
| **Docs / Wiki** | Árvore de áreas e páginas em Markdown com preview, suporte a imagens, código e tabelas |
| **Tema claro/escuro** | Toggle na navbar, preferência salva no navegador |
| **Admin + 2FA** | Login com usuário/senha + verificação por app autenticador (Google Authenticator / Authy) |
| **💾 Backup Automático** | Todas as alterações são salvas em arquivos JSON em `backend/saves/` |

---

## Stack

**Backend:** FastAPI · MongoDB (Motor async) · PyJWT · bcrypt · pyotp · python-dotenv  
**Frontend:** React 19 · Tailwind CSS · shadcn/ui · lucide-react · react-markdown · sonner · axios  
**Infra:** MongoDB 7.x (local ou Atlas)

---

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|-----------|---------------|-----------|
| Python | 3.11+ | `python --version` |
| pip | 23+ | `pip --version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MongoDB | 6+ | `mongod --version` |

> **Sem MongoDB instalado?** Veja a seção [MongoDB Portable para Windows](#mongodb-portable-windows).

---

## Instalação

### 1. Clonar / extrair o projeto

```bash
# Com Git:
git clone https://github.com/Vinicius-Morais-DN/vinicius-tech-labs.git
cd vinicius-tech-labs

# Ou extraia o .zip e entre na pasta raiz
```

### 2. Configurar o Backend

```bash
cd backend

# Copiar variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas informações:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="portfolio"
JWT_SECRET="coloque-uma-string-longa-e-aleatoria-aqui"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="suasenhaforte"
```

Instalar dependências Python:

```bash
# (Recomendado) Criar e ativar virtualenv:
python -m venv venv

# Linux / macOS:
source venv/bin/activate

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Instalar pacotes:
pip install -r requirements.txt
```

Iniciar o backend:

```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Confirme que está rodando acessando: **http://localhost:8001/api/**  
Resposta esperada: `{"message": "Portfolio API online"}`

---

### 3. Configurar o Frontend

```bash
cd ../frontend

# Copiar variáveis de ambiente
cp .env.example .env
```

O `.env` já deve conter:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Instalar dependências Node:

```bash
npm install --legacy-peer-deps
```

> O flag `--legacy-peer-deps` é necessário por conflito de versão entre `react-day-picker` e `date-fns`.

Iniciar o frontend:

```bash
npm start
```

O site abrirá em: **http://localhost:3000**

---

## Acessar o Painel Admin

1. Acesse diretamente: **http://localhost:3000/admin**  
   *(o botão Admin foi removido da navbar por segurança)*

2. **Será solicitado login** — não é possível acessar sem autenticação válida

3. Use as credenciais do `.env`:
   - Usuário: `admin` (ou o que você definiu em `ADMIN_USERNAME`)
   - Senha: a senha que você configurou em `ADMIN_PASSWORD`

4. No admin você edita: **foto, bio, texto Sobre Mim, currículo, skills, projetos, certificações, documentação e configurações de segurança (2FA).**

---

## 💾 Sistema de Salvamento Automático

### Como funciona

Toda vez que você edita algo no admin, os dados são salvos **automaticamente** em dois lugares:

1. ✅ **MongoDB** — banco de dados principal
2. ✅ **Arquivos JSON** — backups em `backend/saves/`

### Quando salva

- **Autosave (Geral/Skills):** 2 segundos após editar
- **Botão "Salvar tudo":** Salva todas as abas de uma vez
- **Projetos/Certificações/Docs:** Ao clicar no botão "Salvar" de cada item

### Arquivos de backup

```
backend/saves/
├── content.json          # Dados gerais (nome, foto, bio, sobre mim, currículo)
├── projects.json         # Lista de projetos
├── certifications.json   # Lista de certificações
├── areas.json            # Áreas de documentação
└── docpages.json         # Páginas de documentação
```

**Esses arquivos são legíveis e servem como backup permanente.** Se você perder o MongoDB ou precisar restaurar dados, os arquivos JSON contêm tudo.

### Indicadores visuais

- 🔵 **Salvando...** — está enviando ao servidor
- ✅ **Salvo às XX:XX:XX** — tudo sincronizado
- 🟡 **● alterações não salvas** — aguarde o autosave ou clique em "Salvar tudo"

---

## Verificação em Duas Etapas (2FA)

O admin suporta autenticação de dois fatores com qualquer app TOTP:

- **Google Authenticator** (Android / iOS)
- **Authy** (Android / iOS / Desktop)
- **Microsoft Authenticator**

### Como ativar:

1. Faça login no admin
2. Acesse a aba **Segurança**
3. Clique em **Ativar 2FA**
4. Escaneie o QR Code com o app no celular
5. Confirme com o código de 6 dígitos gerado
6. Pronto — todos os logins futuros pedirão o código

> O código se renova a cada 30 segundos. Mesmo que alguém descubra sua senha, não consegue entrar sem o celular.

---

## Integração GitHub

### Repositórios Públicos
Os repositórios públicos são buscados em tempo real da API do GitHub.  
Para apontar para o seu perfil, edite a constante no componente:

```
frontend/src/components/GitHubRepos.js
```

```js
const GITHUB_USER = "Vinicius-Morais-DN"; // ← altere aqui
```

### Sincronização de Documentação

**Importante:** Este sistema importa automaticamente todos os arquivos `.md` do seu repositório GitHub e os converte em páginas de documentação no portfólio.

#### Opção 1: Sincronização Manual (Botão no Admin)

1. Configure as variáveis de ambiente no `backend/.env`:
```env
GITHUB_DOCS_OWNER="Vinicius-Morais-DN"
GITHUB_DOCS_REPO="vinicius-tech-labs"
GITHUB_DOCS_BRANCH="main"
GITHUB_TOKEN=""  # opcional - aumenta limite da API
```

2. Acesse o painel admin: `http://localhost:3000/admin`
3. Vá para a aba **Documentação**
4. Clique no botão **"Sync GitHub"** (ícone do GitHub)
5. Confirme a substituição da documentação atual

⚠️ **Aviso:** Isso substitui TODA a documentação atual pelos arquivos `.md` do GitHub.

#### Opção 2: Sincronização Automática (GitHub Actions)

Para atualizar automaticamente quando você faz push de arquivos `.md`:

1. **Configure o backend em produção** (URL do backend + token de autenticação)
2. **Configure os Secrets no GitHub:**
   - `PORTFOLIO_BACKEND_URL`: URL do seu backend (ex: `https://seu-backend.com`)
   - `PORTFOLIO_API_TOKEN`: Token JWT válido do seu backend admin

3. **O workflow já está configurado** em `.github/workflows/sync-docs.yml`
   - Executa automaticamente quando você faz push de arquivos `.md`
   - Pode ser executado manualmente via GitHub Actions

**Como configurar os Secrets:**
1. Vá ao seu repositório no GitHub
2. Settings → Secrets and variables → Actions
3. Clique em "New repository secret"
4. Adicione `PORTFOLIO_BACKEND_URL` e `PORTFOLIO_API_TOKEN`

**Como obter o API Token:**
1. Faça login no painel admin
2. Use as credenciais configuradas no `.env`
3. O token JWT é retornado no login e válido por 12 horas
4. Para produção, considere implementar um endpoint de geração de token de longa duração

---

## MongoDB Portable (Windows)

Se não quiser instalar o MongoDB via instalador oficial:

```powershell
# 1. Baixar (MongoDB 7.0 portable, ~450MB)
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.21.zip"
Invoke-WebRequest -Uri $url -OutFile "$env:USERPROFILE\mongodb.zip" -UseBasicParsing

# 2. Extrair
Expand-Archive -Path "$env:USERPROFILE\mongodb.zip" `
               -DestinationPath "$env:USERPROFILE\mongodb" -Force

# 3. Criar pasta de dados
New-Item -ItemType Directory -Path "$env:USERPROFILE\mongodb-data" -Force

# 4. Iniciar (deixe este terminal aberto)
& "C:\Users\MASTER\mongodb\mongodb-win32-x86_64-windows-7.0.21\bin\mongod.exe" `
    --dbpath "C:\Users\MASTER\mongodb-data" `
    --port 27017 --bind_ip 127.0.0.1
```

---

## Estrutura do Projeto

```
vm-labs-portfolio/
├── README.md
├── backend/
│   ├── server.py              # API FastAPI: rotas, auth JWT, 2FA TOTP, seed
│   ├── requirements.txt       # Dependências Python
│   ├── .env                   # Variáveis de ambiente (não commitar)
│   ├── .env.example           # Modelo do .env
│   ├── uploads/               # Imagens e arquivos enviados via admin
│   └── saves/                 # ✨ Backups automáticos em JSON
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Hero.js         # Hero + terminal animado
    │   │   ├── AboutMe.js      # Seção Sobre Mim com foto e currículo
    │   │   ├── Skills.js       # Hard & Soft Skills
    │   │   ├── Certifications.js
    │   │   ├── GitHubRepos.js  # Integração GitHub API
    │   │   ├── Projects.js
    │   │   ├── Contact.js
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── Markdown.js
    │   ├── pages/
    │   │   ├── Home.js         # Página principal
    │   │   ├── AdminPage.js    # Painel admin (login, tabs, 2FA setup)
    │   │   └── DocsWiki.js     # Wiki de documentação
    │   ├── context/
    │   │   ├── ThemeContext.js  # Tema claro/escuro
    │   │   └── AuthContext.js   # Autenticação JWT + fluxo 2FA
    │   └── api.js               # Axios com interceptor de token
    ├── package.json
    └── .env
```

---

## Segurança

- ✅ **JWT** com expiração de 12 horas
- ✅ **Senha hasheada** com bcrypt (nunca salva em texto puro)
- ✅ **Rate limiting** — bloqueia por 15 min após 5 tentativas de login falhas
- ✅ **Autenticação obrigatória** — todas as rotas `/admin/*` exigem token válido
- ✅ **2FA TOTP opcional** — segunda camada de segurança com app autenticador
- ✅ **`.env` não commitado** — credenciais nunca vão pro Git

---

## Problemas Comuns

| Problema | Solução |
|---------|---------|
| `ERESOLVE` no npm install | Use `npm install --legacy-peer-deps` |
| Backend não conecta ao MongoDB | Confirme que o `mongod` está rodando em `localhost:27017` |
| Imagens não aparecem | Verifique se `backend/uploads/` existe e tem permissão de escrita |
| **Login admin não funciona** | Confira `ADMIN_USERNAME` / `ADMIN_PASSWORD` no `backend/.env` |
| **Acesso direto ao `/admin` sem senha** | Isso foi **corrigido** — agora exige login sempre |
| `Module not found` no frontend | Delete `node_modules/` e rode `npm install --legacy-peer-deps` novamente |
| Código 2FA inválido | Certifique-se que o horário do celular está sincronizado (automático) |
| GitHub repos não carregam | Limite da API pública do GitHub: 60 req/hora por IP. Aguarde ou use token |
| **Alterações não salvam** | Verifique se o backend está rodando e acessível em `localhost:8001` |

---

## Comandos Úteis

```bash
# Backend (dentro de backend/)
python -m uvicorn server:app --reload

# Frontend (dentro de frontend/)
npm start

# Limpar cache do frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Ver backups salvos
ls backend/saves/
# ou no Windows:
dir backend\saves\
```

---

## Licença

MIT — use, modifique e publique seu próprio portfólio.
