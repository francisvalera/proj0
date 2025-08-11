import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = (req as any).nextauth?.token as { role?: string } | null;
    if (token && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // must be signed in to hit /admin
    },
    pages: { signIn: "/login" },
  },
);

export const config = { matcher: ["/admin", "/admin/:path*"] };