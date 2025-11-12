"use client";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

const tenantsData = [
  {
    id: 1,
    displayName: "Nguyễn Văn A",
    email: "nguyen.a@email.com",
    phone: "0901234567",
    kycStatus: "Đã xác thực",
    verifiedBy: "Trần Văn B",
    kycNote: "Tài liệu rõ ràng",
  },
  {
    id: 2,
    displayName: "Trần Thị B",
    email: "tran.b@email.com",
    phone: "0912345678",
    kycStatus: "Đang chờ",
    verifiedBy: "-",
    kycNote: "Chờ xác minh",
  },
  {
    id: 3,
    displayName: "Lê Minh C",
    email: "le.c@email.com",
    phone: "0923456789",
    kycStatus: "Từ chối",
    verifiedBy: "Phạm Văn D",
    kycNote: "Ảnh mờ, không thể xác thực",
  },
];

export function RenterList({ onEdit }: { onEdit: (user: any) => void }) {
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
              Trạng Thái KYC
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Nhân Viên Xác Thực
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Ghi Chú KYC
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody>
          {tenantsData.map((tenant) => (
            <tr
              key={tenant.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="p-4 align-middle">{tenant.displayName}</td>
              <td className="p-4 align-middle text-muted-foreground">
                {tenant.email}
              </td>
              <td className="p-4 align-middle">{tenant.phone}</td>
              <td className="p-4 align-middle">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tenant.kycStatus === "Đã xác thực"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : tenant.kycStatus === "Từ chối"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {tenant.kycStatus}
                </span>
              </td>
              <td className="p-4 align-middle text-muted-foreground">
                {tenant.verifiedBy}
              </td>
              <td className="p-4 align-middle text-muted-foreground text-xs max-w-xs truncate">
                {tenant.kycNote}
              </td>
              <td className="p-4 align-middle">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit({ ...tenant, type: "tenants" })}
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
