import { Separator } from "@/components/ui/separator";
import { Brain, ChevronsRight } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang } from "@/lib/contexts";

export function Footer() {
  const { lang } = useLang();
  const footerCols = lang === "fr"
    ? [
        { title: "Services", links: ["Business et Process Design", "Roadmap de modernisation", "Roadmap IA", "Performance organisationnelle"] },
        { title: "Marketplace", links: ["Talsom Forge Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
        { title: "Entreprise", links: ["\u00c0 propos", "Carri\u00e8res", "Blog", "Contact", "Mentions l\u00e9gales"] },
      ]
    : [
        { title: "Services", links: ["Business & Process Design", "Modernization Roadmap", "AI Roadmap", "Organizational Performance"] },
        { title: "Marketplace", links: ["Talsom Forge Hub", "AI Backlog Manager", "Privacy Assessor", "Governance Suite"] },
        { title: "Company", links: ["About", "Careers", "Blog", "Contact", "Legal"] },
      ];
  const bottomLinks = lang === "fr" ? ["Confidentialit\u00e9", "Conditions", "Cookies"] : ["Privacy", "Terms", "Cookies"];

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
            <p className="text-sm text-white/30 leading-relaxed">{t(lang, "Plateforme de consulting virtuel.", "Virtual consulting platform.")}<br />Montr\u00e9al, Qu\u00e9bec.</p>
            <div className="flex gap-0.5 mt-4">
              {[0.2, 0.35, 0.5].map((op) => (
                <ChevronsRight key={op} className="w-4 h-4" style={{ color: C.yellow, opacity: op }} />
              ))}
            </div>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white/60 mb-4">{col.title}</p>
              <div className="space-y-2.5">
                {col.links.map((l) => <a key={l} href="#" className="block text-sm text-white/30 hover:text-white/55 transition-colors">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <Separator className="bg-white/5 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-white/20">{t(lang, "\u00a9 2026 Talsom. Tous droits r\u00e9serv\u00e9s. Plateforme beta \u2014 acc\u00e8s sur invitation.", "\u00a9 2026 Talsom. All rights reserved. Beta platform \u2014 invite only.")}</p>
          <div className="flex gap-4">
            {bottomLinks.map((l) => <a key={l} href="#" className="text-xs text-white/20 hover:text-white/45 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
