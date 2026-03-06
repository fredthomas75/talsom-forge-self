import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, ArrowUpRight } from "lucide-react";

export function CaseStudies() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { badge, title, subtitle, items } = useSection('caseStudies');
  const bi = useBi();
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>
            {bi(badge)}
          </Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(title)}
          </h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>
            {bi(subtitle)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {items.map((cs) => (
            <Card key={cs.client} className={`reveal group rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] ${dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"}`}>
              <div className="h-1.5" style={{ background: cs.color }} />
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>{cs.client}</p>
                    <p className={`text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(cs.sector)}</p>
                  </div>
                  <ArrowUpRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${dark ? "text-white/30" : "text-gray-300"}`} />
                </div>

                <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>{bi(cs.title)}</h3>

                <div className="space-y-2 mb-5">
                  <div className="flex items-start gap-2">
                    <Target className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
                    <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(cs.challenge)}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                    <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(cs.solution)}</p>
                  </div>
                </div>

                <div className={`rounded-xl p-3 grid grid-cols-3 gap-2 ${dark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                  {cs.results.map((r) => (
                    <div key={bi(r.label)} className="text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-3 h-3" style={{ color: cs.color }} />
                        <p className="text-sm font-bold" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>{bi(r.metric)}</p>
                      </div>
                      <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(r.label)}</p>
                    </div>
                  ))}
                </div>

                <Badge variant="secondary" className={`mt-4 text-[10px] rounded-full px-2.5 ${dark ? "bg-white/5 text-white/30" : "bg-gray-50 text-gray-400"}`}>
                  {bi(cs.service)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
