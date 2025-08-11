import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      {/* fixed sidebar */}
      <AppSidebar />

      {/* content area (full width opposite the sidebar) */}
      <div className="lg:ml-[290px]">
        <AppHeader />
        <div className="p-4 md:p-6 lg:p-8 w-full">{children}</div>
      </div>
    </div>
  );
}


// import { SidebarProvider } from "@/context/SidebarContext";
// import { ThemeProvider } from "@/context/ThemeContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   // NOTE: role gate is bypassed for now per your request — keep middleware disabled while mirroring.
//   return (
//     <ThemeProvider>
//       <SidebarProvider>
//         <div className="min-h-screen xl:flex bg-[#F6F8FB] dark:bg-black">
//           <AppSidebar />
//           <Backdrop />
//           <div className="flex-1 lg:ml-[290px]">
//             <AppHeader />
//             <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
//           </div>
//         </div>
//       </SidebarProvider>
//     </ThemeProvider>
//   );
// }
