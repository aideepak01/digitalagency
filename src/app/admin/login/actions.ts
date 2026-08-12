"use server";

import { redirect } from "next/navigation";

import { setSessionCookie, verifyCredentials } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export interface LoginState {
  error: string;
}

/**
 * Sign-in is rate limited per email address: a login form is the one endpoint
 * where an attacker gets unlimited free guesses, and the IP is not a reliable
 * key when the attempt comes through a proxy pool.
 */
export async function login(_previous: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const limit = await checkRateLimit("admin-login", email, { limit: 8, windowSeconds: 900 });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const result = await verifyCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  await setSessionCookie(result.token);

  // Only relative paths — an attacker-supplied `next` must not be able to
  // bounce a freshly authenticated admin to another origin.
  redirect(next.startsWith("/admin") ? next : "/admin");
}
