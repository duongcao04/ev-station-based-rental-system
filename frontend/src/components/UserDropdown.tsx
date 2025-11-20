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
} from "@/components/ui/dropdown-menu";

import { useProfile } from "@/lib/queries/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const { signOut } = useAuthStore();

  if (isLoading || !profile) {
    return (
      <Avatar className="ring-2 ring-primary p-0.5 size-10">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ring-2 ring-primary-500 p-0.5 size-10 cursor-pointer">
          <AvatarImage
            src={
              profile.avatarUrl ||
              "https://res.cloudinary.com/dqx1guyc0/image/upload/v1762496668/.temp/empty_avatar_wai3iw.webp"
            }
            alt={profile.email}
            title={profile.email}
            className="rounded-full"
          />
          <AvatarFallback>
            {profile.displayName?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        {/* Header thông tin */}
        <DropdownMenuLabel className="border-b mb-2">
          <p>
            <span className="font-normal text-gray-600 text-xs">Tài khoản</span>
            <br />
            <span>{profile.email}</span>
          </p>
        </DropdownMenuLabel>

        {/* Nhóm 1 */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/tai-khoan/xac-thuc-kyc")}>
            <IdCard className="mr-2 h-4 w-4" />
            Xác thực KYC
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/tai-khoan")}>
            Thông tin tài khoản
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/tai-khoan/cai-dat")}>
            Cài đặt
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Nhóm 2 */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/tai-khoan/lich-su-thue")}>
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

        {/* Logout */}
        <DropdownMenuItem onClick={signOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
