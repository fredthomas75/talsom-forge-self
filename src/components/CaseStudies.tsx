import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang } from "@/lib/contexts";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, ArrowUpRight } from "lucide-react";

function getCaseStudies(lang: "fr" | "en") {
  return [
    {
      client: "Desjardins",
      sector: t(lang, "Services financiers", "Financial services"),
      title: t(lang, "Refonte du processus order-to-cash", "Order-to-cash process redesign"),
      challenge: t(lang, "Processus OTC de 12 jours avec 6 transferts manuels et 3 points de ressaisie.", "12-day OTC process with 6 manual handoffs and 3 data re-entry points."),
      solution: t(lang, "Redesign AI Native avec agents de prédiction et automatisation des approbations.", "AI Native redesign with prediction agents and approval automation."),
      results: [
        { metric: "-65%", label: t(lang, "Temps de cycle", "Cycle time") },
        { metric: "3.2x", label: "ROI" },
        { metric: t(lang, "8 sem.", "8 wks"), label: t(lang, "Livré en", "Delivered in") },
      ],
      service: "Business et Process Design",
      color: "#00897B",
    },
    {
      client: "Pomerleau",
      sector: t(lang, "Construction", "Construction"),
      title: t(lang, "Roadmap de modernisation TI", "IT modernization roadmap"),
      challenge: t(lang, "40% de dette technique et systèmes hérités bloquant l'innovation.", "40% technical debt and legacy systems blocking innovation."),
      solution: t(lang, "Audit AI du parc applicatif et roadmap de migration cloud en 3 vagues.", "AI-powered application portfolio audit and 3-wave cloud migration roadmap."),
      results: [
        { metric: "-40%", label: t(lang, "Dette technique", "Technical debt") },
        { metric: "2.8x", label: "ROI" },
        { metric: "18 " + t(lang, "mois", "months"), label: t(lang, "Horizon", "Horizon") },
      ],
      service: t(lang, "Roadmap de modernisation", "Modernization Roadmap"),
      color: "#1565C0",
    },
    {
      client: "Hydro-Québec",
      sector: t(lang, "Énergie", "Energy"),
      title: t(lang, "Programme de gestion du changement", "Change management program"),
      challenge: t(lang, "Résistance au changement et faible adoption lors de la transformation numérique.", "Change resistance and low adoption during digital transformation."),
      solution: t(lang, "Ateliers virtuels co-facilités AI avec parcours personnalisés par profil employé.", "AI co-facilitated virtual workshops with employee-specific adoption journeys."),
      results: [
        { metric: "94%", label: t(lang, "Taux d'adoption", "Adoption rate") },
        { metric: "+3x", label: t(lang, "Productivité ateliers", "Workshop productivity") },
        { metric: t(lang, "12 sem.", "12 wks"), label: t(lang, "Déploiement", "Deployment") },
      ],
      service: t(lang, "Performance organisationnelle", "Organizational Performance"),
      color: "#F57F17",
    },
  ];
}

export function CaseStudies() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const cases = getCaseStudies(lang);
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>
            {t(lang, "Études de cas", "Case studies")}
          </Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {t(lang, "Des résultats concrets, mesurables", "Concrete, measurable results")}
          </h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>
            {t(lang, "Découvrez comment nos clients ont transformé leurs opérations avec Talsom Forge.", "See how our clients have transformed their operations with Talsom Forge.")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {cases.map((cs) => (
            <Card key={cs.client} className={`reveal group rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] ${dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"}`}>
              <div className="h-1.5" style={{ background: cs.color }} />
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>{cs.client}</p>
                    <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>{cs.sector}</p>
                  </div>
                  <ArrowUpRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${dark ? "text-white/30" : "text-gray-300"}`} />
                </div>

                <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>{cs.title}</h3>

                <div className="space-y-2 mb-5">
                  <div className="flex items-start gap-2">
                    <Target className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
                    <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{cs.challenge}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                    <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{cs.solution}</p>
                  </div>
                </div>

                <div className={`rounded-xl p-3 grid grid-cols-3 gap-2 ${dark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                  {cs.results.map((r) => (
                    <div key={r.label} className="text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-3 h-3" style={{ color: cs.color }} />
                        <p className="text-sm font-bold" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>{r.metric}</p>
                      </div>
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{r.label}</p>
                    </div>
                  ))}
                </div>

                <Badge variant="secondary" className={`mt-4 text-[10px] rounded-full px-2.5 ${dark ? "bg-white/5 text-white/30" : "bg-gray-50 text-gray-400"}`}>
                  {cs.service}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
