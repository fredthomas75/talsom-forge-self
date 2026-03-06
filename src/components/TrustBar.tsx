import { useTheme } from "@/lib/contexts";
import { useSection, useBi } from "@/hooks/useContent";

export function TrustBar() {
  const { label, clients } = useSection('trustbar');
  const bi = useBi();
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <section className={`border-b py-8 ${dark ? "bg-gray-950 border-white/5" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <p className={`text-[10px] uppercase tracking-[0.2em] text-center mb-6 ${dark ? "text-white/25" : "text-gray-400"}`}>{bi(label)}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {clients.map((c) => (
            <div key={c.name} className="flex items-center gap-2 group">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-transform group-hover:scale-110 ${dark ? "opacity-50 group-hover:opacity-80" : "opacity-70 group-hover:opacity-100"}`}
                style={{ background: c.color }}
              >
                {c.abbr}
              </div>
              <span className={`text-sm font-semibold tracking-tight transition-colors ${dark ? "text-white/30 group-hover:text-white/50" : "text-gray-400 group-hover:text-gray-600"}`}>
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
