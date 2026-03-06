import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang } from "@/lib/contexts";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, Zap } from "lucide-react";

export function ComparisonSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();

  const rows = [
    { label: t(lang, "Durée typique d'un diagnostic", "Typical diagnostic duration"), traditional: t(lang, "4-6 semaines", "4-6 weeks"), forge: t(lang, "1-2 semaines", "1-2 weeks") },
    { label: t(lang, "Livrables générés par séance", "Deliverables per session"), traditional: t(lang, "Manuels, post-atelier", "Manual, post-workshop"), forge: t(lang, "Automatisés, en temps réel", "Automated, real-time") },
    { label: t(lang, "Disponibilité des consultants", "Consultant availability"), traditional: t(lang, "Heures ouvrables", "Business hours"), forge: "24/7 (AI) + " + t(lang, "heures ouvrables", "business hours") },
    { label: t(lang, "Coût d'un diagnostic processus", "Process diagnostic cost"), traditional: t(lang, "30 000$ - 60 000$", "$30,000 - $60,000"), forge: t(lang, "À partir de 15 000$", "Starting at $15,000") },
    { label: t(lang, "Benchmark sectoriel intégré", "Built-in industry benchmarks"), traditional: false, forge: true },
    { label: t(lang, "Cartographies générées par AI", "AI-generated process maps"), traditional: false, forge: true },
    { label: t(lang, "Rapports de séance instantanés", "Instant session reports"), traditional: false, forge: true },
    { label: t(lang, "Suivi d'adoption en temps réel", "Real-time adoption tracking"), traditional: false, forge: true },
  ];

  return (
    <section className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight, color: dark ? C.yellow : C.green }}>
            {t(lang, "Pourquoi Talsom Forge", "Why Talsom Forge")}
          </Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {t(lang, "Consulting traditionnel vs Talsom Forge", "Traditional consulting vs Talsom Forge")}
          </h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>
            {t(lang, "L'expertise humaine, amplifiée par l'AI. Moins cher, plus rapide, plus précis.", "Human expertise, amplified by AI. More affordable, faster, more precise.")}
          </p>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
          {/* Header */}
          <div className={`grid grid-cols-3 ${dark ? "bg-white/[0.02]" : "bg-gray-50"}`}>
            <div className="p-4" />
            <div className={`p-4 text-center border-x ${dark ? "border-white/5" : "border-gray-100"}`}>
              <p className={`text-sm font-semibold ${dark ? "text-white/50" : "text-gray-500"}`}>{t(lang, "Consulting traditionnel", "Traditional consulting")}</p>
            </div>
            <div className="p-4 text-center relative">
              <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})` }} />
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4" style={{ color: C.yellow }} />
                <p className="text-sm font-bold" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>Talsom Forge</p>
              </div>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-t ${dark ? "border-white/5" : "border-gray-100"}`}>
              <div className="p-4 flex items-center">
                <p className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{row.label}</p>
              </div>
              <div className={`p-4 flex items-center justify-center border-x ${dark ? "border-white/5" : "border-gray-100"}`}>
                {typeof row.traditional === "boolean" ? (
                  row.traditional
                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                    : <X className={`w-5 h-5 ${dark ? "text-white/15" : "text-gray-200"}`} />
                ) : (
                  <p className={`text-sm text-center ${dark ? "text-white/40" : "text-gray-400"}`}>{row.traditional}</p>
                )}
              </div>
              <div className="p-4 flex items-center justify-center" style={{ background: dark ? "rgba(0,53,51,0.15)" : C.greenLight + "40" }}>
                {typeof row.forge === "boolean" ? (
                  row.forge
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: C.greenMid }} />
                    : <X className={`w-5 h-5 ${dark ? "text-white/15" : "text-gray-200"}`} />
                ) : (
                  <p className="text-sm text-center font-medium" style={{ color: dark ? C.yellow : C.green }}>{row.forge}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
