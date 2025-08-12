import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// next-auth v4 (App Router): NextAuth returns a single handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
