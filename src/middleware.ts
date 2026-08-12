import { NextResponse, type NextRequest } from "next/server";

// Imported from auth-tokens, not auth: middleware runs on the Edge runtime and
// must not pull in the Postgres driver or bcrypt.
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-tokens";

/**
 * Gates every /admin route behind a valid session.
 *
 * This runs on the Edge runtime, so it only verifies the signed cookie — no
 * database access. Server actions and admin API routes call `requireSession()`
 * themselves rather than trusting that the request came through here.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin/login") {
    // Already signed in — no reason to show the form again.
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
