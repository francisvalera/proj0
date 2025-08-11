// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Gate /admin pages AND /api/admin/* endpoints
export const config = { matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"] } as const;

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  // Allow Next internals + NextAuth routes
  if (p.startsWith("/_next") || p.startsWith("/api/auth")) return NextResponse.next();

  // Read JWT (explicit secret + handle dev/prod cookie names)
  const token =
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) ||
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "next-auth.session-token" })) ||
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "__Secure-next-auth.session-token" }));

  const isApi = p.startsWith("/api/");

  // Not signed in
  if (!token) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", p + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Signed in, but not ADMIN
  const role = (token as Record<string, unknown>)?.role;
  if (role !== "ADMIN") {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const url = req.nextUrl.clone();
    url.pathname = "/forbidden";
    url.searchParams.set("from", p);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
