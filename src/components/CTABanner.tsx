import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang } from "@/lib/contexts";

export function CTABanner() {
  const { lang } = useLang();
  return (
    <section className="bg-hero py-24 relative overflow-hidden">
      <div className="absolute inset-0 chevron-pattern opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.15] blur-[140px]" style={{ background: C.yellow }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[140px]" style={{ background: "#4AE0D2" }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>{t(lang, "Pr\u00eat \u00e0 transformer votre organisation?", "Ready to transform your organization?")}</h2>
        <p className="text-lg text-white/45 mb-8">{t(lang, "Rejoignez la beta et acc\u00e9dez \u00e0 l\u2019expertise de Talsom Forge \u2014 consultants seniors et AI, disponibles en quelques clics.", "Join the beta and access Talsom Forge expertise \u2014 senior consultants and AI, available in just a few clicks.")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#contact">
            <Button size="lg" className="rounded-full px-8 h-12 font-semibold hover:opacity-90 border-0 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {t(lang, "Demander un acc\u00e8s beta", "Request beta access")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="#contact">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white transition-all">
              {t(lang, "Planifier une d\u00e9mo", "Schedule a demo")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
