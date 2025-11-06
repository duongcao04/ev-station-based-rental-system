import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNavigation() {
  return (
    <header className='bg-card border-b border-border px-6 py-4 flex justify-between items-center'>
      <div>
        <h2 className='text-lg font-semibold text-foreground'>
          Hệ Thống Quản Lý Thuê Xe
        </h2>
        <p className='text-sm text-muted-foreground'>
          Bảng điều khiển quản trị
        </p>
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon'>
          <Bell className='w-5 h-5' />
        </Button>
        <Button variant='ghost' size='icon'>
          <Settings className='w-5 h-5' />
        </Button>
        <div className='flex items-center gap-3 pl-4 border-l border-border'>
          <div className='w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center'>
            <User className='w-5 h-5 text-primary' />
          </div>
          <div className='flex flex-col gap-0'>
            <p className='text-sm font-semibold text-foreground'>
              Quản Trị Viên
            </p>
            <p className='text-xs text-muted-foreground'>admin@rental.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
