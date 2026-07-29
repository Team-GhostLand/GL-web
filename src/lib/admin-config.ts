// Client-side admin gate. Obfuscation only — secrets ship in the bundle.
// Not a substitute for real server auth.

export const ADMIN_USERNAME = "GLAdmin";

/** SHA-256 hex of `${ADMIN_PASSWORD_PEPPER}:${ADMIN_USERNAME}:${password}` */
export const ADMIN_PASSWORD_PEPPER = "gl-admin-v1";
export const ADMIN_PASSWORD_HASH =
  "6231574f436b991ba4775027b27321c3b2203b889d9523aedb83b915f2543417";

/** HMAC key material for signed session tokens (derived, not the password). */
export const ADMIN_SESSION_SECRET =
  "1b5ae587bb4ea8f1a9ee7e31bf9f79f6be98660cc7addccba8a3a98e0618b042";

export const ADMIN_TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12h
export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 min
export const ADMIN_LOGIN_ATTEMPTS_KEY = "gl_admin_login_attempts";

export const ADMIN_TOKEN_KEY = "gl_admin_token";
export const ADMIN_SETTINGS_KEY = "gl_admin_settings";
export const LANG_KEY = "gl_lang";

export const DEFAULT_MC_HOST = "mc.ghostland.ovh";
export const DEFAULT_DISCORD_INVITE = "https://discord.gg/SrhYP3HSX";
export const DEFAULT_DISCORD_WIDGET_ID = "";

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => {
    s += String.fromCharCode(b);
  });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlJson(obj: unknown): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  return b64url(bytes);
}

function fromB64url(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function hashAdminPassword(username: string, password: string): Promise<string> {
  return sha256Hex(`${ADMIN_PASSWORD_PEPPER}:${username}:${password}`);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false;
  const hash = await hashAdminPassword(username, password);
  return hash === ADMIN_PASSWORD_HASH;
}

export async function createAdminToken(): Promise<string> {
  const now = Date.now();
  const payload = {
    nbf: now,
    exp: now + ADMIN_TOKEN_TTL_MS,
    nonce: crypto.randomUUID(),
  };
  const body = b64urlJson(payload);
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function validateAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  try {
    const key = await hmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromB64url(sig),
      new TextEncoder().encode(body),
    );
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as {
      nbf?: number;
      exp?: number;
    };
    const now = Date.now();
    if (typeof payload.exp !== "number" || typeof payload.nbf !== "number") return false;
    if (now < payload.nbf || now > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

type AttemptState = { count: number; windowStart: number };

export function readLoginAttempts(): AttemptState {
  try {
    const raw = window.sessionStorage.getItem(ADMIN_LOGIN_ATTEMPTS_KEY);
    if (!raw) return { count: 0, windowStart: Date.now() };
    const parsed = JSON.parse(raw) as AttemptState;
    if (Date.now() - parsed.windowStart > ADMIN_LOGIN_WINDOW_MS) {
      return { count: 0, windowStart: Date.now() };
    }
    return parsed;
  } catch {
    return { count: 0, windowStart: Date.now() };
  }
}

export function recordLoginFailure(): AttemptState {
  const cur = readLoginAttempts();
  const next =
    Date.now() - cur.windowStart > ADMIN_LOGIN_WINDOW_MS
      ? { count: 1, windowStart: Date.now() }
      : { count: cur.count + 1, windowStart: cur.windowStart };
  window.sessionStorage.setItem(ADMIN_LOGIN_ATTEMPTS_KEY, JSON.stringify(next));
  return next;
}

export function clearLoginAttempts() {
  window.sessionStorage.removeItem(ADMIN_LOGIN_ATTEMPTS_KEY);
}

export function isLoginRateLimited(): boolean {
  return readLoginAttempts().count >= ADMIN_LOGIN_MAX_ATTEMPTS;
}
