// /src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-[#F6F8FB] px-6">
      <div className="max-w-lg w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-10 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-sky-50 text-sky-600 text-2xl">🧭</div>
        <h1 className="text-2xl font-semibold">Lost your way?</h1>
        <p className="mt-2 text-slate-600">
          This page took a wrong turn. Try heading back to the store—or search again.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-xl bg-slate-900 text-white px-5 py-2 text-sm hover:opacity-90">
            Go home
          </Link>
          <Link href="/admin" className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm hover:bg-slate-50">
            Admin?
          </Link>
        </div>
      </div>
    </main>
  );
}
