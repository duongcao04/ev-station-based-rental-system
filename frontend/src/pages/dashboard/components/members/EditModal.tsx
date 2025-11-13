"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi } from "@/lib/api/admin.api";
import { toast } from "sonner";

const AVAILABLE_STATIONS = [
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Tân Bình",
  "Tân Phú",
  "Bình Thạnh",
  "Gò Vấp",
  "Phú Nhuận",
];

interface EditModalProps {
  user: any;
  userType: string;
  onClose: () => void;
}

export function EditModal({ user, userType, onClose }: EditModalProps) {
  const [formData, setFormData] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await adminApi.updateUser(formData.id, formData);
      toast.success("Cập nhật thành công", {
        description: "Thông tin người dùng đã được lưu.",
      });
      onClose();
    } catch (err) {
      const anyErr = err as any;
      const message =
        anyErr?.message ||
        anyErr?.error ||
        anyErr?.data?.message ||
        "Cập nhật thất bại";
      console.error("Update user failed:", anyErr);
      toast.error("Cập nhật thất bại", {
        description: message,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Thông Tin</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold">Thông Tin Hiện Tại</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên Hiển Thị</Label>
                <p>{formData.displayName}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{formData.email}</p>
              </div>
              <div>
                <Label>Số Điện Thoại</Label>
                <p>{formData.phone}</p>
              </div>
              {userType === "tenants" && (
                <>
                  <div>
                    <Label>Trạng Thái KYC</Label>
                    <p>{formData.kycStatus}</p>
                  </div>
                  <div>
                    <Label>Nhân Viên Xác Thực</Label>
                    <p>{formData.verifiedBy}</p>
                  </div>
                  <div>
                    <Label>Ghi Chú KYC</Label>
                    <p>{formData.kycNote}</p>
                  </div>
                </>
              )}
              {userType === "staff" && (
                <div>
                  <Label>Trạm Làm Việc</Label>
                  <p>{formData.station}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold">Chỉnh Sửa</h3>
            <div className="space-y-2">
              <Label>Tên Hiển Thị</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.email}
                type="email"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Số Điện Thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            {userType === "staff" && (
              <div className="space-y-2">
                <Label>Trạm Làm Việc</Label>
                <Select
                  value={formData.station}
                  onValueChange={(v) => handleChange("station", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_STATIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Lưu Thay Đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
