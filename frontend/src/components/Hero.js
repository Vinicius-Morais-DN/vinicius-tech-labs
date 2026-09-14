import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import HeroBackground from "./HeroBackground";

const TERMINAL_LINES = [
  { cmd: "whoami", out: "vinicius-morais" },
  { cmd: "cat role.txt", out: "Estudante de Infraestrutura de Redes & Linux" },
  { cmd: "systemctl status homelab", out: "● homelab.service — active (running)", green: true },
  { cmd: "ls ~/labs", out: "redes/  cyberseguranca/  infraestrutura/  programacao/" },
];

function useTypewriter() {
  const [lines, setLines] = useState([]);
  const [current, setCurrent] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState("cmd");

  useEffect(() => {
    if (lineIdx >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[lineIdx];
    const target = phase === "cmd" ? line.cmd : line.out;
    if (current.length < target.length) {
      const t = setTimeout(() => setCurrent(target.slice(0, current.length + 1)), phase === "cmd" ? 50 : 16);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (phase === "cmd") {
        setPhase("out");
        setCurrent("");
      } else {
        setLines((prev) => [...prev, line]);
        setCurrent("");
        setPhase("cmd");
        setLineIdx((i) => i + 1);
      }
    }, phase === "cmd" ? 220 : 450);
    return () => clearTimeout(t);
  }, [current, phase, lineIdx]);

  return { lines, current, lineIdx, phase, done: lineIdx >= TERMINAL_LINES.length };
}

function TerminalPrompt({ children, className = "" }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <span className="text-emerald-400 shrink-0 font-mono text-[13px]">&gt;</span>
      <span className="font-mono text-[13px] leading-relaxed">{children}</span>
    </div>
  );
}

export default function Hero({ content }) {
  const { theme } = useTheme();
  const { lines, current, lineIdx, phase, done } = useTypewriter();
  const currentLine = lineIdx < TERMINAL_LINES.length ? TERMINAL_LINES[lineIdx] : null;
  const nameParts = (content.name || "Vinicius de Morais").trim().split(/\s+/);
  const firstName = nameParts[0]?.toUpperCase() || "VINICIUS";
  const restName = nameParts.slice(1).join(" ").toUpperCase() || "DE MORAIS";
  const isDark = theme === "dark";

  return (
    <section
      id="sobre"
      data-testid="sobre-section"
      className={`relative overflow-hidden ${isDark ? "bg-[#050607] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="relative min-h-screen flex flex-col">
        {isDark && <HeroBackground />}

        {!isDark && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
        )}

        <div className="relative flex-1 flex items-center z-10">
          <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 pt-28 pb-16 grid lg:grid-cols-[1fr_1fr] gap-10 xl:gap-20 items-center min-h-[calc(100vh-2rem)]">

            {/* ── Coluna esquerda ── */}
            <div className="relative z-10">
              {content.heroTag?.trim() && (
                <p className="font-mono text-emerald-500 text-sm tracking-wide mb-6" data-testid="hero-tag">
                  {content.heroTag.trim()}
                </p>
              )}

              <h1 className="font-display font-black uppercase leading-[0.9] tracking-tight">
                <span className={`block text-[clamp(2.8rem,8vw,6.5rem)] ${isDark ? "text-white" : "text-slate-900"}`}>
                  {firstName}
                </span>
                <span
                  className="block text-[clamp(2.8rem,8vw,6.5rem)] text-transparent mt-1"
                  style={{
                    WebkitTextStroke: isDark
                      ? "1.5px rgba(255,255,255,0.75)"
                      : "1.5px rgba(15,23,42,0.55)",
                  }}
                >
                  {restName}
                </span>
              </h1>

              {(content.bio?.trim() || content.title?.trim()) && (
                <p
                  className={`mt-8 max-w-lg text-[15px] sm:text-base leading-relaxed ${isDark ? "text-slate-300/90" : "text-slate-600"}`}
                  data-testid="hero-bio"
                >
                  {content.bio?.trim() || content.title}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  data-testid="hero-cta-projetos"
                  onClick={() => document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-8 h-[52px] font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-white transition-colors shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                >
                  Ver Projetos &amp; Labs <span className="text-white/90">&gt;</span>
                </button>
                <Link
                  data-testid="hero-cta-docs"
                  to="/docs"
                  className={`inline-flex items-center rounded-full border px-8 h-[52px] font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                    isDark
                      ? "border-white/25 hover:border-white/45 text-white/90 hover:text-white"
                      : "border-slate-300 text-slate-700 hover:border-emerald-500"
                  }`}
                >
                  Explorar Documentação
                </Link>
              </div>

              {content.heroStatus?.trim() && (
                <p
                  className={`mt-10 flex items-center gap-3 text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  data-testid="hero-status"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  {content.heroStatus.trim()}
                </p>
              )}
            </div>

            {/* ── Terminal ── */}
            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="hero-terminal w-full max-w-[520px]" data-testid="hero-terminal">
                <div className="hero-terminal-bar">
                  <span className="hero-terminal-dot bg-[#ff5f57]" />
                  <span className="hero-terminal-dot bg-[#febc2e]" />
                  <span className="hero-terminal-dot bg-[#28c840]" />
                  <span className="ml-3 font-mono text-[11px] text-slate-500">vinicius@homelab:~</span>
                </div>
                <div className="hero-terminal-body">
                  {lines.map((l, i) => (
                    <div key={i} className="mb-4">
                      <TerminalPrompt>
                        <span className="text-emerald-400">{l.cmd}</span>
                      </TerminalPrompt>
                      <p className={`pl-5 mt-1 font-mono text-[13px] ${l.green ? "text-emerald-400" : "text-slate-400"}`}>
                        {l.out}
                      </p>
                    </div>
                  ))}
                  {!done && currentLine && (
                    <div className="mb-4">
                      {phase === "cmd" ? (
                        <TerminalPrompt>
                          <span className="text-emerald-400">{current}</span>
                          <span className="hero-terminal-cursor" />
                        </TerminalPrompt>
                      ) : (
                        <>
                          <TerminalPrompt>
                            <span className="text-emerald-400">{currentLine.cmd}</span>
                          </TerminalPrompt>
                          <p className={`pl-5 mt-1 font-mono text-[13px] ${currentLine.green ? "text-emerald-400" : "text-slate-400"}`}>
                            {current}
                            <span className="hero-terminal-cursor" />
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  {done && (
                    <TerminalPrompt>
                      <span className="hero-terminal-cursor" />
                    </TerminalPrompt>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] z-10">
        <div className="mx-auto max-w-6xl px-6 py-3">
          {content.separatorText && (
            <p className="text-center font-mono text-xs tracking-widest uppercase text-emerald-500/40">
              {content.separatorText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
