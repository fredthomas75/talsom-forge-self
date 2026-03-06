import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";

export function Testimonials() {
  const { badge, title, subtitle, items } = useSection('testimonials');
  const bi = useBi();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{bi(badge)}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{bi(title)}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{bi(subtitle)}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {items.map((tm) => (
            <Card key={tm.name} className={`reveal rounded-2xl border transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 mb-4 opacity-15" style={{ color: C.yellow }} />
                <p className={`text-sm leading-relaxed mb-6 ${dark ? "text-white/60" : "text-gray-600"}`}>{bi(tm.quote)}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.greenLight, color: C.green }}>
                    {tm.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{tm.name}</p>
                    <p className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>{bi(tm.role)} · {tm.company}</p>
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
