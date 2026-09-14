import { ExternalLink, FlaskConical, Download, Maximize2 } from "lucide-react";
import { useState } from "react";

const STATUS_STYLES = {
  "Concluído": "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Em andamento": "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Planejado": "border-slate-500/40 bg-slate-500/10 text-slate-500 dark:text-slate-400",
};

export default function Projects({ projects }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleDownload = (e, imageUrl, title) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = imageUrl.startsWith('http') ? imageUrl : `${process.env.REACT_APP_BACKEND_URL || ''}${imageUrl}`;
    link.download = `${title.replace(/\s+/g, '_')}_projeto.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="projetos" data-testid="projetos-section" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-500 tracking-widest uppercase">// labs & projetos</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">Projetos & Labs</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{projects.length} experimentos documentados</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <article key={p.id || i} data-testid="project-card" className="glow-card rounded-xl overflow-hidden flex flex-col">
              {p.image && (
                <div className="h-40 overflow-hidden border-b border-border relative group">
                  <img 
                    src={p.image.startsWith('http') ? p.image : `${process.env.REACT_APP_BACKEND_URL || ''}${p.image}`} 
                    alt={p.title} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 cursor-pointer" 
                    loading="lazy"
                    onClick={() => setZoomedImage(p.image)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => handleDownload(e, p.image, p.title)}
                      className="bg-white/90 hover:bg-white text-black rounded-lg p-2 hover:scale-110 transition-transform"
                      title="Fazer download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setZoomedImage(p.image)}
                      className="bg-white/90 hover:bg-white text-black rounded-lg p-2 hover:scale-110 transition-transform"
                      title="Ampliar imagem"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-cyan-500 shrink-0" />
                    {p.title}
                  </h3>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[p.status] || STATUS_STYLES["Planejado"]}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.description}</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-wrap gap-1.5">
                    {(p.tags || []).map((t) => (
                      <span key={t} className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] font-mono text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" data-testid={`project-link-${i}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
                      Ver detalhes <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal de zoom de imagem */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={zoomedImage.startsWith('http') ? zoomedImage : `${process.env.REACT_APP_BACKEND_URL || ''}${zoomedImage}`}
              alt="Projeto ampliado"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
