// /src/app/forbidden/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function ForbiddenPage() {
  const { data } = useSession();
  const sp = useSearchParams();
  const from = sp.get("from") || "/admin";
  const name = data?.user?.name ?? "there";

  return (
    <main className="min-h-[70vh] grid place-items-center bg-[#F6F8FB] px-6">
      <div className="max-w-lg w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600 text-2xl">
          🔒
        </div>
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-slate-600">
          Hey {name}, this area is for <span className="font-medium">admin users</span> only.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            ← Back to store
          </Link>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(from)}`}
            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Sign in as admin
          </Link>
        </div>

        {data?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 text-xs text-slate-500 hover:underline"
          >
            Not you? Sign out and switch accounts
          </button>
        )}
      </div>
    </main>
  );
}
