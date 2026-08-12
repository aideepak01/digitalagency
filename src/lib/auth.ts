import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { query } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth-tokens";

/**
 * Admin authentication — the Node-only half.
 *
 * Sessions are signed JWTs in an httpOnly cookie rather than rows in a session
 * table: this is a handful of staff accounts, and a stateless cookie keeps the
 * middleware check free of a database round trip on every admin request. The
 * trade-off is that revocation waits for expiry, so the lifetime is short (12h).
 *
 * Token signing/verification lives in `auth-tokens.ts` so middleware can import
 * it without pulling `pg` and `bcryptjs` into the Edge bundle.
 */

export { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "@/lib/auth-tokens";

/** The current admin session, or null. For use in server components/actions. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Every admin server action calls this before touching data. Middleware already
 * gates the routes, but an action is its own endpoint — it must not rely on the
 * caller having come through a protected page.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function verifyCredentials(email: string, password: string): Promise<LoginResult> {
  const normalised = email.trim().toLowerCase();

  let user: typeof adminUsers.$inferSelect | undefined;
  try {
    [user] = await query((db) =>
      db.select().from(adminUsers).where(eq(adminUsers.email, normalised)).limit(1),
    );
  } catch (error) {
    console.error("[auth] lookup failed:", error);
    return { ok: false, error: "Sign-in is temporarily unavailable." };
  }

  // Compare against a dummy hash when the user is missing so that a wrong email
  // and a wrong password take the same amount of time to reject.
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const matches = await bcrypt.compare(password, hash);

  if (!user || !user.isActive || !matches) {
    return { ok: false, error: "Incorrect email or password." };
  }

  try {
    await query((db) =>
      db.update(adminUsers).set({ lastLoginAt: sql`now()` }).where(eq(adminUsers.id, user.id)),
    );
  } catch {
    // Not worth failing a valid sign-in over.
  }

  const token = await createSessionToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  });

  return { ok: true, token };
}
