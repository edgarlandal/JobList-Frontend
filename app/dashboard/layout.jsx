'use client'
import AppSidebar from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

const pages = {
  "/dashboard" : "Resumen",
  "/dashboard/jobs": "Applications"
}

export default function Layout({ children }) {
  const pathname = usePathname();
  const title = pages[pathname] ?? "Joblist"

  return (
    <SidebarProvider style={{ "--sidebar-width": "17rem" }}>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden bg-[#E8EFF3]">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#0F766E]/20 bg-[#DCEBE9] px-4 text-[#0F172A] md:px-6">
          <SidebarTrigger className="text-[#0F766E] hover:bg-[#0F766E]/10 hover:text-[#0F172A]" />
          <span aria-hidden="true" className="h-5 w-px bg-[#0F766E]/25" />
          <span className="text-lg font-semibold">{title}</span>
        </header>
        <div className="flex-1 bg-[linear-gradient(135deg,#E0EEEB_0%,#E8EFF3_55%,#E8E9F5_100%)] p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}