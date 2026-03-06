import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { getFAQ } from "@/data/content";

export function FAQSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const faq = getFAQ(lang);
  const ref = useReveal();

  return (
    <section className={`py-24 ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className="reveal text-center mb-16">
          <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>FAQ</Badge>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>{t(lang, "Questions fr\u00e9quentes", "Frequently asked questions")}</h2>
          <p className={dark ? "text-white/40" : "text-gray-500"}>{t(lang, "Tout ce que vous devez savoir pour commencer.", "Everything you need to know to get started.")}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className={`border rounded-xl px-5 transition-all ${dark ? "border-white/5 data-[state=open]:border-white/10 data-[state=open]:bg-white/[0.02]" : "border-gray-100 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50/50"}`}>
              <AccordionTrigger className={`text-sm font-semibold text-left py-4 hover:no-underline ${dark ? "text-white" : "text-gray-900"}`}>
                {item.q}
              </AccordionTrigger>
              <AccordionContent className={`text-sm leading-relaxed pb-4 ${dark ? "text-white/50" : "text-gray-500"}`}>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
