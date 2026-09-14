import { Award, ExternalLink, Download, Maximize2 } from "lucide-react";
import { useState } from "react";

export default function Certifications({ certifications }) {
  if (!certifications || certifications.length === 0) return null;

  const [zoomedImage, setZoomedImage] = useState(null);

  const handleDownload = (e, imageUrl, title) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = imageUrl.startsWith('http') ? imageUrl : `${process.env.REACT_APP_BACKEND_URL || ''}${imageUrl}`;
    link.download = `${title.replace(/\s+/g, '_')}_certificado.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="certificacoes" data-testid="certificacoes-section" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-500 tracking-widest uppercase">// certificações</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">Certificações & Cursos</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{certifications.length} certificados</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((c, i) => (
            <article key={c.id || i} data-testid="certification-card" className="glow-card rounded-xl overflow-hidden flex flex-col">
              {c.image && (
                <div className="h-36 overflow-hidden border-b border-border relative group">
                  <img 
                    src={c.image.startsWith('http') ? c.image : `${process.env.REACT_APP_BACKEND_URL || ''}${c.image}`} 
                    alt={c.title} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 cursor-pointer" 
                    loading="lazy" 
                    onClick={() => setZoomedImage(c.image)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => handleDownload(e, c.image, c.title)}
                      className="bg-white/90 hover:bg-white text-black rounded-lg p-2 hover:scale-110 transition-transform"
                      title="Fazer download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setZoomedImage(c.image)}
                      className="bg-white/90 hover:bg-white text-black rounded-lg p-2 hover:scale-110 transition-transform"
                      title="Ampliar imagem"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500">
                    <Award className="w-4 h-4" />
                  </span>
                  {c.year && <span className="font-mono text-xs text-muted-foreground">{c.year}</span>}
                </div>
                <h3 className="font-display text-base font-semibold mb-1">{c.title}</h3>
                {c.issuer && <p className="text-xs font-mono text-cyan-500 mb-2">{c.issuer}</p>}
                {c.description && <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{c.description}</p>}
                <div className="flex items-center justify-between gap-3 flex-wrap mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {(c.tags || []).map((t) => (
                      <span key={t} className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] font-mono text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  {c.link && (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" data-testid={`certification-link-${i}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
                      Ver credencial <ExternalLink className="w-3 h-3" />
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
              alt="Certificado ampliado"
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
