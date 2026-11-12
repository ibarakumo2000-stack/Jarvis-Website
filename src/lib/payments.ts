import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type PurchasePlan = "lifetime" | "monthly" | "yearly";
type PurchaseRow = {
  reference: string;
  email: string;
  plan: PurchasePlan;
  product_version: string;
  status: string;
  amount: number;
  currency: string;
};
type EntitlementRow = {
  email: string;
  plan: PurchasePlan;
  product_version: string;
  status: string;
  expires_at: string | null;
};

const PAYSTACK_API = "https://api.paystack.co";
const TABLE_PURCHASES = "jarvis_purchases";
const TABLE_ENTITLEMENTS = "jarvis_entitlements";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

function supabaseConfig() {
  return {
    url: requiredEnv("SUPABASE_URL").replace(/\/$/, ""),
    key: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

async function databaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Purchase database request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getPlanConfiguration(plan: PurchasePlan) {
  if (plan === "lifetime") {
    const amount = Number(process.env.JARVIS_LIFETIME_PRICE_KOBO ?? "0");
    return {
      plan,
      productVersion: "56.0.0",
      amount,
      currency: process.env.PAYSTACK_CURRENCY ?? "NGN",
      displayPrice: process.env.JARVIS_LIFETIME_PRICE_LABEL ?? "",
      configured: Number.isSafeInteger(amount) && amount > 0,
    };
  }
  const code = process.env[plan === "monthly" ? "PAYSTACK_MONTHLY_PLAN_CODE" : "PAYSTACK_YEARLY_PLAN_CODE"]?.trim() ?? "";
  const displayPrice = process.env[plan === "monthly" ? "JARVIS_MONTHLY_PRICE_LABEL" : "JARVIS_YEARLY_PRICE_LABEL"]?.trim() ?? "";
  return {
    plan,
    productVersion: "latest",
    amount: 0,
    currency: process.env.PAYSTACK_CURRENCY ?? "NGN",
    planCode: code,
    displayPrice,
    configured: Boolean(code && displayPrice),
  };
}

export function getPricingCatalog() {
  return (["lifetime", "monthly", "yearly"] as PurchasePlan[]).map((plan) => getPlanConfiguration(plan));
}

export async function createPendingPurchase(row: PurchaseRow) {
  await databaseRequest(TABLE_PURCHASES + "?on_conflict=reference", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
}

export async function findPurchase(reference: string): Promise<PurchaseRow | null> {
  const rows = await databaseRequest<PurchaseRow[]>(
    `${TABLE_PURCHASES}?reference=eq.${encodeURIComponent(reference)}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

export async function updatePurchase(reference: string, values: Record<string, unknown>) {
  await databaseRequest(
    `${TABLE_PURCHASES}?reference=eq.${encodeURIComponent(reference)}`,
    { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(values) },
  );
}

export async function getEntitlement(email: string): Promise<EntitlementRow | null> {
  const rows = await databaseRequest<EntitlementRow[]>(
    `${TABLE_ENTITLEMENTS}?email=eq.${encodeURIComponent(email.toLowerCase())}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

export async function grantEntitlement(values: EntitlementRow) {
  await databaseRequest(TABLE_ENTITLEMENTS + "?on_conflict=email", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...values, email: values.email.toLowerCase() }),
  });
}

export function entitlementIsActive(entitlement: EntitlementRow | null): boolean {
  if (!entitlement || entitlement.status !== "active") return false;
  return !entitlement.expires_at || Date.parse(entitlement.expires_at) > Date.now();
}

export async function paystackRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const secret = requiredEnv("PAYSTACK_SECRET_KEY");
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  const payload = await response.json() as T & { status?: boolean; message?: string };
  if (!response.ok || payload.status === false) {
    throw new Error(payload.message ?? `Paystack request failed (${response.status})`);
  }
  return payload;
}

export function newPaymentReference() {
  return `jarvis-${randomUUID()}`;
}

type DownloadClaims = { email: string; reference: string; expiresAt: number };

function tokenSecret() {
  return requiredEnv("DOWNLOAD_TOKEN_SECRET");
}

export function createDownloadToken(email: string, reference: string): string {
  const payload: DownloadClaims = {
    email: email.toLowerCase(),
    reference,
    expiresAt: Date.now() + 30 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", tokenSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function readDownloadToken(token: string): DownloadClaims | null {
  const [encoded, supplied, extra] = token.split(".");
  if (!encoded || !supplied || extra) return null;
  const expected = createHmac("sha256", tokenSecret()).update(encoded).digest();
  let actual: Buffer;
  try { actual = Buffer.from(supplied, "base64url"); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DownloadClaims;
    if (!claims.email || !claims.reference || !Number.isFinite(claims.expiresAt) || claims.expiresAt <= Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

export function verifyLegacyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyTimestampedWebhookSignature(rawBody: string, header: string): boolean {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = header.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  if (!timestamp || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3).split(":").pop() ?? "");
  const expected = createHmac("sha512", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return signatures.some((signature) => {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export function subscriptionExpiry(plan: "monthly" | "yearly", nextPaymentDate?: string | null) {
  if (nextPaymentDate && Number.isFinite(Date.parse(nextPaymentDate))) return new Date(nextPaymentDate).toISOString();
  const fallback = Date.now() + (plan === "monthly" ? 35 : 370) * 24 * 60 * 60 * 1000;
  return new Date(fallback).toISOString();
}
