import {
  BookCopy,
  BookOpen,
  Calendar,
  Car,
  CarTaxiFront,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
  Slack,
  User2,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

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
              <SidebarMenuItem key='dashboard'>
                <SidebarMenuButton asChild>
                  <Link to='/dashboard'>
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='tram-xe'>
                <SidebarMenuButton asChild>
                  <Link to='/dashboard/tram-xe'>
                    <Home />
                    <span>Trạm xe</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='booking'>
                <SidebarMenuButton asChild>
                  <Link to='/dashboard/bookings'>
                    <BookOpen />
                    <span>Booking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className='group/vehicle'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center justify-start gap-2'>
                          <Car size={16} />
                          <span>Phương tiện</span>
                        </div>
                        <ChevronDown size={14} />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuItem key='xe-dien'>
                        <SidebarMenuButton asChild>
                          <Link to='/dashboard/xe-dien'>
                            <CarTaxiFront />
                            <span>Xe điện</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key='danh-muc'>
                        <SidebarMenuButton asChild>
                          <Link to='/dashboard/danh-muc'>
                            <BookCopy />
                            <span>Danh mục</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key='thuong-hieu'>
                        <SidebarMenuButton asChild>
                          <Link to='/dashboard/thuong-hieu'>
                            <Slack />
                            <span>Thương hiệu</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem key='thanh-vien'>
                <SidebarMenuButton asChild>
                  <Link to='/dashboard/thanh-vien'>
                    <User2 />
                    <span>Thành viên</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='cai-dat'>
                <SidebarMenuButton asChild>
                  <Link to='/dashboard/setting'>
                    <Settings />
                    <span>Cài đặt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
