import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "./contexts/ClientContext";
import { clientI18n } from "./i18n";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Brain, LogOut, ArrowLeft, LayoutDashboard, MessageSquare,
  Bot, Key, BarChart3, Users, Settings, Shield, Palette,
  Menu, Sun, Moon, Loader2, FileCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", path: "/client", icon: LayoutDashboard },
  { key: "chat", path: "/client/chat", icon: MessageSquare },
  { key: "tools", path: "/client/tools", icon: Bot },
  { key: "deliverables", path: "/client/deliverables", icon: FileCheck, featureGate: "human_review" },
  { key: "apiKeys", path: "/client/keys", icon: Key },
  { key: "usage", path: "/client/usage", icon: BarChart3 },
  { key: "team", path: "/client/team", icon: Users },
  { key: "customization", path: "/client/customization", icon: Palette },
  { key: "settings", path: "/client/settings", icon: Settings },
  { key: "auditLog", path: "/client/audit", icon: Shield },
] as const;

// Page imports
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { ToolsPage } from "./pages/ToolsPage";
import { ApiKeysPage } from "./pages/ApiKeysPage";
import { UsagePage } from "./pages/UsagePage";
import { TeamPage } from "./pages/TeamPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { ToolChatPage } from "./pages/ToolChatPage";
import { CustomizationPage } from "./pages/CustomizationPage";
import { DeliverablesPage } from "./pages/DeliverablesPage";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { lang } = useLang();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const { tenant, user, quotas } = useClient();
  const navigate = useNavigate();
  const location = useLocation();

  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate("/client/login");
  };

  const isActive = (path: string) => {
    if (path === "/client") return location.pathname === "/client";
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`flex flex-col h-full ${dark ? "bg-gray-950 border-white/5" : "bg-white border-gray-200"}`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.green }}>
          <Brain className="w-5 h-5" style={{ color: C.yellow }} />
        </div>
        <div>
          <span className="text-sm font-bold" style={{ ...HDR_FONT, color: C.green }}>
            Talsom<span className="font-light opacity-70">Forge</span>
          </span>
          <p className={`text-[10px] -mt-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>
            {bi(clientI18n.dashboard)}
          </p>
        </div>
      </div>

      {/* Tenant info */}
      {tenant && (
        <div className={`mx-3 mb-2 px-3 py-2 rounded-lg ${dark ? "bg-white/5" : "bg-gray-50"}`}>
          <p className={`text-xs font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{tenant.tenantName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 rounded-full" style={{ borderColor: C.green, color: C.green }}>
              {bi(clientI18n[tenant.plan as keyof typeof clientI18n] ?? { fr: tenant.plan, en: tenant.plan })}
            </Badge>
            <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
              {tenant.role}
            </span>
          </div>
        </div>
      )}

      <Separator className={dark ? "bg-white/5" : ""} />

      {/* Nav items */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.filter((item) => {
            if ("featureGate" in item && item.featureGate) {
              return quotas?.features?.[item.featureGate] === true;
            }
            return true;
          }).map(({ key, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { navigate(path); onNavigate?.(); }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2.5 ${
                isActive(path)
                  ? dark
                    ? "bg-white/10 text-white font-medium"
                    : "bg-gray-100 text-gray-900 font-medium"
                  : dark
                    ? "text-white/50 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {bi(clientI18n[key as keyof typeof clientI18n])}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <Separator className={dark ? "bg-white/5" : ""} />

      {/* Bottom actions */}
      <div className="p-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className={`flex items-center gap-2 text-sm w-full px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>

        <a
          href="/"
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {bi(clientI18n.backToSite)}
        </a>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={`w-full justify-start ${dark ? "text-white/40 hover:text-red-400 hover:bg-red-500/10" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          {bi(clientI18n.signOut)}
        </Button>

        {/* User info */}
        {user && (
          <div className={`px-3 py-1.5 text-[10px] truncate ${dark ? "text-white/20" : "text-gray-300"}`}>
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClientLayout() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dark = theme === "dark";
  const { loading, error } = useClient();
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
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <a href="/client/login">
            <Button variant="outline" className="rounded-full">
              {bi(clientI18n.signOut)}
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
              <Brain className="w-4 h-4" style={{ color: C.yellow }} />
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
            <Route path="chat" element={<ChatPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tools/:toolName" element={<ToolChatPage />} />
            <Route path="deliverables" element={<DeliverablesPage />} />
            <Route path="keys" element={<ApiKeysPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="customization" element={<CustomizationPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit" element={<AuditLogPage />} />
            <Route path="*" element={<Navigate to="/client" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}
