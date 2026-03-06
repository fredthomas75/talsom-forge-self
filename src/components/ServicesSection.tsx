import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, ChevronRight, Sparkles, CheckCircle2, Clock, Layers, Briefcase } from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { getIcon } from "@/lib/iconMap";

export function ServiceDetailContent({ serviceId, onClose }: { serviceId: string; onClose?: () => void }) {
  const svcData = useSection('services');
  const bi = useBi();
  const svc = svcData.items.find((s) => s.id === serviceId);
  const detail = svcData.details[serviceId];
  if (!svc || !detail) return null;

  const SvcIcon = getIcon(svc.iconName);

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <SheetHeader className="pr-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.greenLight }}>
              <SvcIcon className="w-6 h-6" style={{ color: C.green }} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl font-bold" style={{ ...HDR_FONT, color: C.green }}>{bi(svc.title)}</SheetTitle>
              <SheetDescription className="text-xs">{bi(svc.subtitle)}</SheetDescription>
            </div>
          </div>
          {svc.popular && (
            <Badge className="mt-2 border-0 rounded-full text-[10px] px-2.5 font-semibold w-fit" style={{ background: C.green, color: C.yellow }}>{bi({ fr: "Populaire", en: "Popular" })}</Badge>
          )}
        </SheetHeader>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {bi(svc.tags).split(",").map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] rounded-full bg-gray-50 text-gray-500 border-0 px-2.5">{tag}</Badge>)}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{bi(detail.extendedDesc)}</p>

        {/* Differentiator callout */}
        <div className="rounded-xl p-4 mb-5 flex gap-3" style={{ background: C.greenLight }}>
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.green }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: C.green }}>{bi({ fr: "Humain + AI : notre différenciateur", en: "Human + AI: our differentiator" })}</p>
            <p className="text-xs leading-relaxed" style={{ color: C.greenMid }}>{bi(detail.differentiator)}</p>
          </div>
        </div>
        <Separator />

        {/* Sub-services accordion */}
        {detail.subServices.length > 0 && (
          <div className="py-5">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: C.green }}>
              <Briefcase className="w-4 h-4" />
              {bi({ fr: "Sous-services disponibles", en: "Available sub-services" })}
            </h4>
            <Accordion type="single" collapsible className="space-y-2">
              {detail.subServices.map((sub, i) => (
                <AccordionItem key={i} value={`sub-${i}`} className="border border-gray-100 rounded-xl px-4 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50/50">
                  <AccordionTrigger className="text-sm font-semibold text-left py-3 hover:no-underline text-gray-900">
                    <div className="flex items-center gap-2 flex-1">
                      <span>{bi(sub.name)}</span>
                      <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full ml-auto mr-2">{bi(sub.price)}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{bi(sub.desc)}</p>
                    <div className="space-y-1.5 mb-3">
                      {sub.deliverables.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: C.greenMid }} />
                          {bi(d)}
                        </div>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {bi(sub.timeline)}
                    </Badge>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        <Separator />

        {/* Phases */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: C.green }}>
            <Layers className="w-4 h-4" />
            {bi({ fr: "Notre approche", en: "Our approach" })}
          </h4>
          <div className="space-y-4">
            {detail.phases.map((phase, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: C.yellow, color: C.green }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{bi(phase.name)}</p>
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 rounded-full">{bi(phase.duration)}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{bi(phase.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Deliverables */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: C.green }}>
            <CheckCircle2 className="w-4 h-4" />
            {bi({ fr: "Livrables", en: "Deliverables" })}
          </h4>
          <div className="space-y-2">
            {detail.deliverables.map((d, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.greenMid }} />
                {bi(d)}
              </div>
            ))}
          </div>
        </div>
        <Separator />

        {/* Ideal for */}
        <div className="py-5">
          <h4 className="text-sm font-semibold mb-3" style={{ color: C.green }}>{bi({ fr: "Idéal pour", en: "Ideal for" })}</h4>
          <div className="flex flex-wrap gap-2">
            {detail.idealFor.map((p, idx) => (
              <Badge key={idx} variant="secondary" className="rounded-full text-xs bg-gray-50 text-gray-600 px-3">{bi(p)}</Badge>
            ))}
          </div>
        </div>
        <Separator />

        {/* Footer CTA */}
        <div className="pt-5 pb-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{bi({ fr: "À partir de", en: "Starting at" })}</p>
              <p className="text-lg font-bold" style={{ ...HDR_FONT, color: C.green }}>{bi(svc.price)}</p>
            </div>
            <Badge variant="outline" className="text-xs rounded-full px-3 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {bi(detail.timeline)}
            </Badge>
          </div>
          <a href="#contact" onClick={onClose}>
            <Button className="w-full rounded-full font-semibold hover:opacity-90 border-0 mb-2 transition-opacity" style={{ background: C.yellow, color: C.green }}>
              {bi({ fr: "Demander une consultation", en: "Request a consultation" })} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <a href="#contact" onClick={onClose}>
            <Button variant="outline" className="w-full rounded-full text-sm">
              {bi({ fr: "Planifier un appel", en: "Schedule a call" })}
            </Button>
          </a>
        </div>
      </div>
    </ScrollArea>
  );
}

export function ServicesSection() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const svcData = useSection('services');
  const bi = useBi();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useReveal();
  return (
    <section id="services" className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="reveal max-w-2xl mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{bi(svcData.badge)}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            {bi(svcData.title)}
          </h2>
          <p className={`text-lg leading-relaxed ${dark ? "text-white/45" : "text-gray-500"}`}>
            {bi(svcData.subtitle)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 reveal-stagger">
          {svcData.items.map((svc) => {
            const SvcIcon = getIcon(svc.iconName);
            return (
            <Card key={svc.id} className={`reveal group relative border hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden ${dark ? "bg-gray-900 border-white/5 hover:border-white/10" : "border-gray-100 hover:border-gray-200"}`}>
              {svc.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="border-0 rounded-full text-[10px] px-2.5 font-semibold" style={{ background: C.green, color: C.yellow }}>{bi({ fr: "Populaire", en: "Popular" })}</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <SvcIcon className={`w-5 h-5 ${dark ? "text-white/40" : "text-gray-400"}`} />
                </div>
                <CardTitle className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{bi(svc.title)}</CardTitle>
                <p className={`text-xs font-medium ${dark ? "text-white/30" : "text-gray-400"}`}>{bi(svc.subtitle)}</p>
              </CardHeader>
              <CardContent>
                <p className={`text-sm leading-relaxed mb-4 ${dark ? "text-white/45" : "text-gray-500"}`}>{bi(svc.desc)}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {bi(svc.tags).split(",").map((tag) => (
                    <Badge key={tag} variant="secondary" className={`text-[10px] rounded-full border-0 px-2.5 ${dark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}`}>{tag}</Badge>
                  ))}
                </div>
                <Separator className={dark ? "bg-white/5" : ""} />
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{bi(svc.price)}</span>
                  <Button variant="ghost" size="sm" className="rounded-full px-3 text-xs font-semibold hover:scale-105 transition-transform" style={{ color: dark ? C.yellow : C.green }} onClick={() => setSelectedId(svc.id)}>
                    {bi({ fr: "Découvrir", en: "Discover" })} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          {selectedId && <ServiceDetailContent serviceId={selectedId} onClose={() => setSelectedId(null)} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}
