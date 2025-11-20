import {
  BookOpen,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import logo from '@/assets/logo.png';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Trạm xe',
    url: '/dashboard/tram-xe',
    icon: Home,
  },
  {
    title: 'Booking',
    url: '/dashboard/bookings',
    icon: BookOpen,
  },
  {
    title: 'Thành viên',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Xe',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Báo cáo',
    url: '#',
    icon: Search,
  },
  {
    title: 'Cài đặt',
    url: '/dashboard/setting',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to='/'
          className='px-3 group flex items-center gap-2 no-underline'
        >
          <div
            className='relative flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 shadow-[0_8px_25px_rgba(5,150,105,0.2)] transition-transform duration-200 group-hover:scale-[1.05] group-hover:shadow-[0_12px_35px_rgba(5,150,105,0.3)]'
            aria-hidden
          >
            <img
              src={logo}
              alt='EV Station Logo'
              className='size-11 object-contain invert brightness-0'
            />
          </div>
          <div>
            <h1 className='m-0 bg-linear-to-br from-primary-700 to-primary-500 bg-clip-text text-lg font-extrabold leading-tight text-transparent'>
              EV Station
            </h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
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
