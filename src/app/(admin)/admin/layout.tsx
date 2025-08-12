export const dynamic = "force-dynamic";

import Sidebar from "./_components/Sidebar";
import { requireAdmin } from "@/lib/requireAdmin";
import React from "react";
import { Outfit } from "next/font/google";
import TopbarClient from "./_components/TopbarClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin("/admin");
  const session = await getServerSession(authOptions);

  return (
    <div className={`${outfit.className} min-h-screen bg-whiter dark:bg-boxdark antialiased`}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopbarClient user={session?.user ?? undefined} />
          <main className="flex-1">
            {/* wider like TailAdmin */}
            <div className="mx-auto w-full max-w-screen-2xl px-6 py-6 sm:px-8 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
