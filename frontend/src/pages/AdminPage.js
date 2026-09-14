import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound, LogOut, Save, Plus, Trash2, ArrowLeft, FileText,
  Settings, BrainCircuit, FlaskConical, FolderTree, Inbox, Eye, Award, Upload,
  CheckCircle2, Github,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { DynIcon, ICON_OPTIONS } from "../utils/icons";
import Markdown from "../components/Markdown";
import api, { getApiErrorMessage } from "../api";

const inputCls = "w-full rounded-lg border border-border bg-background px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
const textareaCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y";
const btnPrimary = "inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 h-9 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50";
const btnGhost = "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 h-9 text-xs font-medium hover:border-cyan-500/50 hover:text-cyan-500 transition-colors";
const btnDanger = "inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-2.5 h-8 text-xs text-red-500 hover:bg-red-500/10 transition-colors";

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const parseTags = (t) => (typeof t === "string" ? t.split(",").map((x) => x.trim()).filter(Boolean) : t);

// ── Helpers de Upload ─────────────────────────────────────

function FileUpload({ onUploaded, testid }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onUploaded(res.data.url);
      toast.success("Imagem enviada!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erro no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} data-testid={testid} />
      <button type="button" data-testid={`${testid}-button`} className={btnGhost} onClick={() => ref.current.click()} disabled={uploading}>
        <Upload className="w-3.5 h-3.5" /> {uploading ? "Enviando..." : "Upload"}
      </button>
    </>
  );
}

function ResumeUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/admin/upload-file", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onUploaded(res.data.url);
      toast.success("Currículo enviado!");
    } catch {
      toast.error("Erro ao enviar currículo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handle} />
      <button type="button" className={btnGhost} onClick={() => ref.current.click()} disabled={uploading}>
        <Upload className="w-3.5 h-3.5" /> {uploading ? "Enviando..." : "Upload PDF"}
      </button>
    </>
  );
}

function DocImageUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL || ""}${res.data.url}`;
      onUploaded(fullUrl);
      toast.success("Imagem inserida!");
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
      <button type="button" className={btnGhost} onClick={() => ref.current.click()} disabled={uploading}
        title="Enviar imagem e inserir no Markdown">
        <Upload className="w-3.5 h-3.5" />
        {uploading ? "Enviando..." : "Inserir imagem"}
      </button>
    </>
  );
}

// ── Login ─────────────────────────────────────────────────

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    api.get("/health")
      .then((res) => setServerStatus(res.data))
      .catch(() => setServerStatus({ api: false, mongodb: false }));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      window.location.href = "/admin";
    } catch (err) {
      setError(getApiErrorMessage(err, "Usuário ou senha incorretos"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form data-testid="admin-login-modal" onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 mx-auto mb-4">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="font-display text-xl font-bold text-center mb-1">Painel Admin</h1>
        <p className="text-xs text-muted-foreground text-center mb-4">Acesso restrito — edição do portfólio</p>

        {serverStatus && (
          <div className={`mb-4 rounded-lg border px-3 py-2 text-[11px] font-mono ${
            serverStatus.api && serverStatus.mongodb
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
              : "border-amber-500/30 bg-amber-500/10 text-amber-500"
          }`}>
            {!serverStatus.api && "⚠ Backend offline — rode start.ps1"}
            {serverStatus.api && !serverStatus.mongodb && "⚠ MongoDB offline — rode start.ps1 para iniciar tudo"}
            {serverStatus.api && serverStatus.mongodb && "✓ Servidor e banco online"}
          </div>
        )}

        <div className="space-y-3">
          <input data-testid="admin-username-input" value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário" required className={inputCls} autoComplete="username" />
          <input data-testid="admin-password-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha" required className={inputCls} autoComplete="current-password" />
          {error && <p data-testid="admin-login-error" className="text-xs text-red-500">{error}</p>}
          <button data-testid="admin-submit-button" type="submit" disabled={loading}
            className="w-full rounded-lg bg-cyan-500 h-10 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <Link to="/" className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-cyan-500">
          <ArrowLeft className="w-3 h-3" /> Voltar ao site
        </Link>
      </form>
    </div>
  );
}

// ── Indicador de status de save ───────────────────────────

function SaveStatus({ saving, dirty, lastSaved }) {
  if (saving) return (
    <span className="flex items-center gap-1.5 text-[11px] text-cyan-500 font-mono">
      <span className="w-3 h-3 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin inline-block" />
      salvando no servidor...
    </span>
  );
  if (!dirty && lastSaved) return (
    <span className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono">
      <CheckCircle2 className="w-3 h-3" />
      salvo às {lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
  if (dirty) return (
    <span className="text-[11px] text-amber-500 font-mono">● alterações não salvas</span>
  );
  return null;
}

// ── GeneralTab — com imperativeHandle para salvar externamente ──

const GeneralTab = forwardRef(function GeneralTab({ content, onSaved }, ref) {
  const [form, setForm] = useState(content);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => { setForm(content); setDirty(false); }, [content]);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const save = async (formToSave) => {
    setSaving(true);
    try {
      await api.put("/admin/content", { ...formToSave, badges: parseTags(formToSave.badges) });
      setDirty(false);
      setLastSaved(new Date());
      onSaved();
      toast.success("Geral salvo no servidor e em backend/saves/", { duration: 2000 });
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao salvar Geral"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Expõe save() para o pai chamar via ref
  useImperativeHandle(ref, () => ({
    save: () => save(form),
    isDirty: () => dirty,
  }));

  const handleChange = (newForm) => {
    setForm(newForm);
    setDirty(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(newForm), 2000);
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const photoSrc = form.photo
    ? form.photo.startsWith("http") ? form.photo : `${backendUrl}${form.photo}`
    : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="h-5"><SaveStatus saving={saving} dirty={dirty} lastSaved={lastSaved} /></div>

      {/* ── Hero (página inicial) ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Hero — Página Inicial</h3>
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Etiqueta verde (ex: // SOBRE MIM) — deixe vazio para ocultar
            </label>
            <input
              data-testid="admin-hero-tag-input"
              className={inputCls}
              placeholder="// SOBRE MIM"
              value={form.heroTag || ""}
              onChange={(e) => handleChange({ ...form, heroTag: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Status com bolinha verde — deixe vazio para ocultar
            </label>
            <input
              data-testid="admin-hero-status-input"
              className={inputCls}
              placeholder="Disponível para estágio / primeira oportunidade"
              value={form.heroStatus || ""}
              onChange={(e) => handleChange({ ...form, heroStatus: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio curta (texto abaixo do nome)</label>
            <textarea
              data-testid="admin-bio-input"
              rows={3}
              className={textareaCls}
              placeholder="Estudante de Infraestrutura de Redes & Linux. Home lab próprio..."
              value={form.bio || ""}
              onChange={(e) => handleChange({ ...form, bio: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ── Identidade ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Identidade</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome</label>
            <input data-testid="admin-name-input" className={inputCls} value={form.name || ""} onChange={(e) => handleChange({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Título profissional</label>
            <input data-testid="admin-title-input" className={inputCls} value={form.title || ""} onChange={(e) => handleChange({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Localização</label>
            <input className={inputCls} value={form.location || ""} onChange={(e) => handleChange({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail</label>
            <input data-testid="admin-email-input" className={inputCls} value={form.email || ""} onChange={(e) => handleChange({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Telefone/WhatsApp</label>
            <input className={inputCls} value={form.phone || ""} onChange={(e) => handleChange({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn URL</label>
            <input data-testid="admin-linkedin-input" className={inputCls} value={form.linkedin || ""} onChange={(e) => handleChange({ ...form, linkedin: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub URL</label>
            <input data-testid="admin-github-input" className={inputCls} value={form.github || ""} onChange={(e) => handleChange({ ...form, github: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ── Foto de perfil ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Foto de Perfil</h3>
        <div className="flex items-start gap-4 flex-wrap">
          {photoSrc ? (
            <img src={photoSrc} alt="Foto de perfil" className="w-20 h-20 rounded-xl object-cover border border-border" />
          ) : (
            <div className="w-20 h-20 rounded-xl border border-dashed border-border bg-secondary flex items-center justify-center text-xs text-muted-foreground">
              Sem foto
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input data-testid="admin-photo-input" className={`${inputCls} flex-1`}
                placeholder="URL da foto ou faça upload →" value={form.photo || ""}
                onChange={(e) => handleChange({ ...form, photo: e.target.value })} />
              <FileUpload testid="admin-photo-upload" onUploaded={(url) => handleChange({ ...form, photo: url })} />
            </div>
            <p className="text-[11px] text-muted-foreground">Recomendado: imagem quadrada, mínimo 400×400px.</p>
          </div>
        </div>
      </div>

      {/* ── Sobre mim ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Sobre Mim</h3>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Texto da aba "Sobre Mim" — separe parágrafos com linha em branco
          </label>
          <textarea data-testid="admin-abouttext-input" rows={6} className={textareaCls}
            placeholder="Olá! Sou Vinicius..." value={form.aboutText || ""}
            onChange={(e) => handleChange({ ...form, aboutText: e.target.value })} />
        </div>
      </div>

      {/* ── Currículo ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Currículo</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input data-testid="admin-resume-input" className={`${inputCls} flex-1 min-w-[200px]`}
            placeholder="URL do currículo ou faça upload →" value={form.resumeUrl || ""}
            onChange={(e) => handleChange({ ...form, resumeUrl: e.target.value })} />
          <ResumeUpload onUploaded={(url) => handleChange({ ...form, resumeUrl: url })} />
          {form.resumeUrl && (
            <a href={form.resumeUrl.startsWith("http") ? form.resumeUrl : `${backendUrl}${form.resumeUrl}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-cyan-500 hover:underline font-mono truncate max-w-[180px]">
              Ver arquivo ↗
            </a>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">Aceita PDF, DOC ou DOCX (máx 10MB).</p>
      </div>

      {/* ── Badges ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Badges / Especialidades</h3>
        <input className={inputCls} placeholder="Redes, Linux, Cybersegurança, Home Lab"
          value={Array.isArray(form.badges) ? form.badges.join(", ") : form.badges || ""}
          onChange={(e) => handleChange({ ...form, badges: e.target.value })} />
        <p className="text-[11px] text-muted-foreground mt-1.5">Separe com vírgula.</p>
      </div>

      {/* ── Separator Text ── */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Texto do Separador Animado</h3>
        <input className={inputCls} placeholder="Digite o texto para aparecer no divisor animado..."
          value={form.separatorText || ""}
          onChange={(e) => handleChange({ ...form, separatorText: e.target.value })} />
        <p className="text-[11px] text-muted-foreground mt-1.5">Texto editável que aparece entre o Hero e as Skills com efeito de luz.</p>
      </div>
    </div>
  );
});

// ── SkillsTab — com imperativeHandle ─────────────────────

const SkillsTab = forwardRef(function SkillsTab({ content, onSaved }, ref) {
  const [hard, setHard] = useState([]);
  const [soft, setSoft] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const debounceRef = useRef(null);
  const hardRef = useRef(hard);
  const softRef = useRef(soft);

  useEffect(() => {
    setHard(content.hardSkills || []);
    setSoft(content.softSkills || []);
    hardRef.current = content.hardSkills || [];
    softRef.current = content.softSkills || [];
    setDirty(false);
  }, [content]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const save = async (h, s) => {
    setSaving(true);
    try {
      await api.put("/admin/content", { ...content, hardSkills: h, softSkills: s });
      setDirty(false);
      setLastSaved(new Date());
      onSaved();
      toast.success("Skills salvas no servidor e em backend/saves/", { duration: 2000 });
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao salvar Skills"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: () => save(hardRef.current, softRef.current),
    isDirty: () => dirty,
  }));

  const triggerAutosave = (h, s) => {
    setDirty(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(h, s), 2000);
  };

  const updateHard = (newHard) => {
    setHard(newHard);
    hardRef.current = newHard;
    triggerAutosave(newHard, softRef.current);
  };
  const updateSoft = (newSoft) => {
    setSoft(newSoft);
    softRef.current = newSoft;
    triggerAutosave(hardRef.current, newSoft);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="h-5"><SaveStatus saving={saving} dirty={dirty} lastSaved={lastSaved} /></div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Hard Skills (com percentual)</h3>
          <button data-testid="admin-add-hardskill" className={btnGhost}
            onClick={() => updateHard([...hard, { name: "Nova skill", level: 50, icon: "terminal" }])}>
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {hard.map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-3 grid grid-cols-[1fr_110px_130px_90px_36px] gap-2 items-center max-sm:grid-cols-2">
              <input className={inputCls} value={s.name}
                onChange={(e) => updateHard(hard.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <select className={inputCls} value={s.icon}
                onChange={(e) => updateHard(hard.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)))}>
                {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <input data-testid={`admin-skill-level-${i}`} type="range" min="0" max="100" value={s.level}
                onChange={(e) => updateHard(hard.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x)))}
                className="accent-cyan-500" />
              <span className="font-mono text-xs text-cyan-500 text-center">{s.level}%</span>
              <button className={btnDanger} onClick={() => updateHard(hard.filter((_, j) => j !== i))}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Soft Skills</h3>
          <button data-testid="admin-add-softskill" className={btnGhost}
            onClick={() => updateSoft([...soft, { name: "Nova soft skill", description: "" }])}>
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {soft.map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex gap-2">
                <input className={inputCls} value={s.name}
                  onChange={(e) => updateSoft(soft.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <button className={btnDanger} onClick={() => updateSoft(soft.filter((_, j) => j !== i))}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea rows={2} className={textareaCls} value={s.description}
                onChange={(e) => updateSoft(soft.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── CrudCardList ─────────────────────────────────────────

function CrudCardList({ items, reload, endpoint, empty, fields, labels, testPrefix }) {
  const [forms, setForms] = useState({});
  const [newItem, setNewItem] = useState(null);

  const getForm = (p) => forms[p.id] || p;
  const setForm = (id, data) => setForms((f) => ({ ...f, [id]: data }));

  const save = async (p) => {
    const data = { ...getForm(p), tags: parseTags(getForm(p).tags) };
    try {
      await api.put(`/admin/${endpoint}/${p.id}`, data);
      toast.success("Salvo no servidor e em backend/saves/", { duration: 2500 });
      reload();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao salvar"));
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Excluir "${p.title}"?`)) return;
    try {
      await api.delete(`/admin/${endpoint}/${p.id}`);
      toast.success("Excluído e backup atualizado em backend/saves/");
      reload();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao excluir"));
    }
  };

  const create = async () => {
    const data = { ...newItem, tags: parseTags(newItem.tags), order: items.length };
    try {
      await api.post(`/admin/${endpoint}`, data);
      toast.success("Criado e salvo em backend/saves/", { duration: 2500 });
      setNewItem(null);
      reload();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao criar"));
    }
  };

  const renderForm = (p, isNew) => {
    const f = isNew ? newItem : getForm(p);
    const upd = isNew ? setNewItem : (data) => setForm(p.id, data);
    return (
      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.row1.map((field) =>
            field === "status" ? (
              <select key={field} className={inputCls} value={f.status} onChange={(e) => upd({ ...f, status: e.target.value })}>
                <option>Em andamento</option>
                <option>Concluído</option>
                <option>Planejado</option>
              </select>
            ) : (
              <input key={field} className={inputCls} placeholder={labels[field]} value={f[field] || ""} onChange={(e) => upd({ ...f, [field]: e.target.value })} />
            )
          )}
        </div>
        {fields.row2 && (
          <div className="grid sm:grid-cols-1 gap-3">
            {fields.row2.map((field) => (
              <input key={field} className={inputCls} placeholder={labels[field] || field} value={f[field] || ""} onChange={(e) => upd({ ...f, [field]: e.target.value })} />
            ))}
          </div>
        )}
        <textarea rows={2} className={textareaCls} placeholder="Descrição" value={f.description || ""} onChange={(e) => upd({ ...f, description: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Tags (vírgula)" value={Array.isArray(f.tags) ? f.tags.join(", ") : f.tags} onChange={(e) => upd({ ...f, tags: e.target.value })} />
          <input className={inputCls} placeholder="Link (opcional)" value={f.link || ""} onChange={(e) => upd({ ...f, link: e.target.value })} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input className={`${inputCls} flex-1 min-w-[200px]`} placeholder="URL da imagem (ou faça upload)" value={f.image || ""} onChange={(e) => upd({ ...f, image: e.target.value })} />
          <FileUpload testid={`${testPrefix}-upload-${isNew ? "new" : p.id}`} onUploaded={(url) => upd({ ...f, image: url })} />
          {f.image && (
            <div className="relative">
              <img src={f.image} alt="preview" className="w-12 h-12 rounded object-cover border border-border" />
              <button onClick={() => upd({ ...f, image: "" })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">×</button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isNew ? (
            <>
              <button data-testid={`${testPrefix}-create`} className={btnPrimary} onClick={create} disabled={!newItem.title}>
                <Plus className="w-3.5 h-3.5" /> Criar
              </button>
              <button className={btnGhost} onClick={() => setNewItem(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <button data-testid={`${testPrefix}-save-${p.id}`} className={btnPrimary} onClick={() => save(p)}>
                <Save className="w-3.5 h-3.5" /> Salvar
              </button>
              <button className={btnDanger} onClick={() => remove(p)}>
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">{labels.heading} ({items.length})</h3>
        {!newItem && (
          <button data-testid={`${testPrefix}-new`} className={btnGhost} onClick={() => setNewItem(empty)}>
            <Plus className="w-3.5 h-3.5" /> Novo
          </button>
        )}
      </div>
      {newItem && renderForm(null, true)}
      {items.map((p) => <div key={p.id}>{renderForm(p, false)}</div>)}
    </div>
  );
}

// ── DocsTab ──────────────────────────────────────────────

function DocsTab({ areas, reload }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [newArea, setNewArea] = useState(null);
  const [preview, setPreview] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const area = areas.find((a) => a.slug === selectedArea);

  const syncGithubDocs = async () => {
    if (!window.confirm("Isso vai substituir TODA a documentação atual pelos arquivos .md do GitHub. Continuar?")) return;
    setSyncing(true);
    try {
      const res = await api.post("/admin/sync-github-docs");
      toast.success(res.data.message || "Sincronização concluída!");
      reload();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Erro ao sincronizar com GitHub");
    } finally {
      setSyncing(false);
    }
  };

  const createArea = async () => {
    try {
      await api.post("/admin/areas", { ...newArea, slug: slugify(newArea.name), order: areas.length });
      toast.success("Área criada!");
      setNewArea(null);
      reload();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Erro ao criar área");
    }
  };

  const deleteArea = async (a) => {
    if (!window.confirm(`Excluir a área "${a.name}" e todas as suas páginas?`)) return;
    await api.delete(`/admin/areas/${a.slug}`);
    toast.success("Área excluída");
    setSelectedArea(null);
    reload();
  };

  const savePage = async () => {
    try {
      if (editingPage.id) {
        await api.put(`/admin/pages/${editingPage.id}`, editingPage);
      } else {
        await api.post("/admin/pages", editingPage);
      }
      toast.success("Página salva no servidor e em backend/saves/", { duration: 2500 });
      setEditingPage(null);
      reload();
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Erro ao salvar página"));
    }
  };

  const deletePage = async (p) => {
    if (!window.confirm(`Excluir a página "${p.title}"?`)) return;
    await api.delete(`/admin/pages/${p.id}`);
    toast.success("Página excluída");
    reload();
  };

  if (editingPage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button className={btnGhost} onClick={() => { setEditingPage(null); setPreview(false); }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </button>
          <div className="flex gap-2">
            <button data-testid="admin-page-preview" className={btnGhost} onClick={() => setPreview(!preview)}>
              <Eye className="w-3.5 h-3.5" /> {preview ? "Editor" : "Preview"}
            </button>
            <button data-testid="admin-save-page" className={btnPrimary} onClick={savePage} disabled={!editingPage.title}>
              <Save className="w-3.5 h-3.5" /> Salvar página
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Título da página</label>
            <input data-testid="admin-page-title" className={inputCls} value={editingPage.title}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value, slug: editingPage.id ? editingPage.slug : slugify(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug (URL)</label>
            <input className={inputCls} value={editingPage.slug}
              onChange={(e) => setEditingPage({ ...editingPage, slug: slugify(e.target.value) })}
              disabled={!!editingPage.id} />
          </div>
        </div>
        {preview ? (
          <div className="rounded-xl border border-border bg-card p-6 min-h-[400px]">
            <Markdown>{editingPage.content}</Markdown>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-medium text-muted-foreground">
                Conteúdo (Markdown — suporta títulos, código, tabelas, links)
              </label>
              <DocImageUpload onUploaded={(url) => {
                const md = `\n![imagem](${url})\n`;
                setEditingPage((p) => ({ ...p, content: p.content + md }));
              }} />
            </div>
            <textarea data-testid="admin-page-content" rows={20}
              className={`${textareaCls} font-mono text-[13px]`}
              value={editingPage.content}
              onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })} />
            <p className="text-[11px] text-muted-foreground">
              Dica: use o botão "Inserir imagem" para fazer upload direto no servidor.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm">Áreas</h3>
          <div className="flex gap-2">
            <button data-testid="admin-sync-github" className={btnGhost} onClick={syncGithubDocs} disabled={syncing}
              title="Importar todos os arquivos .md do GitHub (substitui documentação atual)">
              <Github className="w-3.5 h-3.5" /> {syncing ? "Sync..." : "Sync GitHub"}
            </button>
            <button data-testid="admin-new-area" className={btnGhost}
              onClick={() => setNewArea({ name: "", icon: "folder", description: "" })}>
              <Plus className="w-3.5 h-3.5" /> Nova
            </button>
          </div>
        </div>
        {newArea && (
          <div className="rounded-lg border border-cyan-500/40 p-3 space-y-2">
            <input data-testid="admin-area-name" className={inputCls} placeholder="Nome da área"
              value={newArea.name} onChange={(e) => setNewArea({ ...newArea, name: e.target.value })} />
            <select className={inputCls} value={newArea.icon}
              onChange={(e) => setNewArea({ ...newArea, icon: e.target.value })}>
              {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input className={inputCls} placeholder="Descrição curta"
              value={newArea.description} onChange={(e) => setNewArea({ ...newArea, description: e.target.value })} />
            <div className="flex gap-2">
              <button data-testid="admin-create-area" className={btnPrimary} onClick={createArea} disabled={!newArea.name}>Criar</button>
              <button className={btnGhost} onClick={() => setNewArea(null)}>Cancelar</button>
            </div>
          </div>
        )}
        {areas.map((a) => (
          <button key={a.slug} data-testid={`admin-area-${a.slug}`} onClick={() => setSelectedArea(a.slug)}
            className={`w-full flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
              selectedArea === a.slug ? "border-cyan-500/60 bg-cyan-500/10" : "border-border hover:border-cyan-500/40"
            }`}>
            <DynIcon name={a.icon} className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="text-sm font-medium flex-1">{a.name}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{a.pages?.length || 0}</span>
          </button>
        ))}
      </div>

      <div>
        {!area ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Selecione uma área para gerenciar suas páginas de documentação
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <DynIcon name={area.icon} className="w-4 h-4 text-cyan-500" /> {area.name}
              </h3>
              <div className="flex gap-2">
                <button data-testid="admin-new-page" className={btnGhost}
                  onClick={() => setEditingPage({ area: area.slug, slug: "", title: "", content: "# Título\n\nEscreva aqui...\n", order: (area.pages || []).length })}>
                  <Plus className="w-3.5 h-3.5" /> Nova página
                </button>
                <button className={btnDanger} onClick={() => deleteArea(area)}>
                  <Trash2 className="w-3.5 h-3.5" /> Excluir área
                </button>
              </div>
            </div>
            {(area.pages || []).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">/areas/{area.slug}/{p.slug}</p>
                </div>
                <button data-testid={`admin-edit-page-${p.slug}`} className={btnGhost} onClick={() => setEditingPage(p)}>Editar</button>
                <button className={btnDanger} onClick={() => deletePage(p)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {(area.pages || []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">Nenhuma página nesta área ainda.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MessagesTab ──────────────────────────────────────────

function MessagesTab() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/admin/messages").then((r) => setMessages(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-3 max-w-2xl">
      <h3 className="font-display font-semibold">Mensagens recebidas ({messages.length})</h3>
      {messages.length === 0 && <p className="text-sm text-muted-foreground italic">Nenhuma mensagem ainda.</p>}
      {messages.map((m) => (
        <div key={m.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
            <span className="text-sm font-semibold">{m.name}</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {m.email} — {new Date(m.created_at).toLocaleString("pt-BR")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────

const TABS = [
  { id: "geral",         label: "Geral",         icon: Settings     },
  { id: "skills",        label: "Skills",        icon: BrainCircuit },
  { id: "projetos",      label: "Projetos",      icon: FlaskConical },
  { id: "certificacoes", label: "Certificações", icon: Award        },
  { id: "docs",          label: "Documentação",  icon: FolderTree   },
  { id: "mensagens",     label: "Mensagens",     icon: Inbox        },
];

const PROJECT_FIELDS = { row1: ["title", "status"] };
const PROJECT_LABELS = { title: "Título", heading: "Projetos & Labs" };
const CERT_FIELDS    = { row1: ["title", "issuer", "year"], row2: ["image"] };
const CERT_LABELS    = { title: "Título do certificado", issuer: "Emissor (ex: Cisco, FIAP)", year: "Ano", heading: "Certificações & Cursos" };

// ── AdminPage principal ──────────────────────────────────

export default function AdminPage() {
  const { user, checking, logout, forceLogout } = useAuth();
  const [tab, setTab]                       = useState("geral");
  const [content, setContent]               = useState(null);
  const [areas, setAreas]                   = useState([]);
  const [projects, setProjects]             = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [globalSaving, setGlobalSaving]     = useState(false);
  const [globalSaved, setGlobalSaved]       = useState(false);

  // Refs para chamar save() de cada tab de fora
  const generalRef = useRef(null);
  const skillsRef  = useRef(null);

  const reload = () => {
    api.get("/content").then((r) => setContent(r.data)).catch(() => {});
    api.get("/areas").then((r) => setAreas(r.data)).catch(() => {});
    api.get("/projects").then((r) => setProjects(r.data)).catch(() => {});
    api.get("/certifications").then((r) => setCertifications(r.data)).catch(() => {});
  };

  useEffect(() => { if (user) reload(); }, [user]);

  // ── Botão "Salvar tudo" ─────────────────────────────────
  const saveAll = async () => {
    setGlobalSaving(true);
    setGlobalSaved(false);
    try {
      const results = await Promise.allSettled([
        generalRef.current?.save(),
        skillsRef.current?.save(),
      ]);
      const tabsOk = results.every((r) => r.status === "fulfilled" && r.value !== false);
      await api.post("/admin/export-saves");
      reload();
      if (tabsOk) {
        setGlobalSaved(true);
        toast.success("Tudo salvo no servidor e exportado para backend/saves/", { duration: 3000 });
        setTimeout(() => setGlobalSaved(false), 4000);
      } else {
        toast.warning("Backup exportado, mas algumas abas falharam. Verifique Geral e Skills.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Erro ao salvar tudo"));
    } finally {
      setGlobalSaving(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono">verificando sessão...</span>
      </div>
    );
  }

  if (!user) return <LoginForm />;

  return (
    <div data-testid="admin-panel-container" className="min-h-screen">
      {/* Header sticky */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-500">
              <KeyRound className="w-4 h-4" />
            </span>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-sm">Painel Admin</h1>
              <p className="text-[11px] text-muted-foreground font-mono">logado como {user.username}</p>
            </div>
          </div>

          {/* Botão Salvar Tudo — centralizado e em destaque */}
          <button
            onClick={saveAll}
            disabled={globalSaving}
            className={`inline-flex items-center gap-2 rounded-xl px-5 h-10 text-sm font-semibold transition-all shadow-md ${
              globalSaved
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
            } disabled:opacity-60`}
          >
            {globalSaving ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-slate-950/40 border-t-transparent animate-spin" />
                Salvando...
              </>
            ) : globalSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar tudo
              </>
            )}
          </button>

          {/* Ações */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" data-testid="admin-view-site" className={btnGhost}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver site</span>
            </Link>
            <button onClick={forceLogout} className={btnGhost} title="Limpar sessão e forçar logout">
              <KeyRound className="w-3.5 h-3.5" />
            </button>
            <button data-testid="admin-logout-button" onClick={logout} className={btnDanger}>
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t.id} data-testid={`admin-tab-${t.id}`} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 h-9 text-xs font-medium whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "bg-cyan-500 text-slate-950"
                  : "border border-border text-muted-foreground hover:text-cyan-500 hover:border-cyan-500/50"
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das tabs */}
        {tab === "geral"         && content && <GeneralTab ref={generalRef} content={content} onSaved={reload} />}
        {tab === "skills"        && content && <SkillsTab  ref={skillsRef}  content={content} onSaved={reload} />}
        {tab === "projetos"      && (
          <CrudCardList items={projects} reload={reload} endpoint="projects" testPrefix="admin-project"
            empty={{ title: "", description: "", tags: [], status: "Em andamento", link: "", image: "", order: 0 }}
            fields={PROJECT_FIELDS} labels={PROJECT_LABELS} />
        )}
        {tab === "certificacoes" && (
          <CrudCardList items={certifications} reload={reload} endpoint="certifications" testPrefix="admin-cert"
            empty={{ title: "", issuer: "", year: "", description: "", tags: [], link: "", image: "", order: 0 }}
            fields={CERT_FIELDS} labels={CERT_LABELS} />
        )}
        {tab === "docs"          && <DocsTab areas={areas} reload={reload} />}
        {tab === "mensagens"     && <MessagesTab />}
      </div>
    </div>
  );
}
