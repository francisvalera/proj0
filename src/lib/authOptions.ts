import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

type Role = "USER" | "ADMIN";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, image: true, password: true, role: true },
        });
        if (!dbUser || !dbUser.password) return null;

        const ok = await compare(password, dbUser.password);
        if (!ok) return null;

        // Return only the standard NextAuth User shape here;
        // we’ll fetch role in the JWT callback.
        const baseUser: User = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image ?? null,
        };
        return baseUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, load role from DB and store on token
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        if (dbUser?.role) {
          (token as { role?: Role }).role = dbUser.role as Role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        const r = (token as { role?: Role }).role;
        if (r) session.user.role = r;
      }
      return session;
    },
  },
};
