import Link from "next/link";

export default function PageBreadcrumb({ pageTitle }: { pageTitle: string }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white/90">{pageTitle}</h2>
      <nav>
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link href="/admin" className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
              Admin <span className="text-slate-400">›</span>
            </Link>
          </li>
          <li className="text-slate-800 dark:text-white/90">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
}
