// /src/app/error.tsx
"use client";

import Link from "next/link";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-[#F6F8FB] px-6">
      <div className="max-w-lg w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600 text-2xl">💥</div>
        <h1 className="text-2xl font-semibold">Something broke</h1>
        <p className="mt-2 text-slate-600">
          It’s not you—it’s us. We’ve logged it. You can try again or head home.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={reset} className="rounded-xl bg-slate-900 text-white px-5 py-2 text-sm hover:opacity-90">
            Try again
          </button>
          <Link href="/" className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm hover:bg-slate-50">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
