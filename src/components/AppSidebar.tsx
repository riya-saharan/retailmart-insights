import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, TrendingUp, Package, Users, Boxes,
  GitBranch, ShieldCheck, Database, Layers,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Executive Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Sales Analytics", url: "/sales", icon: TrendingUp },
  { title: "Product Analytics", url: "/products", icon: Package },
  { title: "Customer Analytics", url: "/customers", icon: Users },
  { title: "Inventory Analytics", url: "/inventory", icon: Boxes },
  { title: "Data Pipeline", url: "/pipeline", icon: GitBranch },
  { title: "Data Quality", url: "/quality", icon: ShieldCheck },
  { title: "Data Explorer", url: "/explorer", icon: Database },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">RetailMart</div>
            <div className="truncate text-xs text-sidebar-foreground/60">Analytics Platform</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
