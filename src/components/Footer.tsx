import { Separator } from "@/components/ui/separator";
import { Brain, ChevronsRight } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useSection, useBi } from "@/hooks/useContent";

export function Footer() {
  const footer = useSection('footer');
  const bi = useBi();

  return (
    <footer className="bg-dark-section border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.greenMid }}>
                <Brain className="w-4 h-4" style={{ color: C.yellow }} />
              </div>
              <span className="font-semibold text-white text-lg" style={HDR_FONT}>Talsom<span className="font-light opacity-70">Forge</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">{bi(footer.tagline)}<br />Montr&eacute;al, Qu&eacute;bec.</p>
            <div className="flex gap-0.5 mt-4">
              {[0.2, 0.35, 0.5].map((op) => (
                <ChevronsRight key={op} className="w-4 h-4" style={{ color: C.yellow, opacity: op }} />
              ))}
            </div>
          </div>
          {footer.columns.map((col) => (
            <div key={bi(col.title)}>
              <p className="text-sm font-semibold text-white/60 mb-4">{bi(col.title)}</p>
              <div className="space-y-2.5">
                {col.links.map((l) => <a key={bi(l)} href="#" className="block text-sm text-white/30 hover:text-white/55 transition-colors">{bi(l)}</a>)}
              </div>
            </div>
          ))}
        </div>
        <Separator className="bg-white/5 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-white/20">{bi(footer.copyright)}</p>
          <div className="flex gap-4">
            {footer.bottomLinks.map((l) => <a key={bi(l)} href="#" className="text-xs text-white/20 hover:text-white/45 transition-colors">{bi(l)}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
