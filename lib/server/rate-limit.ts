import { NextRequest } from "next/server";
import { env } from "@/lib/env";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const now = Date.now();
  const existing = buckets.get(ip);

  if (!existing || existing.resetAt < now) {
    buckets.set(ip, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS
    });
    return { ok: true };
  }

  existing.count += 1;

  if (existing.count > env.RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }

  return { ok: true };
}
