import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Send, Mail, User, MessageSquare, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { C, HDR_FONT, t } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useReveal } from "@/hooks/useReveal";
import { useSection, useBi } from "@/hooks/useContent";
import { getIcon } from "@/lib/iconMap";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const ref = useReveal();
  const contact = useSection('contact');
  const bi = useBi();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xpwdgvkb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          _subject: `[Talsom Forge] ${t(lang, "Demande de", "Request from")} ${form.name}`,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", company: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent(`[Talsom Forge] ${t(lang, "Demande de", "Request from")} ${form.name}`);
      const body = encodeURIComponent(`${t(lang, "Nom", "Name")}: ${form.name}\n${t(lang, "Courriel", "Email")}: ${form.email}\n${t(lang, "Entreprise", "Company")}: ${form.company}\n\n${form.message}`);
      window.open(`mailto:info@talsom.com?subject=${subject}&body=${body}`, "_blank");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }, [form, lang]);

  return (
    <section id="contact" className="py-24" style={{ background: dark ? "#071716" : C.silverLight }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div ref={ref} className="reveal">
            <Badge className="mb-4 border-0 rounded-full px-3 text-xs font-semibold" style={{ background: C.yellowLight, color: C.green }}>{bi(contact.badge)}</Badge>
            <h2 className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
              {bi(contact.title)}
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${dark ? "text-white/45" : "text-gray-500"}`}>
              {bi(contact.subtitle)}
            </p>
            <div className="space-y-4">
              {contact.contactInfo.map((c) => {
                const Icon = getIcon(c.iconName);
                return (
                  <div key={bi(c.text)} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: dark ? "rgba(0,53,51,0.5)" : C.greenLight }}>
                      <Icon className="w-4 h-4" style={{ color: dark ? C.yellow : C.green }} />
                    </div>
                    <span className={`text-sm ${dark ? "text-white/60" : "text-gray-600"}`}>{bi(c.text)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {status === "sent" ? (
            <div className={`rounded-2xl border p-6 flex flex-col items-center justify-center gap-4 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: C.greenLight }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: C.green }} />
              </div>
              <h3 className={`text-xl font-semibold ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
                {bi(contact.formLabels.success)}
              </h3>
              <p className={`text-sm text-center ${dark ? "text-white/40" : "text-gray-500"}`}>
                {bi(contact.formLabels.successSub)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 space-y-4 ${dark ? "bg-gray-900 border-white/5" : "bg-white border-gray-100"}`}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                    <User className="w-3 h-3 inline mr-1" />{bi(contact.formLabels.name)}
                  </label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} disabled={status === "sending"} />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                    <Mail className="w-3 h-3 inline mr-1" />{bi(contact.formLabels.email)}
                  </label>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@entreprise.com" className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} disabled={status === "sending"} />
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <Building2 className="w-3 h-3 inline mr-1" />{bi(contact.formLabels.company)}
                </label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={bi(contact.formLabels.companyPlaceholder)} className={`rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : ""}`} disabled={status === "sending"} />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`}>
                  <MessageSquare className="w-3 h-3 inline mr-1" />{bi(contact.formLabels.message)}
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  placeholder={bi(contact.formLabels.messagePlaceholder)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "border-gray-200 bg-gray-50"}`}
                  disabled={status === "sending"}
                />
              </div>
              <Button type="submit" disabled={status === "sending"} className="w-full rounded-full font-semibold hover:opacity-90 border-0 transition-all disabled:opacity-70" style={{ background: C.yellow, color: C.green }}>
                {status === "sending" ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{bi(contact.formLabels.sending)}</>
                ) : status === "error" ? (
                  <><Mail className="w-4 h-4 mr-2" />{t(lang, "Ouvert dans votre messagerie", "Opened in your email client")}</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" />{bi(contact.formLabels.submit)}</>
                )}
              </Button>
              <p className={`text-[10px] text-center ${dark ? "text-white/20" : "text-gray-400"}`}>
                {bi(contact.formLabels.note)}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
