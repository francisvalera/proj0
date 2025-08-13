"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Props = {
  user?: { name?: string | null; email?: string | null; image?: string | null };
};

function toTitle(s: string) {
  return s
    .split("-")
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function makeCrumbs(pathname: string) {
  const seg = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  return seg.slice(0, 3).map((s) => toTitle(s));
}

export default function TopbarClient({ user }: Props) {
  const pathname = usePathname();
  const crumbs = makeCrumbs(pathname);
  const pageTitle = crumbs[1] ?? "Dashboard";

  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stroke bg-white px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Left: breadcrumbs + title */}
      <div className="min-w-0">
        <div className="text-sm text-gray-500">
          {["Admin", ...crumbs.slice(1)].join(" / ")}
        </div>
        <h1 className="truncate text-lg font-semibold text-black dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Right: user badge (no outer pill/border) */}
      <button
        type="button"
        aria-label="Account"
        title={user?.email ?? "Account"}
        className="group inline-flex items-center gap-2 px-1.5 py-1.5 rounded-full hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:hover:bg-white/5"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-stroke dark:ring-strokedark">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user?.name ?? "User"} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-gray-700">{initials}</span>
          )}
          {/* <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-boxdark" /> */}
        </span>
        <span className="hidden md:block text-sm font-medium text-black dark:text-white">
          {user?.name ?? "Admin"}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 transition group-hover:text-gray-700" />
      </button>
    </header>
  );
}
