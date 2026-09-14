import { Linkedin, Github, TerminalSquare } from "lucide-react";

export default function Footer({ content }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-4 h-4 text-cyan-500" />
          <span className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} {content.name || "Vinicius de Morais"} — infra, redes & segurança
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a data-testid="footer-linkedin" href={content.linkedin} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-cyan-500 transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a data-testid="footer-github" href={content.github} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-cyan-500 transition-colors" aria-label="GitHub">
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
