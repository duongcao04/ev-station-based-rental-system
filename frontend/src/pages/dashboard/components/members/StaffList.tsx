"use client";

import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

const staffData = [
  {
    id: 1,
    displayName: "Trần Văn B",
    email: "tran.b@email.com",
    phone: "0912345678",
    station: "Quận 1",
  },
  {
    id: 2,
    displayName: "Phạm Văn D",
    email: "pham.d@email.com",
    phone: "0934567890",
    station: "Quận 2",
  },
  {
    id: 3,
    displayName: "Hoàng Thị E",
    email: "hoang.e@email.com",
    phone: "0945678901",
    station: "Quận 3",
  },
];

export function StaffList({ onEdit }: { onEdit: (user: any) => void }) {
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
              Trạm Làm Việc
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((staff) => (
            <tr
              key={staff.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="p-4 align-middle">{staff.displayName}</td>
              <td className="p-4 align-middle text-muted-foreground">
                {staff.email}
              </td>
              <td className="p-4 align-middle">{staff.phone}</td>
              <td className="p-4 align-middle">{staff.station}</td>
              <td className="p-4 align-middle">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit({ ...staff, type: "staff" })}
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
