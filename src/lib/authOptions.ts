// src/lib/authOptions.ts
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // IMPORTANT: Adjust field names to match your Prisma User model
      // Assumes User has: id, email, password (hashed), role
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const stored = (user as any).password as string | undefined;

        // If you store bcrypt hashes (recommended)
        if (stored && stored.startsWith("$2")) {
          const ok = await bcrypt.compare(credentials.password, stored);
          if (!ok) return null;
        } else {
          // Fallback: plaintext dev-only (remove in prod)
          if (stored && stored !== credentials.password) return null;
        }

        // Return the minimal user shape for the JWT
        return {
          id: user.id,
          email: user.email!,
          name: user.name ?? undefined,
          role: (user as any).role ?? "USER",
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? token.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        if (token.role) session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};


// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id;
//         token.role = ((user as any).role ?? "USER") as "USER" | "ADMIN";
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = (token.id as string) ?? "";
//         session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
//       }
//       return session;
//     },
//   },
// };
