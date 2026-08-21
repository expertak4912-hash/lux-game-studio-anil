/**
 * In-process sliding-window rate limiter.
 *
 * Applied to the two endpoints an anonymous visitor can reach: admin login (credential stuffing)
 * and the contact form (spam).
 *
 * SCOPE LIMIT: counters live in this process's memory. A single VPS/Docker/Railway instance is
 * fully covered. Across several instances — or Vercel's serverless functions, where each cold
 * start is a fresh process — each instance keeps its own counter, so the effective limit is
 * `limit x instances`. That still blunts a naive attack, but for a hard global limit swap
 * `hits` for a shared store (a Mongo collection with a TTL index, or Redis); the `checkRateLimit`
 * signature is designed so only this file changes.
 *
 * SERVER ONLY.
 */
import { getRequestIP } from "@tanstack/react-start/server";

type Bucket = { timestamps: number[] };

const hits = new Map<string, Bucket>();

// Drop buckets untouched for this long, so the map cannot grow without bound.
const SWEEP_AFTER_MS = 60 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now: number): void {
  if (now - lastSweep < SWEEP_AFTER_MS) return;
  lastSweep = now;
  for (const [key, bucket] of hits) {
    const newest = bucket.timestamps[bucket.timestamps.length - 1] ?? 0;
    if (now - newest > SWEEP_AFTER_MS) hits.delete(key);
  }
}

export type RateLimitOptions = {
  /** Bucket name, so different endpoints do not share a counter. */
  key: string;
  /** Maximum requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

/**
 * Records one attempt and throws once the caller exceeds `limit` within `windowMs`.
 * The error message tells the caller how long to wait, which is safe to surface in the UI.
 */
export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): void {
  const now = Date.now();
  sweep(now);

  const identity = `${key}:${clientIdentity()}`;
  const bucket = hits.get(identity) ?? { timestamps: [] };

  // Drop everything that has aged out of the window.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0]!;
    const retryInSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    hits.set(identity, bucket);
    throw new Error(`Too many attempts. Please try again in ${retryInSeconds} seconds.`);
  }

  bucket.timestamps.push(now);
  hits.set(identity, bucket);
}

/**
 * Best-effort caller identity. Behind a proxy this is the forwarded IP; if the platform gives us
 * nothing we fall back to a single shared bucket, which fails closed (stricter) rather than open.
 */
function clientIdentity(): string {
  try {
    return getRequestIP({ xForwardedFor: true }) ?? "unknown";
  } catch {
    return "unknown";
  }
}
