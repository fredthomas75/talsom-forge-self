import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X, Search, Folder, FileText, Image, FileSpreadsheet, Presentation,
  ArrowLeft, Loader2, Check, Cloud, ChevronRight,
} from "lucide-react";
import { C } from "@/lib/constants";
import { useTheme } from "@/lib/contexts";
import type { Provider, CloudFile } from "../hooks/useCloudIntegrations";

// ─── CLOUD FILE PICKER ─────────────────────────────
// Modal overlay to browse Google Drive / OneDrive files

interface CloudFilePickerProps {
  provider: Provider;
  accessToken: string;
  lang: "fr" | "en";
  onSelect: (file: CloudFile) => void;
  onClose: () => void;
}

// File icon by mimeType
function fileIcon(mimeType: string, isFolder: boolean) {
  if (isFolder) return <Folder className="w-4 h-4 text-amber-500" />;
  if (/image/.test(mimeType)) return <Image className="w-4 h-4 text-purple-500" />;
  if (/spreadsheet|excel|csv/.test(mimeType)) return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
  if (/presentation|powerpoint/.test(mimeType)) return <Presentation className="w-4 h-4 text-orange-500" />;
  return <FileText className="w-4 h-4 text-blue-500" />;
}

function formatSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CloudFilePicker({ provider, accessToken, lang, onSelect, onClose }: CloudFilePickerProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const bi = (v: { fr: string; en: string }) => (lang === "fr" ? v.fr : v.en);

  const [files, setFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Breadcrumb stack: [{ id, name }]
  const [folderStack, setFolderStack] = useState<{ id: string | undefined; name: string }[]>([
    { id: undefined, name: provider === "google" ? "Google Drive" : "OneDrive" },
  ]);

  const currentFolderId = folderStack[folderStack.length - 1].id;

  const headers = { Authorization: `Bearer ${accessToken}` };

  const fetchFiles = useCallback(async (folderId?: string, searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ provider });
      if (folderId) params.set("folderId", folderId);
      if (searchQuery) params.set("query", searchQuery);

      const res = await fetch(`/api/client/integrations/files?${params}`, { headers });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (d.reconnect) {
          throw new Error(bi({ fr: "Session expirée. Reconnectez-vous.", en: "Session expired. Please reconnect." }));
        }
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [provider, accessToken, lang]);

  // Initial load + folder navigation
  useEffect(() => {
    if (!query) {
      fetchFiles(currentFolderId);
    }
  }, [currentFolderId]);

  // Debounced search
  const handleSearch = (value: string) => {
    setQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (value.trim()) {
      const timeout = setTimeout(() => fetchFiles(undefined, value.trim()), 400);
      setSearchTimeout(timeout);
    } else {
      fetchFiles(currentFolderId);
    }
  };

  const handleFileClick = (file: CloudFile) => {
    if (file.isFolder) {
      setFolderStack((prev) => [...prev, { id: file.id, name: file.name }]);
      setQuery("");
    } else {
      onSelect(file);
    }
  };

  const handleBack = () => {
    if (folderStack.length > 1) {
      setFolderStack((prev) => prev.slice(0, -1));
      setQuery("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${dark ? "bg-gray-900" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-white/5" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5" style={{ color: C.green }} />
            <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
              {bi({ fr: "Importer du cloud", en: "Import from cloud" })}
            </h3>
            <Badge variant="secondary" className="text-[10px] rounded-full">
              {provider === "google" ? "Google Drive" : "OneDrive"}
            </Badge>
          </div>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className={`px-5 py-3 border-b ${dark ? "border-white/5" : "border-gray-100"}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-white/30" : "text-gray-400"}`} />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={bi({ fr: "Rechercher des fichiers...", en: "Search files..." })}
              className={`pl-9 rounded-lg ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : ""}`}
            />
          </div>
        </div>

        {/* Breadcrumb */}
        {!query && folderStack.length > 1 && (
          <div className={`px-5 py-2 border-b flex items-center gap-1 ${dark ? "border-white/5" : "border-gray-100"}`}>
            <button onClick={handleBack} className={`p-1 rounded transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            {folderStack.map((folder, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className={`w-3 h-3 ${dark ? "text-white/20" : "text-gray-300"}`} />}
                <button
                  onClick={() => {
                    if (i < folderStack.length - 1) {
                      setFolderStack((prev) => prev.slice(0, i + 1));
                      setQuery("");
                    }
                  }}
                  className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                    i === folderStack.length - 1
                      ? dark ? "text-white font-medium" : "text-gray-900 font-medium"
                      : dark ? "text-white/40 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File list */}
        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className={`w-5 h-5 animate-spin ${dark ? "text-white/30" : "text-gray-400"}`} />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 px-6">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>
                {bi({ fr: "Aucun fichier trouvé", en: "No files found" })}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    dark ? "hover:bg-white/5" : "hover:bg-gray-50"
                  }`}
                >
                  {fileIcon(file.mimeType, file.isFolder)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${dark ? "text-white" : "text-gray-900"}`}>{file.name}</p>
                    <div className="flex items-center gap-2">
                      {file.size && !file.isFolder && (
                        <span className={`text-[10px] ${dark ? "text-white/20" : "text-gray-400"}`}>
                          {formatSize(file.size)}
                        </span>
                      )}
                      {file.modifiedTime && (
                        <span className={`text-[10px] ${dark ? "text-white/20" : "text-gray-400"}`}>
                          {new Date(file.modifiedTime).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-US")}
                        </span>
                      )}
                    </div>
                  </div>
                  {file.isFolder ? (
                    <ChevronRight className={`w-4 h-4 shrink-0 ${dark ? "text-white/20" : "text-gray-300"}`} />
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                      style={{ borderColor: C.green, color: C.green }}
                    >
                      <Check className="w-3 h-3" />
                      {bi({ fr: "Sélectionner", en: "Select" })}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex justify-end ${dark ? "border-white/5" : "border-gray-100"}`}>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full text-xs">
            {bi({ fr: "Annuler", en: "Cancel" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
