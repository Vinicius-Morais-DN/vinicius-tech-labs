import { Linkedin, Github, Mail, Phone } from "lucide-react";

export default function Contact({ content }) {
  const phoneNumber = content.phone || "(11) 97889-8143"; // Substitua pelo seu número
  const email = content.email || "1vinicius.morais1@gmail.com";

  return (
    <section id="contato" data-testid="contato-section" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12">
          <span className="font-mono text-xs text-cyan-500 tracking-widest uppercase">// contato</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-2">Vamos conversar?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
            Aberto a oportunidades, estágios e colaborações em infraestrutura, redes e segurança.
          </p>
        </div>

        <div className="max-w-md space-y-4">
          <a data-testid="contact-whatsapp" href={`https://wa.me/55${phoneNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-cyan-500/50 transition-colors group">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366]">
              <Phone className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{phoneNumber}</p>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
            </div>
          </a>

          <a data-testid="contact-email" href={`mailto:${email}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-cyan-500/50 transition-colors group">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              <Mail className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{email}</p>
              <p className="text-xs text-muted-foreground">E-mail</p>
            </div>
          </a>

          <a data-testid="contact-linkedin" href={content.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-cyan-500/50 transition-colors group">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2]">
              <Linkedin className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">LinkedIn</p>
              <p className="text-xs text-muted-foreground">linkedin.com/in/vinicius-morais</p>
            </div>
          </a>

          <a data-testid="contact-github" href={content.github || "https://github.com/Vinicius-Morais-DN/vinicius-tech-labs"}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-cyan-500/50 transition-colors group">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-500/10 border border-slate-500/30 text-foreground">
              <Github className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">GitHub</p>
              <p className="text-xs text-muted-foreground">github.com/Vinicius-Morais-DN</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
