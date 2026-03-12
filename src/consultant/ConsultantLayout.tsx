import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useConsultant } from "./contexts/ConsultantContext";
import { consultantI18n } from "./i18n";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ShieldCheck, LogOut, ArrowLeft, LayoutDashboard, ListChecks,
  Menu, Sun, Moon, Loader2,
} from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Page imports
import { DashboardPage } from "./pages/DashboardPage";
import { QueuePage } from "./pages/QueuePage";
import { ReviewDetailPage } from "./pages/ReviewDetailPage";

const NAV_ITEMS = [
  { key: "dashboard", path: "/consultant", icon: LayoutDashboard },
  { key: "queue", path: "/consultant/queue", icon: ListChecks },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { lang } = useLang();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const { user } = useConsultant();
  const navigate = useNavigate();
  const location = useLocation();

  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate("/consultant/login");
  };

  const isActive = (path: string) => {
    if (path === "/consultant") return location.pathname === "/consultant";
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`flex flex-col h-full ${dark ? "bg-gray-950 border-white/5" : "bg-white border-gray-200"}`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
          <ShieldCheck className="w-5 h-5" style={{ color: C.yellow }} />
        </div>
        <div>
          <span className="text-sm font-bold" style={{ ...HDR_FONT, color: C.green }}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </span>
          <p className={`text-[10px] -mt-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>
            {bi(consultantI18n.portal)}
          </p>
        </div>
      </div>

      {/* Consultant info */}
      {user && (
        <div className={`mx-3 mb-2 px-3 py-2 rounded-lg ${dark ? "bg-white/5" : "bg-gray-50"}`}>
          <p className={`text-xs font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{user.name}</p>
          <p className={`text-[10px] truncate ${dark ? "text-white/30" : "text-gray-400"}`}>{user.email}</p>
        </div>
      )}

      <Separator className={dark ? "bg-white/5" : ""} />

      {/* Nav items */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ key, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { navigate(path); onNavigate?.(); }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2.5 ${
                isActive(path)
                  ? dark ? "bg-white/10 text-white font-medium" : "bg-gray-100 text-gray-900 font-medium"
                  : dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {bi(consultantI18n[key as keyof typeof consultantI18n])}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <Separator className={dark ? "bg-white/5" : ""} />

      {/* Bottom actions */}
      <div className="p-3 space-y-1">
        <button
          onClick={toggle}
          className={`flex items-center gap-2 text-sm w-full px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>

        <a href="/"
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {bi(consultantI18n.backToSite)}
        </a>

        <Button variant="ghost" size="sm" onClick={handleSignOut}
          className={`w-full justify-start ${dark ? "text-white/40 hover:text-red-400 hover:bg-red-500/10" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          {bi(consultantI18n.signOut)}
        </Button>
      </div>
    </div>
  );
}

export function ConsultantLayout() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dark = theme === "dark";
  const { loading, error } = useConsultant();
  const [mobileOpen, setMobileOpen] = useState(false);

  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        <Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <p className={`text-xs mb-4 ${dark ? "text-white/40" : "text-gray-400"}`}>
            {bi({ fr: "Vous devez avoir un compte consultant actif.", en: "You must have an active consultant account." })}
          </p>
          <a href="/consultant/login">
            <Button variant="outline" className="rounded-full">
              {bi(consultantI18n.signOut)}
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex w-60 border-r shrink-0 flex-col ${dark ? "border-white/5" : "border-gray-200"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile header + sidebar sheet */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50">
        <div className={`h-14 flex items-center justify-between px-4 border-b ${dark ? "bg-gray-950 border-white/5" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
              <ShieldCheck className="w-4 h-4" style={{ color: C.yellow }} />
            </div>
            <span className="text-sm font-bold" style={{ ...HDR_FONT, color: C.green }}>
              Talsom<span className="font-light opacity-70">Forge</span>
            </span>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={dark ? "text-white" : "text-gray-900"}>
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className={`w-60 p-0 ${dark ? "bg-gray-950 border-white/5" : ""}`}>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto md:pt-0 pt-14 ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        <ErrorBoundary dark={dark}>
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="reviews/:reviewId" element={<ReviewDetailPage />} />
            <Route path="*" element={<Navigate to="/consultant" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}
