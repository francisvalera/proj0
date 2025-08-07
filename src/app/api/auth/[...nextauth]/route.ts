import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

// This file configures NextAuth.js for authentication.
// We are using the Prisma adapter to store user sessions in the database.
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // You can add other providers here (e.g., Google, Facebook)
  ],
  // You can add custom callbacks here if needed
  // callbacks: { ... }
});

export { handler as GET, handler as POST };
