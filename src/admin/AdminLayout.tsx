import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { C, HDR_FONT } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, ArrowLeft } from "lucide-react";
import type { SectionKey } from "@/types/content";

import { HeroEditor } from "./editors/HeroEditor";
import { StatsEditor } from "./editors/StatsEditor";
import { NavEditor } from "./editors/NavEditor";
import { TrustBarEditor } from "./editors/TrustBarEditor";
import { HowItWorksEditor } from "./editors/HowItWorksEditor";
import { ServicesEditor } from "./editors/ServicesEditor";
import { MarketplaceEditor } from "./editors/MarketplaceEditor";
import { CaseStudiesEditor } from "./editors/CaseStudiesEditor";
import { TestimonialsEditor } from "./editors/TestimonialsEditor";
import { ComparisonEditor } from "./editors/ComparisonEditor";
import { AIChatEditor } from "./editors/AIChatEditor";
import { PricingEditor } from "./editors/PricingEditor";
import { FAQEditor } from "./editors/FAQEditor";
import { ContactEditor } from "./editors/ContactEditor";
import { CTABannerEditor } from "./editors/CTABannerEditor";
import { FooterEditor } from "./editors/FooterEditor";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "stats", label: "Statistiques" },
  { key: "nav", label: "Navigation" },
  { key: "trustbar", label: "Barre de confiance" },
  { key: "howItWorks", label: "Comment ca marche" },
  { key: "services", label: "Services" },
  { key: "marketplace", label: "Marketplace" },
  { key: "caseStudies", label: "Etudes de cas" },
  { key: "testimonials", label: "Temoignages" },
  { key: "comparison", label: "Comparaison" },
  { key: "aiChat", label: "Chat AI" },
  { key: "pricing", label: "Tarification" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
  { key: "ctaBanner", label: "Banniere CTA" },
  { key: "footer", label: "Pied de page" },
];

const EDITORS: Record<SectionKey, React.FC> = {
  hero: HeroEditor,
  stats: StatsEditor,
  nav: NavEditor,
  trustbar: TrustBarEditor,
  howItWorks: HowItWorksEditor,
  services: ServicesEditor,
  marketplace: MarketplaceEditor,
  caseStudies: CaseStudiesEditor,
  testimonials: TestimonialsEditor,
  comparison: ComparisonEditor,
  aiChat: AIChatEditor,
  pricing: PricingEditor,
  faq: FAQEditor,
  contact: ContactEditor,
  ctaBanner: CTABannerEditor,
  footer: FooterEditor,
};

export function AdminLayout() {
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate("/admin/login");
  };

  const Editor = EDITORS[activeSection];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: C.green }}
          >
            <Brain className="w-5 h-5" style={{ color: C.yellow }} />
          </div>
          <div>
            <span
              className="text-sm font-bold"
              style={{ ...HDR_FONT, color: C.green }}
            >
              Talsom
              <span className="font-light opacity-70">Forge</span>
            </span>
            <p className="text-[10px] text-gray-400 -mt-0.5">Admin CMS</p>
          </div>
        </div>

        <Separator />

        {/* Section list */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-0.5 px-2">
            {SECTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  activeSection === key
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom actions */}
        <div className="p-3 space-y-1.5">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour au site
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Deconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <Editor />
        </div>
      </main>
    </div>
  );
}
