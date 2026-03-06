import { Badge } from "@/components/ui/badge";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { getIcon } from "@/lib/iconMap";

export function HowItWorks() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();
  const data = useSection('howItWorks');
  const bi = useBi();

  return (
    <section className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight, color: dark ? C.yellow : C.green }}>{bi(data.badge)}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{bi(data.title)}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{bi(data.subtitle)}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
          {data.steps.map((step, i) => {
            const StepIcon = getIcon(step.iconName);
            return (
              <div key={bi(step.title)} className="reveal relative">
                {i < data.steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px" style={{ background: dark ? "rgba(255,255,255,0.06)" : C.silver }} />}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl border shadow-sm flex items-center justify-center mx-auto mb-4 relative group hover:scale-105 transition-transform duration-300 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
                    <StepIcon className="w-7 h-7" style={{ color: dark ? C.yellow : C.green }} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: C.yellow, color: C.green }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className={`font-semibold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{bi(step.title)}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(step.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
