// ─── CLOUD PROVIDER API WRAPPERS ────────────────────
// Normalized file listing, download, and upload for Google Drive & Microsoft OneDrive

export type Provider = "google" | "microsoft";

export interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  isFolder: boolean;
  provider: Provider;
  iconUrl?: string;
  webUrl?: string;
}

export interface DownloadResult {
  name: string;
  type: string;       // MIME type
  data: string;       // base64
  size: number;
}

export interface UploadResult {
  fileId: string;
  webUrl: string;
  name: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ─── List Files ──────────────────────────────────────

export async function listFiles(
  provider: Provider,
  accessToken: string,
  folderId?: string,
  query?: string
): Promise<CloudFile[]> {
  if (provider === "google") return listGoogleFiles(accessToken, folderId, query);
  return listMicrosoftFiles(accessToken, folderId, query);
}

async function listGoogleFiles(token: string, folderId?: string, query?: string): Promise<CloudFile[]> {
  let q = "";
  if (query) {
    q = `name contains '${query.replace(/'/g, "\\'")}'  and trashed=false`;
  } else {
    const parent = folderId ?? "root";
    q = `'${parent}' in parents and trashed=false`;
  }

  const params = new URLSearchParams({
    q,
    fields: "files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)",
    orderBy: "modifiedTime desc",
    pageSize: "50",
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Drive list failed: ${err}`);
  }

  const data = await res.json();
  return (data.files ?? []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: parseInt(f.size ?? "0"),
    modifiedTime: f.modifiedTime ?? "",
    isFolder: f.mimeType === "application/vnd.google-apps.folder",
    provider: "google" as Provider,
    iconUrl: f.iconLink,
    webUrl: f.webViewLink,
  }));
}

async function listMicrosoftFiles(token: string, folderId?: string, query?: string): Promise<CloudFile[]> {
  let url: string;
  if (query) {
    url = `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(query)}')?$top=50&$select=id,name,size,lastModifiedDateTime,file,folder,webUrl`;
  } else if (folderId) {
    url = `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children?$top=50&$select=id,name,size,lastModifiedDateTime,file,folder,webUrl&$orderby=lastModifiedDateTime desc`;
  } else {
    url = `https://graph.microsoft.com/v1.0/me/drive/root/children?$top=50&$select=id,name,size,lastModifiedDateTime,file,folder,webUrl&$orderby=lastModifiedDateTime desc`;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OneDrive list failed: ${err}`);
  }

  const data = await res.json();
  return (data.value ?? []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.file?.mimeType ?? (f.folder ? "folder" : "application/octet-stream"),
    size: f.size ?? 0,
    modifiedTime: f.lastModifiedDateTime ?? "",
    isFolder: !!f.folder,
    provider: "microsoft" as Provider,
    webUrl: f.webUrl,
  }));
}

// ─── Download File ───────────────────────────────────

export async function downloadFile(
  provider: Provider,
  accessToken: string,
  fileId: string,
  fileName: string,
  mimeType: string
): Promise<DownloadResult> {
  if (provider === "google") return downloadGoogleFile(accessToken, fileId, fileName, mimeType);
  return downloadMicrosoftFile(accessToken, fileId, fileName);
}

async function downloadGoogleFile(token: string, fileId: string, fileName: string, mimeType: string): Promise<DownloadResult> {
  let url: string;
  let exportMime = mimeType;

  // Google Docs types need export
  if (mimeType.startsWith("application/vnd.google-apps.")) {
    const exportMap: Record<string, string> = {
      "application/vnd.google-apps.document": "application/pdf",
      "application/vnd.google-apps.spreadsheet": "application/pdf",
      "application/vnd.google-apps.presentation": "application/pdf",
    };
    exportMime = exportMap[mimeType] ?? "application/pdf";
    url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportMime)}`;
    fileName = fileName.replace(/\.[^.]+$/, "") + ".pdf";
  } else {
    url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Google download failed: ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_FILE_SIZE) throw new Error("File exceeds 10 MB limit");

  return {
    name: fileName,
    type: exportMime,
    data: buf.toString("base64"),
    size: buf.length,
  };
}

async function downloadMicrosoftFile(token: string, fileId: string, fileName: string): Promise<DownloadResult> {
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`OneDrive download failed: ${res.status}`);

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_FILE_SIZE) throw new Error("File exceeds 10 MB limit");

  return {
    name: fileName,
    type: contentType,
    data: buf.toString("base64"),
    size: buf.length,
  };
}

// ─── Upload / Export File ────────────────────────────

export async function uploadFile(
  provider: Provider,
  accessToken: string,
  fileName: string,
  content: string,  // UTF-8 text or base64
  mimeType: string,
  folderId?: string,
  isBase64?: boolean
): Promise<UploadResult> {
  if (provider === "google") return uploadGoogleFile(accessToken, fileName, content, mimeType, folderId, isBase64);
  return uploadMicrosoftFile(accessToken, fileName, content, mimeType, folderId, isBase64);
}

async function uploadGoogleFile(
  token: string, fileName: string, content: string, mimeType: string, folderId?: string, isBase64?: boolean
): Promise<UploadResult> {
  const metadata: Record<string, unknown> = { name: fileName, mimeType };
  if (folderId) metadata.parents = [folderId];

  const fileContent = isBase64 ? Buffer.from(content, "base64") : Buffer.from(content, "utf-8");

  // Use multipart upload
  const boundary = "----TalsomForge" + Date.now();
  const body = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    "Content-Transfer-Encoding: base64",
    "",
    fileContent.toString("base64"),
    `--${boundary}--`,
  ].join("\r\n");

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,name", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google upload failed: ${err}`);
  }

  const data = await res.json();
  return { fileId: data.id, webUrl: data.webViewLink ?? "", name: data.name };
}

async function uploadMicrosoftFile(
  token: string, fileName: string, content: string, mimeType: string, folderId?: string, isBase64?: boolean
): Promise<UploadResult> {
  const fileContent = isBase64 ? Buffer.from(content, "base64") : Buffer.from(content, "utf-8");

  const basePath = folderId
    ? `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${encodeURIComponent(fileName)}:/content`
    : `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(fileName)}:/content`;

  const res = await fetch(basePath, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": mimeType,
    },
    body: fileContent,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OneDrive upload failed: ${err}`);
  }

  const data = await res.json();
  return { fileId: data.id, webUrl: data.webUrl ?? "", name: data.name };
}

// ─── Get User Email from Token ───────────────────────

export async function getUserEmail(provider: Provider, accessToken: string): Promise<string | null> {
  try {
    if (provider === "google") {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.email ?? null;
    }

    // Microsoft
    const res = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.mail ?? data.userPrincipalName ?? null;
  } catch {
    return null;
  }
}
