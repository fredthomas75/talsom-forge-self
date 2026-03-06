import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, Moon, Sun } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";

const SECTION_IDS = ["services", "marketplace", "ai-chat", "tarification", "contact"];

export function Nav() {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Find active section
      let current = "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = lang === "fr"
    ? [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Tarification", href: "#tarification" }, { label: "Contact", href: "#contact" }]
    : [{ label: "Services", href: "#services" }, { label: "Marketplace", href: "#marketplace" }, { label: "AI Chat", href: "#ai-chat" }, { label: "Pricing", href: "#tarification" }, { label: "Contact", href: "#contact" }];

  const dark = theme === "dark";

  const isActive = (href: string) => activeSection === href.replace("#", "");

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? (dark ? "bg-gray-950/90 backdrop-blur-lg shadow-sm border-b border-white/5" : "bg-white/90 backdrop-blur-lg shadow-sm border-b") : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
            <Brain className="w-5 h-5" style={{ color: C.yellow }} />
          </div>
          <span className={`font-semibold text-lg tracking-tight ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} style={HDR_FONT}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition-colors relative ${
                isActive(l.href)
                  ? (scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white")
                  : (scrolled ? (dark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-900") : "text-white/60 hover:text-white")
              }`}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="absolute -bottom-1 inset-x-0 h-0.5 rounded-full" style={{ background: C.yellow }} />
              )}
            </a>
          ))}

          {/* Language toggle */}
          <div className={`flex items-center gap-0.5 text-xs font-semibold rounded-full border px-1 py-0.5 ${scrolled ? (dark ? "border-white/10" : "border-gray-200") : "border-white/15"}`}>
            <button onClick={() => setLang("fr")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "fr" ? "text-white" : scrolled ? (dark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-600") : "text-white/40 hover:text-white/70"}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`px-2 py-0.5 rounded-full transition-all ${lang === "en" ? "text-white" : scrolled ? (dark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-600") : "text-white/40 hover:text-white/70"}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>

          {/* Dark mode toggle */}
          <button onClick={toggle} className={`p-2 rounded-full transition-colors ${scrolled ? (dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100") : "text-white/50 hover:text-white hover:bg-white/10"}`} aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a href="#contact">
            <Button size="sm" className="rounded-full px-5 font-semibold border-0 hover:opacity-90 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {t(lang, "Démo gratuite", "Free demo")}
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className={`p-2 rounded-full ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label={open ? t(lang, "Fermer le menu", "Close menu") : t(lang, "Ouvrir le menu", "Open menu")}>
            {open ? <X className={`w-5 h-5 ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? (dark ? "text-white" : "text-gray-900") : "text-white"}`} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden border-t p-4 space-y-3 ${dark ? "bg-gray-950 border-white/5" : "bg-white"}`}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`block text-sm py-2 ${isActive(l.href) ? (dark ? "text-white font-semibold" : "text-gray-900 font-semibold") : (dark ? "text-white/70" : "text-gray-700")}`} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="flex items-center gap-2 py-2">
            <button onClick={() => setLang("fr")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "fr" ? "text-white" : (dark ? "text-white/40 border border-white/10" : "text-gray-400 border border-gray-200")}`} style={lang === "fr" ? { background: C.green } : undefined}>FR</button>
            <button onClick={() => setLang("en")} className={`text-xs font-semibold px-3 py-1 rounded-full ${lang === "en" ? "text-white" : (dark ? "text-white/40 border border-white/10" : "text-gray-400 border border-gray-200")}`} style={lang === "en" ? { background: C.green } : undefined}>EN</button>
          </div>
          <a href="#contact" onClick={() => setOpen(false)}>
            <Button className="w-full rounded-full font-semibold" style={{ background: C.yellow, color: C.green }}>{t(lang, "Démo gratuite", "Free demo")}</Button>
          </a>
        </div>
      )}
    </nav>
  );
}
