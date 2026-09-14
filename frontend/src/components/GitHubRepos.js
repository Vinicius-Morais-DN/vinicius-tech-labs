import { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink, Github, Circle } from "lucide-react";

const GITHUB_USER = "Vinicius-Morais-DN";

const LANG_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dockerfile: "#384d54",
  Go: "#00ADD8",
  Rust: "#dea584",
  default: "#8b949e",
};

function LangDot({ lang }) {
  const color = LANG_COLORS[lang] || LANG_COLORS.default;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Circle className="w-2.5 h-2.5 shrink-0" style={{ fill: color, color }} />
      {lang}
    </span>
  );
}

export default function GitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6&type=public`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        // Filtra forks e ordena por stars depois por updated
        const filtered = data
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 6);
        setRepos(filtered);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="github" data-testid="github-section" className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">
              // github
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">
              Repositórios Públicos
            </h2>
          </div>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 h-9 text-xs font-medium text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            Ver perfil completo
          </a>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card animate-pulse h-36" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Github className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os repositórios. Verifique sua conexão ou o rate limit da API do GitHub.
            </p>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-500 hover:underline"
            >
              Visitar perfil no GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum repositório público encontrado.</p>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-card rounded-xl p-5 flex flex-col gap-3 group"
                data-testid="github-repo-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-semibold truncate group-hover:text-emerald-500 transition-colors">
                      {repo.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-emerald-500 transition-colors" />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {repo.description || "Sem descrição."}
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  {repo.language && <LangDot lang={repo.language} />}
                  {repo.stargazers_count > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <GitFork className="w-3 h-3" /> {repo.forks_count}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground/60 ml-auto">
                    {new Date(repo.updated_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
