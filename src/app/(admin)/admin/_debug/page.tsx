import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export default async function AdminDebug() {
  const session = await getServerSession(authOptions);
  return (
    <pre className="p-6 bg-white rounded-xl border max-w-2xl overflow-auto text-sm">
      {JSON.stringify({ session }, null, 2)}
    </pre>
  );
}
