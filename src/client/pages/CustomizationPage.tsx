import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2, Upload, Trash2, FileText, Image, Presentation,
  FileType, Loader2, Check, AlertCircle, Palette,
} from "lucide-react";
import { C, HDR_FONT } from "@/lib/constants";
import { useLang, useTheme } from "@/lib/contexts";
import { useClient } from "../contexts/ClientContext";

// ─── Types ──────────────
interface TenantProfile {
  id?: string;
  industry: string;
  company_size: string;
  headquarters: string;
  description: string;
  mission_statement: string;
  target_audience: string;
  key_products: string;
  brand_tone: string;
  brand_colors: { primary?: string; secondary?: string; accent?: string };
  custom_instructions: string;
}

interface TenantAsset {
  id: string;
  asset_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

const EMPTY_PROFILE: TenantProfile = {
  industry: "", company_size: "", headquarters: "", description: "",
  mission_statement: "", target_audience: "", key_products: "",
  brand_tone: "professional", brand_colors: {}, custom_instructions: "",
};

const ASSET_TYPE_LABELS: Record<string, { fr: string; en: string; icon: typeof FileText }> = {
  brand_guide:     { fr: "Charte graphique", en: "Brand Guide",      icon: Palette },
  logo:            { fr: "Logo",             en: "Logo",             icon: Image },
  template_pptx:   { fr: "Gabarit PPTX",    en: "PPTX Template",   icon: Presentation },
  template_docx:   { fr: "Gabarit DOCX",    en: "DOCX Template",   icon: FileType },
  reference_doc:   { fr: "Document réf.",    en: "Reference Doc",   icon: FileText },
};

const TONE_OPTIONS = [
  { value: "professional", fr: "Professionnel", en: "Professional" },
  { value: "casual",       fr: "Décontracté",   en: "Casual" },
  { value: "technical",    fr: "Technique",      en: "Technical" },
  { value: "creative",     fr: "Créatif",        en: "Creative" },
];

const SIZE_OPTIONS = [
  { value: "1-10",      label: "1-10" },
  { value: "11-50",     label: "11-50" },
  { value: "51-200",    label: "51-200" },
  { value: "201-500",   label: "201-500" },
  { value: "501-1000",  label: "501-1000" },
  { value: "1001-5000", label: "1001-5000" },
  { value: "5000+",     label: "5000+" },
];

export function CustomizationPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { session } = useClient();
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  // Profile state
  const [profile, setProfile] = useState<TenantProfile>(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Assets state
  const [assets, setAssets] = useState<TenantAsset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssetType, setSelectedAssetType] = useState("reference_doc");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };

  // ── Load profile ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/client/customization/profile", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setProfile({ ...EMPTY_PROFILE, ...data.profile });
        }
      } catch {} finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  // ── Load assets ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/client/customization/assets", { headers });
        if (res.ok) {
          const data = await res.json();
          setAssets(data.assets ?? []);
        }
      } catch {} finally {
        setAssetsLoading(false);
      }
    })();
  }, []);

  // ── Save profile ──
  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileError("");
    setProfileSaved(false);
    try {
      const res = await fetch("/api/client/customization/profile", {
        method: "PATCH", headers,
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Upload file ──
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(bi({ fr: "Fichier trop volumineux (max 10 Mo)", en: "File too large (max 10 MB)" }));
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/client/customization/assets", {
        method: "POST",
        headers,
        body: JSON.stringify({
          asset_type: selectedAssetType,
          file_name: file.name,
          file_data: base64,
          mime_type: file.type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setAssets((prev) => [data.asset, ...prev]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Delete asset ──
  const deleteAsset = async (id: string) => {
    try {
      await fetch(`/api/client/customization/assets/${id}`, {
        method: "DELETE",
        headers,
      });
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  const updateProfile = (key: keyof TenantProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass = `rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`;
  const labelClass = `text-xs font-medium mb-1.5 block ${dark ? "text-white/50" : "text-gray-500"}`;

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className={`w-6 h-6 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
          {bi({ fr: "Personnalisation", en: "Customization" })}
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-white/40" : "text-gray-500"}`}>
          {bi({ fr: "Personnalisez les outputs AI avec vos informations corporatives", en: "Personalize AI outputs with your corporate information" })}
        </p>
      </div>

      {/* ── Section 1: Corporate Profile ── */}
      <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
        <CardHeader>
          <CardTitle className={`text-base font-semibold flex items-center gap-2 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            <Building2 className="w-5 h-5" style={{ color: C.green }} />
            {bi({ fr: "Profil corporatif", en: "Corporate Profile" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{bi({ fr: "Industrie", en: "Industry" })}</label>
              <Input value={profile.industry} onChange={(e) => updateProfile("industry", e.target.value)}
                placeholder={bi({ fr: "Ex: Services financiers", en: "Ex: Financial services" })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{bi({ fr: "Taille de l'entreprise", en: "Company Size" })}</label>
              <select
                value={profile.company_size}
                onChange={(e) => updateProfile("company_size", e.target.value)}
                className={`w-full h-10 px-3 rounded-lg border text-sm ${dark ? "bg-white/5 border-white/10 text-white" : "border-gray-200 bg-white text-gray-900"}`}
              >
                <option value="">{bi({ fr: "Sélectionner...", en: "Select..." })}</option>
                {SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} {bi({ fr: "employés", en: "employees" })}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{bi({ fr: "Siège social", en: "Headquarters" })}</label>
              <Input value={profile.headquarters} onChange={(e) => updateProfile("headquarters", e.target.value)}
                placeholder={bi({ fr: "Ex: Montréal, QC", en: "Ex: Montreal, QC" })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{bi({ fr: "Ton de la marque", en: "Brand Tone" })}</label>
              <select
                value={profile.brand_tone}
                onChange={(e) => updateProfile("brand_tone", e.target.value)}
                className={`w-full h-10 px-3 rounded-lg border text-sm ${dark ? "bg-white/5 border-white/10 text-white" : "border-gray-200 bg-white text-gray-900"}`}
              >
                {TONE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{bi(o)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{bi({ fr: "Description de l'entreprise", en: "Company Description" })}</label>
            <textarea value={profile.description} onChange={(e) => updateProfile("description", e.target.value)}
              placeholder={bi({ fr: "Décrivez brièvement votre entreprise...", en: "Briefly describe your company..." })}
              rows={2} className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "border-gray-200"}`} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{bi({ fr: "Mission", en: "Mission Statement" })}</label>
              <textarea value={profile.mission_statement} onChange={(e) => updateProfile("mission_statement", e.target.value)}
                placeholder={bi({ fr: "Votre mission d'entreprise...", en: "Your company mission..." })}
                rows={2} className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "border-gray-200"}`} />
            </div>
            <div>
              <label className={labelClass}>{bi({ fr: "Public cible", en: "Target Audience" })}</label>
              <textarea value={profile.target_audience} onChange={(e) => updateProfile("target_audience", e.target.value)}
                placeholder={bi({ fr: "Qui sont vos clients...", en: "Who are your customers..." })}
                rows={2} className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "border-gray-200"}`} />
            </div>
          </div>

          <div>
            <label className={labelClass}>{bi({ fr: "Produits / Services clés", en: "Key Products / Services" })}</label>
            <Input value={profile.key_products} onChange={(e) => updateProfile("key_products", e.target.value)}
              placeholder={bi({ fr: "Ex: SaaS, consulting, logiciel de gestion", en: "Ex: SaaS, consulting, management software" })} className={inputClass} />
          </div>

          <Separator className={dark ? "bg-white/5" : ""} />

          <div>
            <label className={labelClass}>{bi({ fr: "Instructions personnalisées pour l'AI", en: "Custom AI Instructions" })}</label>
            <textarea value={profile.custom_instructions} onChange={(e) => updateProfile("custom_instructions", e.target.value)}
              placeholder={bi({ fr: "Instructions spéciales pour personnaliser les réponses de l'AI (ton, vocabulaire, focus)...", en: "Special instructions to personalize AI responses (tone, vocabulary, focus)..." })}
              rows={3} className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "border-gray-200"}`} />
          </div>

          {/* Brand colors */}
          <div>
            <label className={labelClass}>{bi({ fr: "Couleurs de marque", en: "Brand Colors" })}</label>
            <div className="flex gap-4">
              {(["primary", "secondary", "accent"] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={profile.brand_colors[key] || "#003533"}
                    onChange={(e) => updateProfile("brand_colors", { ...profile.brand_colors, [key]: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className={`text-xs capitalize ${dark ? "text-white/40" : "text-gray-500"}`}>{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={saveProfile}
              disabled={profileSaving}
              className="rounded-full font-semibold border-0 hover:opacity-90"
              style={{ background: C.yellow, color: C.green }}
            >
              {profileSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{bi({ fr: "Sauvegarde...", en: "Saving..." })}</>
              ) : profileSaved ? (
                <><Check className="w-4 h-4 mr-2" />{bi({ fr: "Sauvegardé !", en: "Saved!" })}</>
              ) : (
                bi({ fr: "Sauvegarder le profil", en: "Save Profile" })
              )}
            </Button>
            {profileError && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{profileError}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Assets & Documents ── */}
      <Card className={`rounded-xl border ${dark ? "bg-gray-900 border-white/5" : "border-gray-100"}`}>
        <CardHeader>
          <CardTitle className={`text-base font-semibold flex items-center gap-2 ${dark ? "text-white" : ""}`} style={{ ...HDR_FONT, color: dark ? undefined : C.green }}>
            <FileText className="w-5 h-5" style={{ color: C.green }} />
            {bi({ fr: "Documents & Gabarits", en: "Documents & Templates" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload zone */}
          <div className={`rounded-xl border-2 border-dashed p-6 text-center ${dark ? "border-white/10" : "border-gray-200"}`}>
            <Upload className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-white/20" : "text-gray-300"}`} />
            <p className={`text-sm mb-3 ${dark ? "text-white/40" : "text-gray-500"}`}>
              {bi({ fr: "Importez vos chartes, logos et gabarits", en: "Upload your brand guides, logos and templates" })}
            </p>

            <div className="flex items-center justify-center gap-2 mb-3">
              <label className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>{bi({ fr: "Type :", en: "Type:" })}</label>
              <select
                value={selectedAssetType}
                onChange={(e) => setSelectedAssetType(e.target.value)}
                className={`text-sm px-2 py-1 rounded-lg border ${dark ? "bg-white/5 border-white/10 text-white" : "border-gray-200 bg-white"}`}
              >
                {Object.entries(ASSET_TYPE_LABELS).map(([val, lab]) => (
                  <option key={val} value={val}>{bi(lab)}</option>
                ))}
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.pptx,.docx,.png,.jpg,.jpeg,.svg"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              className="rounded-full"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{bi({ fr: "Import en cours...", en: "Uploading..." })}</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />{bi({ fr: "Choisir un fichier", en: "Choose a file" })}</>
              )}
            </Button>
            <p className={`text-[10px] mt-2 ${dark ? "text-white/20" : "text-gray-400"}`}>
              PDF, PPTX, DOCX, PNG, JPG, SVG — max 10 Mo
            </p>
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />{uploadError}
            </div>
          )}

          {/* Assets list */}
          {assetsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
            </div>
          ) : assets.length === 0 ? (
            <p className={`text-xs text-center py-6 ${dark ? "text-white/20" : "text-gray-400"}`}>
              {bi({ fr: "Aucun document importé", en: "No documents uploaded" })}
            </p>
          ) : (
            <div className="space-y-2">
              {assets.map((asset) => {
                const typeInfo = ASSET_TYPE_LABELS[asset.asset_type] ?? { fr: asset.asset_type, en: asset.asset_type, icon: FileText };
                const TypeIcon = typeInfo.icon;
                return (
                  <div
                    key={asset.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${dark ? "border-white/5 bg-white/[0.02]" : "border-gray-100 bg-gray-50/50"}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-white/5" : "bg-white"}`}>
                      <TypeIcon className="w-4 h-4" style={{ color: C.green }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${dark ? "text-white" : "text-gray-900"}`}>{asset.file_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                          {bi(typeInfo)}
                        </Badge>
                        <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                          {(asset.file_size / 1024).toFixed(0)} Ko
                        </span>
                        <span className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                          {new Date(asset.created_at).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAsset(asset.id)}
                      className={`rounded-lg shrink-0 ${dark ? "text-white/30 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
