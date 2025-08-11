"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function pretty(seg: string) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function initials(name?: string | null) {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase() || "?";
}

export default function AutoTopbar() {
  const pathname = usePathname() || "/admin";
  const { data } = useSession();
  const userName = data?.user?.name ?? "Admin";
  const userImg = data?.user?.image ?? "";

  const parts = pathname.split("/").filter(Boolean);
  const iAdmin = parts.indexOf("admin");
  const trail = iAdmin >= 0 ? parts.slice(iAdmin) : [];

  const crumbs = trail.map((seg, i) => {
    const isLast = i === trail.length - 1;
    const href = !isLast ? "/" + parts.slice(0, iAdmin + 1 + i).join("/") : undefined;
    const label = i === 0 ? "Admin" : pretty(seg);
    return { label, href, isLast };
  });

  const last = crumbs[crumbs.length - 1];
  const title = !last || last.label === "Admin" ? "Dashboard" : last.label;

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex flex-col">
          <nav className="text-[11px] text-slate-500 flex items-center gap-1">
            {crumbs.map((c, i) => (
              <span key={`crumb-${i}`} className="inline-flex items-center gap-1">
                {i > 0 && <span>›</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:underline">{c.label}</Link>
                ) : (
                  <span className="text-slate-700">{c.label === "Admin" ? "Dashboard" : c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-1 text-lg font-semibold tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Hello, <span className="font-medium text-slate-800">{userName}</span></span>
          {userImg ? (
            <Image src={userImg} alt={userName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">{initials(userName)}</div>
          )}
        </div>
      </div>
    </header>
  );
}