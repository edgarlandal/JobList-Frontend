"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  Sparkles,
  User2
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

const options = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Applications",
    url: "/dashboard/jobs",
    icon: BriefcaseBusiness,
    upcoming: false,
  },
  {
    title: "Interviews",
    url: "/dashboard/interviews",
    icon: CalendarDays,
    upcoming: true,
  },
  {
    title: "Profile",
    url:"/dashboard/profile",
    icon: User2,
    upcoming: true
  }
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="py-5">
        <Link
          href="/dashboard"
          aria-label="JobList - Go to overview"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sidebar-primary-foreground shadow-sm">
                <Image
                  src="/img/logo_alone.png"
                  alt="joblist"
                  width={300}
                  height={200}
                />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block text-lg font-extrabold tracking-tight text-sidebar-foreground">
              <span className="text-sidebar-primary">
                <Image
                  src="/img/name_white.png"
                  alt="joblist"
                  width={150}
                  height={100}
                />
              </span>
            </span>

          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup className="pt-5">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-sidebar-secondary">
            My job search
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <nav aria-label="Main navigation">
              <SidebarMenu className="gap-1.5">
                {options.map(({ title, url, icon: Icon, upcoming }) => {
                  const isActive =
                    pathname === url ||
                    (url !== "/dashboard" && pathname.startsWith(`${url}/`));
                  return (
                    <SidebarMenuItem key={url}>
                      <SidebarMenuButton
                        render={
                          upcoming ? undefined : (
                            <Link
                              href={url}
                              onClick={() => setOpenMobile(false)}
                            />
                          )
                        }
                        disabled={upcoming}
                        isActive={isActive}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={upcoming ? `${title}, coming soon` : title}
                        tooltip={title}
                        className="h-11 gap-3 rounded-lg transition-colors motion-reduce:transition-none data-active:font-bold data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary-hover"
                      >
                        <Icon aria-hidden="true" />
                        <span>{title}</span>
                        {upcoming && (
                          <span className="ml-auto text-[10px] group-data-[collapsible=icon]:hidden">
                            Soon
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-4">
        <div className="rounded-xl border border-[#0F766E]/50 bg-[#0F766E]/20 p-4 group-data-[collapsible=icon]:hidden">
          <Sparkles className="mb-2 size-4 text-white" aria-hidden="true" />
          <p className="text-sm font-bold text-white">Every step counts</p>
          <p className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">
            Organize your job search and keep your next opportunity in sight.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
