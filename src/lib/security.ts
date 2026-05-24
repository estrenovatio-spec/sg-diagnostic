import { createHash } from "crypto";
import { headers } from "next/headers";

export function hashIp(ip: string): string {
  const secret = process.env.RATE_LIMIT_SECRET ?? "dev-secret";
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 32);
}

export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000;

export function checkRateLimit(ipHash: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ipHash);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}
