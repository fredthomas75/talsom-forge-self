import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ArrowUpRight, CheckCircle2, BarChart3, FileText, Layers, Shield } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";

function ProductMockup({ productId, dark }: { productId: string; dark: boolean }) {
  const mockups: Record<string, { icon: typeof BarChart3; lines: string[] }> = {
    "forge-pia": { icon: Shield, lines: ["Privacy Impact Assessment", "Risk Level: Medium", "Data Classification: ███████", "Compliance: Loi 25 ✓  RGPD ✓", "Recommendations: 12 items"] },
    "forge-backlog": { icon: Layers, lines: ["Sprint Backlog Manager", "Epic: Digital Transform...", "Story Points: ████░░  68%", "Velocity: 42 pts/sprint", "Next: API Integration"] },
    "forge-analytics": { icon: BarChart3, lines: ["Adoption Analytics", "Active Users: ████████ 94%", "Feature Usage: ██████░ 78%", "Satisfaction: █████████ 96%", "Trend: ↑ +12% this month"] },
    "forge-docs": { icon: FileText, lines: ["Document Generator", "Template: Process Map", "Sections: 8/8 complete", "Format: PDF + PPTX", "AI Confidence: 97%"] },
  };

  const m = mockups[productId] || mockups["forge-pia"];
  const Icon = m.icon;

  return (
    <div className={`rounded-xl border overflow-hidden ${dark ? "bg-gray-800 border-white/5" : "bg-white border-gray-100"}`}>
      <div className={`px-3 py-2 flex items-center gap-2 border-b ${dark ? "bg-gray-900 border-white/5" : "bg-gray-50 border-gray-100"}`}>
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className={`text-[10px] font-mono flex-1 text-center ${dark ? "text-white/20" : "text-gray-300"}`}>forge.talsom.com</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4" style={{ color: C.yellow }} />
          <span className={`text-xs font-semibold ${dark ? "text-white/60" : "text-gray-600"}`}>{m.lines[0]}</span>
        </div>
        {m.lines.slice(1).map((line, i) => (
          <p key={i} className={`text-[11px] font-mono ${dark ? "text-white/25" : "text-gray-400"}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceDetailContent({ productId, onClose }: { productId: string; onClose?: () => void }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const mktData = useSection('marketplace');
  const bi = useBi();
  const product = mktData.items.find((p) => p.id === productId);
  const detail = mktData.details[productId];
  if (!product || !detail) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <SheetHeader className="pr-6 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${product.badgeCls} border rounded-full text-[10px] px-2.5`}>{product.tier}</Badge>
            <Badge className="rounded-full text-[10px] px-2.5 border" style={{ background: C.yellowLight, color: C.green, borderColor: C.yellowDark + "40" }}>{bi(detail.availability)}</Badge>
          </div>
          <SheetTitle className="text-xl font-bold" style={{ ...HDR_FONT, color: dark ? "white" : C.green }}>{product.name}</SheetTitle>
          <SheetDescription>{bi(product.tagline)}</SheetDescription>
        </SheetHeader>

        {/* Product mockup */}
        <div className="mb-5">
          <ProductMockup productId={productId} dark={dark} />
        </div>

        <p className={`text-sm leading-relaxed mb-5 ${dark ? "text-white/50" : "text-gray-600"}`}>{bi(detail.extendedDesc)}</p>
        <Separator />

        {/* Features */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: dark ? "white" : C.green }}>{bi({ fr: "Fonctionnalités", en: "Features" })}</h4>
          <div className="space-y-2">
            {bi(product.features).split(",").map((f) => (
              <div key={f} className={`flex items-center gap-2.5 text-sm ${dark ? "text-white/50" : "text-gray-600"}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: C.yellow }} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Key benefits */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: dark ? "white" : C.green }}>{bi({ fr: "Avantages clés", en: "Key benefits" })}</h4>
          <div className="space-y-4">
            {detail.keyBenefits.map((b, i) => (
              <div key={i}>
                <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>{bi(b.title)}</p>
                <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-gray-500"}`}>{bi(b.desc)}</p>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Integrations */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: dark ? "white" : C.green }}>{bi({ fr: "Intégrations", en: "Integrations" })}</h4>
          <div className="flex flex-wrap gap-2">
            {detail.integrations.map((intg) => (
              <Badge key={intg} variant="secondary" className={`rounded-full text-xs px-3 ${dark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-600"}`}>{intg}</Badge>
            ))}
          </div>
        </div>
        <Separator />

        {/* Footer CTA */}
        <div className="pt-5 pb-2">
          <a href="#contact" onClick={onClose}>
            <Button className="w-full rounded-full font-semibold hover:opacity-90 border-0 mb-2 transition-opacity" style={{ background: C.green, color: C.yellow }}>
              {bi({ fr: "Demander un accès", en: "Request access" })} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Button variant="outline" className={`w-full rounded-full text-sm ${dark ? "border-white/10 text-white/50" : ""}`}>
            {bi({ fr: "Voir la documentation", en: "View documentation" })}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

export function MarketplaceSection() {
  const mktData = useSection('marketplace');
  const bi = useBi();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useReveal();
  return (
    <section id="marketplace" className="bg-dark-section py-24 relative overflow-hidden">
      <div className="absolute inset-0 chevron-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal max-w-2xl mb-16">
          <Badge className="mb-4 bg-white/5 text-white/50 border-white/8 rounded-full px-3 text-xs">{bi(mktData.badge)}</Badge>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4" style={HDR_FONT}>
            Talsom Forge <span style={{ color: C.yellow }}>Hub</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed">{bi(mktData.subtitle)}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 reveal-stagger">
          {mktData.items.map((p) => (
            <div key={p.id} className="reveal glass-card rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group hover:translate-y-[-2px]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className={`${p.badgeCls} border rounded-full text-[10px] px-2.5 mb-3`}>{p.tier}</Badge>
                  <h3 className="text-xl font-semibold text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-white/35">{bi(p.tagline)}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              {/* Inline mini mockup */}
              <div className="mb-5">
                <ProductMockup productId={p.id} dark={true} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {bi(p.features).split(",").map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/45">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: C.yellow }} />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-white/8 text-white/60 bg-transparent hover:bg-white/8 hover:text-white w-full transition-all" onClick={() => setSelectedId(p.id)}>{bi({ fr: "En savoir plus", en: "Learn more" })}</Button>
            </div>
          ))}
        </div>
      </div>

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          {selectedId && <MarketplaceDetailContent productId={selectedId} onClose={() => setSelectedId(null)} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}
