"use client";

import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

const adminData = [
  {
    id: 1,
    displayName: "Quản Trị Viên A",
    email: "admin.a@email.com",
    phone: "0901234567",
  },
  {
    id: 2,
    displayName: "Quản Trị Viên B",
    email: "admin.b@email.com",
    phone: "0912345678",
  },
];

export function AdminList({ onEdit }: { onEdit: (user: any) => void }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Tên Hiển Thị
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Email
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Số Điện Thoại
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((admin) => (
            <tr
              key={admin.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="p-4 align-middle">{admin.displayName}</td>
              <td className="p-4 align-middle text-muted-foreground">
                {admin.email}
              </td>
              <td className="p-4 align-middle">{admin.phone}</td>
              <td className="p-4 align-middle">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit({ ...admin, type: "admin" })}
                  className="gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
