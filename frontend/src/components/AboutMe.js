import { Download, Linkedin, Github, MapPin, User, ChevronRight } from "lucide-react";

export default function AboutMe({ content }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const photoSrc = content.photo
    ? content.photo.startsWith("http")
      ? content.photo
      : `${backendUrl}${content.photo}`
    : null;

  const resumeHref = content.resumeUrl
    ? content.resumeUrl.startsWith("http")
      ? content.resumeUrl
      : `${backendUrl}${content.resumeUrl}`
    : null;

  const paragraphs = (content.aboutText || content.bio || "")
    .split("\n\n")
    .filter(Boolean);

  const introParagraphs = paragraphs.length > 1 ? paragraphs.slice(0, -1) : paragraphs;
  const lastParagraph = paragraphs.length > 1 ? paragraphs[paragraphs.length - 1] : null;

  return (
    <section
      id="sobre-mim"
      data-testid="about-section"
      className="py-16 bg-background"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">
            // sobre mim
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">
            Quem sou <span className="text-emerald-500">eu</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={content.name || "Foto de perfil"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <User className="w-20 h-20 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-background" />
            </div>

            <div className="text-center lg:text-left">
              <h3 className="font-display text-lg font-bold">
                {content.name || "Vinicius de Morais"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {content.title || "Estudante de Infraestrutura de Redes & Linux"}
              </p>
              {content.location && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {content.location}
                </span>
              )}
            </div>

            {resumeHref && (
              <a
                href={resumeHref}
                download
                data-testid="resume-download-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 h-10 text-xs font-semibold text-white hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Currículo
              </a>
            )}

            <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
              {content.linkedin && (
                <a
                  href={content.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 h-9 text-xs font-medium text-foreground hover:border-emerald-500/60 hover:text-emerald-500 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
              {content.github && (
                <a
                  href={content.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 h-9 text-xs font-medium text-foreground hover:border-emerald-500/60 hover:text-emerald-500 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              {paragraphs.length > 0 ? (
                <>
                  <div className="space-y-2 pt-1">
                    <h4 className="font-display font-semibold text-sm sm:text-base text-foreground">
                      Atualmente
                    </h4>
                    <div className="terminal-window">
                      <div className="terminal-header">
                        <span className="terminal-dot bg-red-500/80" />
                        <span className="terminal-dot bg-amber-500/80" />
                        <span className="terminal-dot bg-emerald-500/80" />
                        <span className="ml-2 text-[10px] text-slate-500 font-mono">vinicius@homelab:~</span>
                      </div>
                      <div className="terminal-body">
                        <div className="mb-2">
                          <div className="flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[11px]">whoami</span>
                          </div>
                          <div className="text-slate-400 pl-4 text-[11px]">vinicius-morais</div>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[11px]">cat current-focus.txt</span>
                          </div>
                          <div className="text-slate-400 pl-4 text-[11px]">Redes, Linux, Cybersegurança</div>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[11px]">systemctl status learning</span>
                          </div>
                          <div className="text-emerald-400 pl-4 text-[11px]">● learning.service — active (running)</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 text-emerald-400" />
                          <span className="terminal-cursor" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {introParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                  {lastParagraph && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {lastParagraph}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Texto de apresentação ainda não configurado.{" "}
                  <span className="text-emerald-500">
                    Edite no painel Admin → Geral → Sobre Mim.
                  </span>
                </p>
              )}
            </div>

            {(content.badges || []).length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase mb-2">
                  // especialidades
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(content.badges || []).map((b) => (
                    <span
                      key={b}
                      className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
