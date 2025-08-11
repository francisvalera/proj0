"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function AppHeader() {
  const { data } = useSession();
  const name = data?.user?.name ?? "Admin";
  const avatar = data?.user?.image ?? "";

  const parts: string[] = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        {/* centered search like the template */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search or type command…"
            className="flex-1 bg-transparent outline-none text-sm"
            aria-label="Search"
          />
          <kbd className="text-[10px] text-slate-500">⌘K</kbd>
        </div>

        {/* user badge + full name (no menu) */}
        <div className="flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full grid place-items-center bg-slate-200 text-[11px] font-semibold text-slate-700">
              {initials}
            </div>
          )}
          <span className="text-sm font-medium text-slate-800">{name}</span>
        </div>
      </div>
    </header>
  );
}


// // src/layout/AppHeader.tsx
// "use client";

// import { useSidebar } from "@/context/SidebarContext";
// import { useTheme } from "@/context/ThemeContext";
// import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";

// export default function AppHeader() {
//   const { toggleSidebar, toggleMobileSidebar } = useSidebar();
//   const { theme, toggleTheme } = useTheme();
//   const { data } = useSession();

//   const name = data?.user?.name ?? "Admin";
//   const avatar = data?.user?.image ?? "";
//   const initials =
//     (name?.trim()?.split(/\s+/).map((p: string) => p[0]).slice(0, 2).join("") || "A").toUpperCase();

//   const handleToggle = () => {
//     const canUseWindow = typeof window !== "undefined";
//     if (canUseWindow && window.innerWidth >= 1024) toggleSidebar();
//     else toggleMobileSidebar();
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-gray-900 dark:border-gray-800">
//       <div className="h-16 px-4 flex items-center justify-between gap-3">
//         <button
//           onClick={handleToggle}
//           className="h-10 w-10 grid place-items-center rounded-lg border border-slate-200 dark:border-gray-800"
//           aria-label="Toggle sidebar"
//         >
//           <Menu className="h-5 w-5" />
//         </button>

//         <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-gray-800 px-3 py-2">
//           <Search className="h-4 w-4" />
//           <input
//             placeholder="Search or type command…"
//             className="flex-1 bg-transparent outline-none text-sm"
//             aria-label="Search"
//           />
//           <kbd className="text-[10px] text-slate-500">⌘K</kbd>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={toggleTheme}
//             className="h-10 w-10 grid place-items-center rounded-lg border border-slate-200 dark:border-gray-800"
//             aria-label="Toggle theme"
//           >
//             {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//           </button>

//           <button
//             className="h-10 w-10 grid place-items-center rounded-lg border border-slate-200 dark:border-gray-800"
//             aria-label="Notifications"
//           >
//             <Bell className="h-5 w-5" />
//           </button>

//           {avatar ? (
//             <Image
//               src={avatar}
//               alt={name || "User"}
//               width={32}
//               height={32}
//               className="h-8 w-8 rounded-full object-cover"
//             />
//           ) : (
//             <div className="h-8 w-8 rounded-full grid place-items-center bg-slate-200 text-[11px] font-semibold text-slate-700">
//               {initials}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
