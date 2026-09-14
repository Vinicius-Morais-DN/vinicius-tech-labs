import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHome = location.pathname === "/";
  const linkCls = `font-mono text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
    isHome
      ? "text-slate-400 hover:text-emerald-400"
      : "text-muted-foreground hover:text-emerald-500 dark:hover:text-emerald-400"
  }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-auto max-w-[1280px] mt-5 px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between px-2 sm:px-4 py-3 ${
          isHome
            ? "bg-transparent border-none shadow-none"
            : "rounded-2xl border-none bg-[#343D3F]/80 backdrop-blur-xl shadow-lg shadow-black/5"
        }`}>
          <Link
            to="/"
            data-testid="nav-logo"
            className="relative"
          >
            <div className={`absolute inset-0 rounded-lg backdrop-blur-sm ${
              isHome
                ? "bg-[#343D3F]/30"
                : "bg-[#343D3F]/20"
            }`} />
            <span className={`relative font-mono text-sm font-bold tracking-tight hover:text-emerald-400 transition-colors ${
              isHome
                ? "text-white"
                : "text-[#343D3F] dark:text-white"
            }`}>
              vinicius@morais
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              data-testid="theme-toggle-button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
                isHome
                  ? "border-white/15 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40"
                  : "border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50"
              }`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Circular menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
                isHome
                  ? "border-white/15 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                  : "border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10"
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Menu overlay - works on both mobile and desktop */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-6 rounded-xl border border-[#343D3F] bg-[#343D3F]/95 backdrop-blur-xl shadow-lg shadow-black/10 overflow-hidden">
            <div className="flex flex-col gap-1 p-4">
              <button 
                onClick={() => { goSection("sobre"); setMobileMenuOpen(false); }} 
                className={`px-4 py-3 text-left rounded-lg transition-colors ${isHome ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5" : "text-white hover:text-emerald-400 hover:bg-white/5"}`}
              >
                Início
              </button>
              <button 
                onClick={() => { goSection("sobre-mim"); setMobileMenuOpen(false); }} 
                className={`px-4 py-3 text-left rounded-lg transition-colors ${isHome ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5" : "text-white hover:text-emerald-400 hover:bg-white/5"}`}
              >
                Sobre Mim
              </button>
              <Link 
                to="/docs" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-left rounded-lg transition-colors ${isHome ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5" : "text-white hover:text-emerald-400 hover:bg-white/5"}`}
              >
                Docs
              </Link>
              <button 
                onClick={() => { goSection("projetos"); setMobileMenuOpen(false); }} 
                className={`px-4 py-3 text-left rounded-lg transition-colors ${isHome ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5" : "text-white hover:text-emerald-400 hover:bg-white/5"}`}
              >
                Projetos
              </button>
              <button 
                onClick={() => { goSection("contato"); setMobileMenuOpen(false); }} 
                className={`px-4 py-3 text-left rounded-lg transition-colors ${isHome ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5" : "text-white hover:text-emerald-400 hover:bg-white/5"}`}
              >
                Contato
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
