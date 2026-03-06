import { Badge } from "@/components/ui/badge";
import { Target, MessageSquare, Zap, TrendingUp } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";

export function HowItWorks() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();
  const steps = lang === "fr"
    ? [
        { icon: Target, title: "Choisissez", desc: "S\u00e9lectionnez un domaine d\u2019expertise parmi nos 4 cat\u00e9gories de services." },
        { icon: MessageSquare, title: "\u00c9changez", desc: "Affinez votre besoin avec nos consultants seniors et notre chat AI expert." },
        { icon: Zap, title: "Recevez", desc: "Obtenez vos livrables co-produits par nos consultants et agents AI." },
        { icon: TrendingUp, title: "It\u00e9rez", desc: "Am\u00e9liorez continuellement avec le suivi et les recommandations." },
      ]
    : [
        { icon: Target, title: "Choose", desc: "Select an area of expertise from our 4 service categories." },
        { icon: MessageSquare, title: "Discuss", desc: "Refine your needs with our senior consultants and expert AI chat." },
        { icon: Zap, title: "Receive", desc: "Get your deliverables co-produced by our consultants and AI agents." },
        { icon: TrendingUp, title: "Iterate", desc: "Continuously improve with tracking and recommendations." },
      ];

  return (
    <section className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight, color: dark ? C.yellow : C.green }}>{t(lang, "Comment \u00e7a marche", "How it works")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Du besoin au livrable en quelques clics", "From need to deliverable in a few clicks")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Notre plateforme combine l\u2019automatisation AI avec l\u2019expertise humaine pour vous livrer des r\u00e9sultats de qualit\u00e9 consulting, plus rapidement.", "Our platform combines AI automation with human expertise to deliver consulting-grade results, faster.")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
          {steps.map((step, i) => (
            <div key={step.title} className="reveal relative">
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px" style={{ background: dark ? "rgba(255,255,255,0.06)" : C.silver }} />}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl border shadow-sm flex items-center justify-center mx-auto mb-4 relative group hover:scale-105 transition-transform duration-300 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
                  <step.icon className="w-7 h-7" style={{ color: dark ? C.yellow : C.green }} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: C.yellow, color: C.green }}>
                    {i + 1}
                  </div>
                </div>
                <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
