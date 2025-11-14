import {
  Calendar,
  Home,
  Inbox,
  Verified,
  Search,
  Settings,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Trạm xe",
    url: "/dashboard/tram-xe",
    icon: Home,
  },
  {
    title: "Booking",
    url: "/dashboard/bookings",
    icon: BookOpen,
  },
  {
    title: "Thành viên",
    url: "/dashboard/menbers",
    icon: Inbox,
  },
  {
    title: "Xác thực KYC",
    url: "/dashboard/kyc-verification",
    icon: Verified,
  },
  {
    title: "Xe",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Báo cáo",
    url: "#",
    icon: Search,
  },
  {
    title: "Cài đặt",
    url: "/dashboard/setting",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
