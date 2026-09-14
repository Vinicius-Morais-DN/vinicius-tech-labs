import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search, ChevronDown, ChevronRight, FileText, FolderOpen,
  ArrowLeft, Github, RefreshCw, ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Markdown from "../components/Markdown";
import { DynIcon } from "../utils/icons";
import api, { getApiErrorMessage } from "../api";

const GITHUB_REPO = "https://github.com/Vinicius-Morais-DN/vinicius-tech-labs";

function pathToUrl(path) {
  return `/docs/${path.replace(/\.md$/, "")}`;
}

function urlToPath(pathname) {
  const prefix = "/docs/";
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.slice(prefix.length);
  return rest ? `${rest}.md` : null;
}

function collectPages(nodes, pages = []) {
  for (const node of nodes || []) {
    if (node.type === "page") pages.push(node);
    if (node.children) collectPages(node.children, pages);
  }
  return pages;
}

function filterTree(nodes, query) {
  if (!query) return nodes;
  const q = query.toLowerCase();
  const result = [];

  for (const node of nodes || []) {
    if (node.type === "page") {
      if (node.title.toLowerCase().includes(q) || node.path.toLowerCase().includes(q)) {
        result.push(node);
      }
    } else {
      const children = filterTree(node.children, q);
      if (children.length > 0 || node.name.toLowerCase().includes(q)) {
        result.push({ ...node, children });
      }
    }
  }
  return result;
}

function TreeNode({ node, docPath, openFolders, toggleFolder, depth = 0 }) {
  if (node.type === "page") {
    const active = docPath === node.path;
    return (
      <Link
        to={pathToUrl(node.path)}
        data-testid={`doc-page-${node.slug}`}
        className={`flex items-center gap-2 py-1.5 pr-3 text-[13px] transition-colors ${
          active
            ? "text-cyan-500 font-medium border-l-2 border-cyan-500 -ml-px"
            : "text-muted-foreground hover:text-foreground"
        }`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <FileText className="w-3 h-3 shrink-0" />
        <span className="truncate">{node.title}</span>
      </Link>
    );
  }

  const key = `${node.type}-${node.slug || node.name}-${depth}`;
  const isOpen = openFolders[key] !== false;

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleFolder(key)}
        className="w-full flex items-center gap-1.5 py-1.5 pr-3 text-left text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-cyan-500 shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 shrink-0" />
        )}
        <FolderOpen className="w-3 h-3 text-cyan-500/70 shrink-0" />
        <span className="truncate capitalize">{node.name.replace(/-/g, " ")}</span>
      </button>
      {isOpen && (node.children || []).map((child, i) => (
        <TreeNode
          key={`${child.path || child.slug || child.name}-${i}`}
          node={child}
          docPath={docPath}
          openFolders={openFolders}
          toggleFolder={toggleFolder}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function DocsWiki() {
  const navigate = useNavigate();
  const location = useLocation();
  const docPath = urlToPath(location.pathname);

  const [treeData, setTreeData] = useState(null);
  const [page, setPage] = useState(null);
  const [content, setContent] = useState({});
  const [search, setSearch] = useState("");
  const [openAreas, setOpenAreas] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadTree = (refresh = false) => {
    setLoadingTree(true);
    setError("");
    return api.get("/github/docs/tree", { params: refresh ? { refresh: true } : {} })
      .then((r) => {
        setTreeData(r.data);
        const open = {};
        (r.data.areas || []).forEach((a) => { open[a.slug] = true; });
        setOpenAreas(open);
        return r.data;
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, "Erro ao carregar documentação do GitHub"));
        return null;
      })
      .finally(() => setLoadingTree(false));
  };

  useEffect(() => {
    loadTree();
    api.get("/content").then((r) => setContent(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!treeData) return;

    const allPages = (treeData.areas || []).flatMap((a) => collectPages(a.children));
    if (!docPath && allPages.length > 0) {
      navigate(pathToUrl(allPages[0].path), { replace: true });
      return;
    }

    if (!docPath) return;

    setLoadingPage(true);
    setPage(null);
    api.get("/github/docs/content", { params: { path: docPath } })
      .then((r) => setPage(r.data))
      .catch((err) => setError(getApiErrorMessage(err, "Erro ao carregar página")))
      .finally(() => setLoadingPage(false));
  }, [docPath, treeData, navigate]);

  const filteredAreas = useMemo(() => {
    if (!treeData?.areas) return [];
    if (!search.trim()) return treeData.areas;
    return treeData.areas
      .map((area) => ({
        ...area,
        children: filterTree(area.children, search.trim()),
      }))
      .filter((area) => area.children.length > 0 || area.name.toLowerCase().includes(search.toLowerCase()));
  }, [treeData, search]);

  const toggleFolder = (key) => {
    setOpenFolders((prev) => ({ ...prev, [key]: prev[key] === false }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTree(true);
    if (docPath) {
      try {
        const r = await api.get("/github/docs/content", { params: { path: docPath } });
        setPage(r.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Erro ao atualizar página"));
      }
    }
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 sm:pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-cyan-500 tracking-widest uppercase">// base de conhecimento</span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">
                Labs & Documentação
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Documentação sincronizada do repositório{" "}
                <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline font-mono text-xs">
                  vinicius-tech-labs
                </a>
                {" "}— cada commit no GitHub atualiza aqui automaticamente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loadingTree}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 h-9 text-xs font-medium hover:border-cyan-500/50 hover:text-cyan-500 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Atualizar
              </button>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 h-9 text-xs font-medium hover:border-cyan-500/50 hover:text-cyan-500 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> Ver no GitHub
              </a>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            <aside className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="doc-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar na documentação..."
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <nav data-testid="doc-tree-sidebar" className="rounded-xl border border-border bg-card overflow-hidden">
                {loadingTree && (
                  <p className="p-4 text-sm text-muted-foreground text-center">Carregando do GitHub...</p>
                )}
                {!loadingTree && filteredAreas.map((area) => (
                  <div key={area.slug} className="border-b border-border last:border-0">
                    <button
                      type="button"
                      data-testid={`doc-category-${area.slug}`}
                      onClick={() => setOpenAreas((p) => ({ ...p, [area.slug]: !p[area.slug] }))}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-secondary/60 transition-colors"
                    >
                      {openAreas[area.slug] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                      <DynIcon name={area.icon} className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span className="text-sm font-semibold flex-1">{area.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {collectPages(area.children).length}
                      </span>
                    </button>
                    {openAreas[area.slug] && (
                      <div className="pb-2">
                        {(area.children || []).length === 0 ? (
                          <p className="px-4 pl-11 py-1 text-[12px] text-muted-foreground italic">
                            Nenhum .md publicado ainda
                          </p>
                        ) : (
                          area.children.map((node, i) => (
                            <TreeNode
                              key={`${area.slug}-${node.path || node.name}-${i}`}
                              node={node}
                              docPath={docPath}
                              openFolders={openFolders}
                              toggleFolder={toggleFolder}
                              depth={1}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {!loadingTree && filteredAreas.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    {search ? `Nenhum resultado para "${search}"` : "Nenhuma documentação encontrada no repositório"}
                  </p>
                )}
              </nav>

              {treeData?.cached_at && (
                <p className="text-[10px] font-mono text-muted-foreground px-1">
                  Sincronizado: {new Date(treeData.cached_at).toLocaleString("pt-BR")}
                  {treeData.cached ? " (cache)" : ""}
                </p>
              )}
            </aside>

            <div data-testid="doc-content-viewer" className="rounded-xl border border-border bg-card min-h-[500px]">
              {loadingPage && (
                <div className="flex items-center justify-center h-[500px] text-sm text-muted-foreground">
                  Carregando Markdown...
                </div>
              )}
              {!loadingPage && page && (
                <div>
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-border text-xs text-muted-foreground font-mono flex-wrap">
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-500" />
                    <Link to="/docs" className="hover:text-cyan-500">docs</Link>
                    <span>/</span>
                    <span className="text-cyan-500">{page.path}</span>
                    {page.github_url && (
                      <a
                        href={page.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1 text-cyan-500 hover:underline"
                      >
                        Editar no GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <Markdown>{page.content}</Markdown>
                  </div>
                </div>
              )}
              {!loadingPage && !page && !docPath && !loadingTree && (
                <div className="flex flex-col items-center justify-center h-[500px] text-center px-6">
                  <FolderOpen className="w-10 h-10 text-cyan-500/50 mb-4" />
                  <h2 className="font-display text-lg font-semibold mb-2">Selecione uma página</h2>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Escolha um documento na barra lateral ou publique um .md no repositório GitHub.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Link to="/" data-testid="docs-back-home" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao início
            </Link>
          </div>
        </div>
      </div>
      <Footer content={content} />
    </div>
  );
}
