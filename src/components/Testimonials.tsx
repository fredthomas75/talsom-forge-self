import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { getTestimonials } from "@/data/content";

export function Testimonials() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const testimonials = getTestimonials(lang);
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{t(lang, "T\u00e9moignages", "Testimonials")}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Ce que disent nos clients", "What our clients say")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Des leaders de l\u2019industrie nous font confiance pour acc\u00e9l\u00e9rer leur transformation.", "Industry leaders trust us to accelerate their transformation.")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {testimonials.map((tm) => (
            <Card key={tm.name} className={`reveal rounded-2xl border transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 mb-4 opacity-15" style={{ color: C.yellow }} />
                <p className={`text-sm leading-relaxed mb-6 ${dark ? "text-white/60" : "text-gray-600"}`}>{tm.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.greenLight, color: C.green }}>
                    {tm.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{tm.name}</p>
                    <p className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>{tm.role} · {tm.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
