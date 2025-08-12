"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageSearch, ShoppingBasket } from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType };
const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: PackageSearch },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBasket },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:flex">
      <div className="flex h-16 items-center border-b border-stroke px-6 dark:border-strokedark">
        <span className="font-semibold tracking-tight text-black dark:text-white">Admin</span>
      </div>

      <nav className="p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition
                ${active
                  ? "bg-gray-2 font-medium text-black dark:text-white"
                  : "text-gray-600 hover:bg-gray-2 dark:text-gray-300"}
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";

// const nav = [
//   { href: "/admin", label: "Dashboard", icon: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
//   )},
//   { href: "/admin/products", label: "Products", icon: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M21 16V8l-9-5-9 5v8l9 5 9-5zM5 9.27l7 3.89 7-3.89-7-3.89-7 3.89z"/></svg>
//   )},
//   { href: "/admin/orders", label: "Orders", icon: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M7 18c-1.1 0-2-.9-2-2V6H3V4h4v2h10V4h4v2h-2v10c0 1.1-.9 2-2 2H7zm0-2h10V8H7v8z"/></svg>
//   )},
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Kuya Kards";
//   // Expect a store logo at /logo.svg. If none, a colored circle fallback is shown.
//   return (
//     <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white">
//       <div className="h-16 flex items-center gap-3 px-5 border-b">
//         <div className="relative h-7 w-7 overflow-hidden rounded-md bg-slate-900 text-white grid place-items-center">
//           {/* try using /logo.svg; otherwise simple KK */}
//           <Image src="/logo.svg" alt={storeName} fill className="object-contain p-1" onError={(e:any)=>{(e.currentTarget as HTMLImageElement).style.display='none';}} />
//           <span className="text-[11px] font-bold select-none">KK</span>
//         </div>
//         {/* <span className="text-base font-semibold tracking-tight">{storeName}</span> */}
//         <span className="text-base font-semibold tracking-tight">Admin Panel</span>
//       </div>
//       <nav className="p-3 space-y-1">
//         {nav.map((item) => {
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
//                 active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
//               }`}
//             >
//               <span className={active ? "text-white" : "text-slate-500"}>{item.icon}</span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }
