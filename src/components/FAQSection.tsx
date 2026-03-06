import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { C, HDR_FONT } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";

export function FAQSection() {
  const { badge, title, subtitle, items } = useSection('faq');
  const bi = useBi();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className="reveal text-center mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{badge}</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{bi(title)}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{bi(subtitle)}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className={`border rounded-xl px-5 transition-all ${dark ? "border-white/5 data-[state=open]:border-white/10 data-[state=open]:bg-white/[0.02]" : "border-gray-100 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50/50"}`}>
              <AccordionTrigger className={`text-sm font-semibold text-left py-4 hover:no-underline ${dark ? "text-white" : "text-gray-900"}`}>
                {bi(item.q)}
              </AccordionTrigger>
              <AccordionContent className={`text-sm leading-relaxed pb-4 ${dark ? "text-white/50" : "text-gray-500"}`}>
                {bi(item.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
