import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export async function requireAdmin(returnTo = "/admin") {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
  if (session.user.role !== "ADMIN") redirect(`/forbidden?from=${encodeURIComponent(returnTo)}`);
}
