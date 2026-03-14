const ADMIN_SESSION_COOKIE_NAME = "toolhub_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

type AdminSessionPayload = {
  email: string;
  exp: number;
};

function getAdminAuthSecret() {
  return process.env.ADMIN_AUTH_SECRET ?? "";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64Url(bytes: Uint8Array) {
  return toBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;
  return fromBase64(base64 + "=".repeat(padding));
}

async function getSigningKey() {
  const secret = getAdminAuthSecret();
  if (!secret) return null;

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function isSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function getAdminCookieName() {
  return ADMIN_SESSION_COOKIE_NAME;
}

export function getAdminCookieMaxAge() {
  return SESSION_DURATION_SECONDS;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function sanitizeAdminNextPath(input?: string | null) {
  if (!input) return "/admin/stats";
  if (!input.startsWith("/admin")) return "/admin/stats";
  if (input.startsWith("/admin/login")) return "/admin/stats";
  return input;
}

export function hasAdminCredentialsConfigured() {
  return Boolean(getAdminEmail() && getAdminPassword() && getAdminAuthSecret());
}

export function areAdminCredentialsValid(email: string, password: string) {
  const configuredEmail = getAdminEmail();
  const configuredPassword = getAdminPassword();
  if (!configuredEmail || !configuredPassword) return false;

  return (
    isSafeEqual(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase()) &&
    isSafeEqual(password, configuredPassword)
  );
}

export async function createAdminSessionToken(email: string) {
  const key = await getSigningKey();
  if (!key) return null;

  const payload: AdminSessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };

  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadEncoded = toBase64Url(payloadBytes);

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadEncoded),
  );
  const signatureEncoded = toBase64Url(new Uint8Array(signature));

  return `${payloadEncoded}.${signatureEncoded}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;

  const key = await getSigningKey();
  if (!key) return false;

  const [payloadEncoded, signatureEncoded] = token.split(".");
  if (!payloadEncoded || !signatureEncoded) return false;

  const signature = fromBase64Url(signatureEncoded);
  const isValidSignature = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(payloadEncoded),
  );
  if (!isValidSignature) return false;

  try {
    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadEncoded));
    const payload = JSON.parse(payloadJson) as AdminSessionPayload;
    if (!payload?.email || typeof payload.exp !== "number") return false;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}
