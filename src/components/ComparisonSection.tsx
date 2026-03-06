import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, Zap } from "lucide-react";
import type { Bi } from "@/types/content";

export function ComparisonSection() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();
  const data = useSection('comparison');
  const bi = useBi();

  return (
    <section className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight, color: dark ? C.yellow : C.green }}>
            {bi(data.badge)}
          </Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(data.title)}
          </h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>
            {bi(data.subtitle)}
          </p>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
          {/* Header */}
          <div className={`grid grid-cols-3 ${dark ? "bg-white/[0.02]" : "bg-gray-50"}`}>
            <div className="p-4" />
            <div className={`p-4 text-center border-x ${dark ? "border-white/5" : "border-gray-100"}`}>
              <p className={`text-sm font-semibold ${dark ? "text-white/50" : "text-gray-500"}`}>{bi(data.traditionalLabel)}</p>
            </div>
            <div className="p-4 text-center relative">
              <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow})` }} />
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4" style={{ color: C.yellow }} />
                <p className="text-sm font-bold" style={{ ...HDR_FONT, color: dark ? C.yellow : C.green }}>{data.forgeLabel}</p>
              </div>
            </div>
          </div>

          {/* Rows */}
          {data.rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-t ${dark ? "border-white/5" : "border-gray-100"}`}>
              <div className="p-4 flex items-center">
                <p className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{bi(row.label)}</p>
              </div>
              <div className={`p-4 flex items-center justify-center border-x ${dark ? "border-white/5" : "border-gray-100"}`}>
                {typeof row.traditional === "boolean" ? (
                  row.traditional
                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                    : <X className={`w-5 h-5 ${dark ? "text-white/15" : "text-gray-200"}`} />
                ) : (
                  <p className={`text-sm text-center ${dark ? "text-white/40" : "text-gray-400"}`}>{bi(row.traditional as Bi)}</p>
                )}
              </div>
              <div className="p-4 flex items-center justify-center" style={{ background: dark ? "rgba(0,53,51,0.15)" : C.greenLight + "40" }}>
                {typeof row.forge === "boolean" ? (
                  row.forge
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: C.greenMid }} />
                    : <X className={`w-5 h-5 ${dark ? "text-white/15" : "text-gray-200"}`} />
                ) : (
                  <p className="text-sm text-center font-medium" style={{ color: dark ? C.yellow : C.green }}>{bi(row.forge as Bi)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
