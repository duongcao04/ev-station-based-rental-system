import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '../sidebars/DashboardSidebar';
import { useState } from 'react';
import AdminGuard from '../guards/AdminGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <AdminGuard>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <DashboardSidebar />
        <main className='p-3 w-full'>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AdminGuard>
  );
}
