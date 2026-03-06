import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";

export function Pricing() {
  const { badge, title, subtitle, plans } = useSection('pricing');
  const bi = useBi();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();

  return (
    <section id="tarification" className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{bi(badge)}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{bi(title)}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{bi(subtitle)}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto reveal-stagger">
          {plans.map((p) => (
            <Card key={p.name} className={`reveal rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl ${p.highlight ? "border-2 shadow-xl relative" : ""} ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`} style={p.highlight ? { borderColor: C.green } : undefined}>
              {p.highlight && <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})` }} />}
              <CardHeader>
                <p className={`text-sm font-medium mb-1 ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(p.sub)}</p>
                <CardTitle className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</CardTitle>
                <p className="text-3xl font-bold mt-2" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>{bi(p.price)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <div key={bi(f)} className={`flex items-start gap-2.5 text-sm ${dark ? "text-white/50" : "text-gray-600"}`}>
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                      {bi(f)}
                    </div>
                  ))}
                </div>
                <Button className={`w-full rounded-full font-semibold transition-all ${p.highlight ? "hover:opacity-90 border-0" : (dark ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50")}`} style={p.highlight ? { background: C.yellow, color: C.green } : undefined}>
                  {bi(p.cta)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
