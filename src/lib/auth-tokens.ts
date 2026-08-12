import { jwtVerify, SignJWT } from "jose";

/**
 * Session token signing/verification, kept free of any Node-only dependency.
 *
 * `middleware.ts` runs on the Edge runtime and imports from this module. If it
 * pulled in `src/lib/auth.ts` instead it would drag `pg` and `bcryptjs` into
 * the edge bundle, and the build would only survive on tree-shaking happening
 * to remove them. `jose` works on both runtimes, so this split is what actually
 * guarantees it.
 */

export const SESSION_COOKIE = "sbabu_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}
