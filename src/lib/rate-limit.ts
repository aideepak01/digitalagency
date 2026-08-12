import { createHash } from "node:crypto";
import { and, gt, lt, sql } from "drizzle-orm";

import { query } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";

/**
 * Fixed-window rate limiting, stored in Postgres.
 *
 * In-memory counters would reset on every deploy — and the Hostinger webhook
 * redeploys on every push — as well as being per-process. Keeping the counter
 * in the database means the limit actually holds.
 */

const DEFAULT_LIMIT = Number(process.env.RATE_LIMIT_MAX ?? 5);
const DEFAULT_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 3600);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Hashed rather than stored raw: it is enough to recognise a repeat submitter
 * without keeping visitors' IP addresses in the clear.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "sbabuai";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Best-effort client IP from the proxy chain in front of the Node app. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? request.headers.get("cf-connecting-ip") ?? "unknown";
}

export async function checkRateLimit(
  scope: string,
  identifier: string,
  options: { limit?: number; windowSeconds?: number } = {},
): Promise<RateLimitResult> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowSeconds = options.windowSeconds ?? DEFAULT_WINDOW_SECONDS;
  const bucket = `${scope}:${identifier}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  try {
    return await query(async (db) => {
      // Opportunistic cleanup so the table does not grow without bound; there
      // is no cron on this host to do it separately.
      await db.delete(rateLimits).where(lt(rateLimits.expiresAt, now));

      // One statement: insert the bucket, or bump it if the window is still
      // open. `expires_at` is only extended when a fresh window starts, which
      // is what makes this a fixed rather than sliding window.
      const [row] = await db
        .insert(rateLimits)
        .values({ bucket, count: 1, expiresAt })
        .onConflictDoUpdate({
          target: rateLimits.bucket,
          set: {
            count: sql`case when ${rateLimits.expiresAt} > now() then ${rateLimits.count} + 1 else 1 end`,
            expiresAt: sql`case when ${rateLimits.expiresAt} > now() then ${rateLimits.expiresAt} else ${expiresAt.toISOString()}::timestamptz end`,
          },
        })
        .returning({ count: rateLimits.count, expiresAt: rateLimits.expiresAt });

      const count = row?.count ?? 1;
      const resetAt = row?.expiresAt ?? expiresAt;

      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000)),
      };
    });
  } catch (error) {
    // A limiter that fails closed would take the contact form down with the
    // database. Submissions cannot be written in that state anyway, so the
    // route's own error handling is what the visitor sees.
    console.error("[rate-limit] check failed:", error instanceof Error ? error.message : error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Exported for the admin dashboard's abuse panel. */
export async function activeRateLimitCount(): Promise<number> {
  return query(async (db) => {
    const rows = await db
      .select({ bucket: rateLimits.bucket })
      .from(rateLimits)
      .where(and(gt(rateLimits.expiresAt, new Date()), gt(rateLimits.count, 0)));
    return rows.length;
  });
}
