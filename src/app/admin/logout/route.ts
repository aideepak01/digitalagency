import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
}
