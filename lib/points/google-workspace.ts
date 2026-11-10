import { SignJWT, importPKCS8 } from "jose";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/forms.responses.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
];

export function googleSyncConfigured() {
  return Boolean(process.env.GOOGLE_SYNC_CLIENT_EMAIL && process.env.GOOGLE_SYNC_PRIVATE_KEY);
}

export async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SYNC_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SYNC_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) throw new Error("Google sync credentials are not configured.");
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(privateKey, "RS256");
  const assertion = await new SignJWT({ scope: SCOPES.join(" ") })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(email)
    .setSubject(email)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google token exchange failed (${response.status}).`);
  const body = await response.json() as { access_token?: string };
  if (!body.access_token) throw new Error("Google token response did not include an access token.");
  return body.access_token;
}

async function googleFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = await getGoogleAccessToken();
  const response = await fetch(url, { ...init, headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...init?.headers }, cache: "no-store" });
  if (!response.ok) throw new Error(`Google API request failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
  return response.json() as Promise<T>;
}

export function listFormResponses(formId: string, pageToken?: string, filter?: string) {
  const query = new URLSearchParams({ pageSize: "5000" });
  if (pageToken) query.set("pageToken", pageToken);
  if (filter) query.set("filter", filter);
  return googleFetch<{ responses?: unknown[]; nextPageToken?: string }>(`https://forms.googleapis.com/v1/forms/${encodeURIComponent(formId)}/responses?${query}`);
}

export function readSheetValues(spreadsheetId: string, range: string) {
  return googleFetch<{ values?: unknown[][] }>(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`);
}

export function writeSheetValues(spreadsheetId: string, range: string, values: unknown[][]) {
  return googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ range, majorDimension: "ROWS", values }),
  });
}

export function clearSheetValues(spreadsheetId: string, range: string) {
  return googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:clear`, { method:"POST", body:"{}" });
}

export function extractGoogleResourceId(value: string, kind: "form" | "sheet") {
  const trimmed = value.trim();
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  const pattern = kind === "form" ? /\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/ : /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/;
  return trimmed.match(pattern)?.[1] ?? null;
}
