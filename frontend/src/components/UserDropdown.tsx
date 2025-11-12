import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfile } from '../lib/queries/useAuth';
import { useAuthStore } from '../stores/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserDropdown() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const { signOut } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='ring-2 ring-primary-500 p-0.5 size-10'>
          <AvatarImage
            src='https://res.cloudinary.com/dqx1guyc0/image/upload/v1762496668/.temp/empty_avatar_wai3iw.webp'
            alt={profile.email}
            title={profile.email}
            className='cursor-pointer rounded-full'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel className='border-b mb-2'>
          <p>
            <span className='font-normal text-gray-600 text-xs'>Tài khoản</span>
            <br />
            <span>{profile.email}</span>
          </p>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IdCard />
            Xác thực KYC
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/tai-khoan')}>
            Thông tin tài khoản
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Cài đặt
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/tai-khoan/lich-su-thue')}>
            Lịch sử thuê
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Xe đang thuê</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Xe 1</DropdownMenuItem>
                <DropdownMenuItem>Xe 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
