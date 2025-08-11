"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutGrid, Package, Receipt } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV: NavItem[] = [
  { href: "/admin",          label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Products",  icon: Package },
  { href: "/admin/orders",   label: "Orders",    icon: Receipt },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Admin Panel";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-[290px] flex-col bg-white border-r border-slate-200">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
        <div className="relative h-7 w-7 overflow-hidden rounded-md bg-slate-900 grid place-items-center">
          <Image src="/images/kklogo.jfif" alt={storeName} fill className="object-cover" />
          <span className="text-[11px] font-bold text-white select-none">KK</span>
        </div>
        <span className="text-base font-semibold tracking-tight">{storeName}</span>
      </div>

      <nav className="p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-500"}`} aria-hidden="true" />
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
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { LayoutGrid, Package, Receipt } from "lucide-react";

// type NavItem = {
//   href: string;
//   label: string;
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
// };

// const NAV: NavItem[] = [
//   { href: "/admin",          label: "Dashboard", icon: LayoutGrid },
//   { href: "/admin/products", label: "Products",  icon: Package },
//   { href: "/admin/orders",   label: "Orders",    icon: Receipt },
// ];

// export default function AppSidebar() {
//   const pathname = usePathname();
//   const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Admin Panel";

//   return (
//     <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-[290px] flex-col bg-white border-r border-slate-200">
//       {/* Brand */}
//       <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
//         <div className="relative h-7 w-7 overflow-hidden rounded-md bg-slate-900 grid place-items-center">
//           <Image
//             src="/images/kklogo.jfif"
//             alt={storeName}
//             fill
//             className="object-cover"
//             onError={(e: any) => {
//               (e.currentTarget as HTMLImageElement).style.display = "none";
//             }}
//           />
//           <span className="text-[11px] font-bold text-white select-none">KK</span>
//         </div>
//         <span className="text-base font-semibold tracking-tight">Admin Panel</span>
//       </div>

//       {/* Nav */}
//       <nav className="p-3 space-y-1">
//         {NAV.map(({ href, label, icon: Icon }) => {
//           const active = pathname === href;
//           return (
//             <Link
//               key={href}
//               href={href}
//               aria-current={active ? "page" : undefined}
//               className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
//                 active
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-700 hover:bg-slate-50"
//               }`}
//             >
//               <Icon
//                 className={`h-4 w-4 ${active ? "text-white" : "text-slate-500"}`}
//                 aria-hidden="true"
//               />
//               <span>{label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }
