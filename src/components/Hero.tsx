import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronsRight } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useSection, useBi } from "@/hooks/useContent";

export function Hero() {
  const hero = useSection('hero');
  const stats = useSection('stats');
  const bi = useBi();
  return (
    <section className="bg-hero relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 chevron-pattern" />
      <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full opacity-[0.18] blur-[140px]" style={{ background: C.yellow }} />
      <div className="absolute bottom-1/4 -right-40 w-[480px] h-[480px] rounded-full opacity-[0.10] blur-[140px]" style={{ background: "#4AE0D2" }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 text-white/50 border-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs tracking-widest uppercase">
            <ChevronsRight className="w-3 h-3 mr-1.5 inline" style={{ color: C.yellow }} />
            {hero.badgeText}
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6" style={HDR_FONT}>
            {bi(hero.title)}{" "}
            <span className="text-gradient">{bi(hero.titleAccent)}</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-xl">
            {bi(hero.subtitle)}
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <a href="#services">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold hover:opacity-90 border-0 transition-opacity" style={{ background: C.yellow, color: C.green }}>
                {bi(hero.ctaPrimary)} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#ai-chat">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base text-white border-white/12 bg-white/5 hover:bg-white/10 hover:text-white transition-all">
                {bi(hero.ctaSecondary)}
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.value}>
                <div className="text-3xl font-bold tracking-tight" style={{ ...HDR_FONT, color: C.yellow }}>{s.value}</div>
                <div className="text-sm text-white/35 mt-1">{bi(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
