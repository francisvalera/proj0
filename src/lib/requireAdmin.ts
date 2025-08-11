import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export async function requireAdmin(callbackUrl = "/admin") {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (session.user?.role !== "ADMIN") {
    redirect(`/forbidden?from=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}
