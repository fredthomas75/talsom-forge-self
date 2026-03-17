import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import type { Lang } from "@/lib/constants";
import { LangContext, ThemeContext } from "@/lib/contexts";
import type { Theme } from "@/lib/contexts";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { AdminLogin } from "@/admin/AdminLogin";
import { ProtectedRoute } from "@/admin/ProtectedRoute";
import { AdminLayout } from "@/admin/AdminLayout";
import { ClientLogin } from "@/client/ClientLogin";
import { ClientSignup } from "@/client/ClientSignup";
import { ClientProtectedRoute } from "@/client/ClientProtectedRoute";
import { ConsultantLogin } from "@/consultant/ConsultantLogin";
import { ConsultantProtectedRoute } from "@/consultant/ConsultantProtectedRoute";

const ClientLayout = lazy(() => import("@/client/ClientLayout").then(m => ({ default: m.ClientLayout })));
const ConsultantLayout = lazy(() => import("@/consultant/ConsultantLayout").then(m => ({ default: m.ConsultantLayout })));

const ProductShowcase = lazy(() => import("@/components/ProductShowcase").then(m => ({ default: m.ProductShowcase })));
const ServicesSection = lazy(() => import("@/components/ServicesSection").then(m => ({ default: m.ServicesSection })));
const HowItWorks = lazy(() => import("@/components/HowItWorks").then(m => ({ default: m.HowItWorks })));
const MarketplaceSection = lazy(() => import("@/components/MarketplaceSection").then(m => ({ default: m.MarketplaceSection })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const CaseStudies = lazy(() => import("@/components/CaseStudies").then(m => ({ default: m.CaseStudies })));
const ComparisonSection = lazy(() => import("@/components/ComparisonSection").then(m => ({ default: m.ComparisonSection })));
const AIChatSection = lazy(() => import("@/components/AIChatSection").then(m => ({ default: m.AIChatSection })));
const Pricing = lazy(() => import("@/components/Pricing").then(m => ({ default: m.Pricing })));
const FAQSection = lazy(() => import("@/components/FAQSection").then(m => ({ default: m.FAQSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })));
const CTABanner = lazy(() => import("@/components/CTABanner").then(m => ({ default: m.CTABanner })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

function MetaUpdater({ lang }: { lang: Lang }) {
  useEffect(() => {
    const desc = lang === "fr"
      ? "Talsom Forge — Plateforme de consulting virtuel. Processus, modernisation, IA et performance organisationnelle. Consultants seniors amplifiés par l'AI."
      : "Talsom Forge — Virtual consulting platform. Process design, modernization, AI, and organizational performance. Senior consultants amplified by AI.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
    document.title = lang === "fr"
      ? "Talsom Forge — Plateforme de consulting virtuel"
      : "Talsom Forge — Virtual Consulting Platform";
  }, [lang]);
  return null;
}

function MainSite() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <TrustBar />
      <Suspense fallback={null}>
        <ProductShowcase />
        <ServicesSection />
        <HowItWorks />
        <MarketplaceSection />
        <CaseStudies />
        <Testimonials />
        <ComparisonSection />
        <AIChatSection />
        <Pricing />
        <FAQSection />
        <ContactSection />
        <CTABanner />
        <Footer />
      </Suspense>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("talsom-theme");
      if (saved === "dark" || saved === "light") return saved;
    }
    // Default to light — don't auto-detect system preference
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("talsom-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <MetaUpdater lang={lang} />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/signup" element={<ClientSignup />} />
          <Route path="/client/*" element={<ClientProtectedRoute><Suspense fallback={null}><ClientLayout /></Suspense></ClientProtectedRoute>} />
          <Route path="/consultant/login" element={<ConsultantLogin />} />
          <Route path="/consultant/*" element={<ConsultantProtectedRoute><Suspense fallback={null}><ConsultantLayout /></Suspense></ConsultantProtectedRoute>} />
          <Route path="*" element={<MainSite />} />
        </Routes>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
