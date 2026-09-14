import { useEffect, useRef, useState } from "react";
import { DynIcon } from "../utils/icons";
import { BrainCircuit } from "lucide-react";

export default function Skills({ content }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" data-testid="skills-section" ref={ref} className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Hard & Soft Skills</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {(content.hardSkills || []).map((s, i) => (
              <div key={s.name} className="glow-card rounded-xl p-5" data-testid={`hard-skill-${i}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-500">
                      <DynIcon name={s.icon} className="w-4.5 h-4.5 w-5 h-5" />
                    </span>
                    <span className="text-sm font-semibold">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs text-cyan-500">{s.level}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    data-testid="skill-progress-bar"
                    className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    style={{ width: visible ? `${s.level}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {(content.softSkills || []).map((s, i) => (
              <div key={s.name} className="glow-card rounded-xl p-5 flex gap-4" data-testid={`soft-skill-${i}`}>
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
                  <BrainCircuit className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{s.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
