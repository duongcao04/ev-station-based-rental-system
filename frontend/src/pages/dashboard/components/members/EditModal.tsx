"use client";

import { useState, useEffect } from "react";
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
import { stationApi } from "@/lib/api/station.api";
import { toast } from "sonner";

interface EditModalProps {
  user: any;
  userType: string;
  onClose: () => void;
}

export function EditModal({ user, userType, onClose }: EditModalProps) {
  const [formData, setFormData] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  useEffect(() => {
    if (userType === "staff") {
      fetchStations();
    }
  }, [userType]);

  const fetchStations = async () => {
    setLoadingStations(true);
    try {
      const response = await stationApi.getAllStations();
      setStations(response.data || []);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      toast.error("Không thể tải danh sách trạm", {
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingStations(false);
    }
  };

  const handleChange = (field: string, value: string | null) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const updateData: any = {
        email: formData.email,
        phone: formData.phone,
        displayName: formData.displayName,
      };

      if (userType === "staff") {
        updateData.station_id = formData.station_id === "none" || !formData.station_id ? null : formData.station_id;
      }

      await adminApi.updateUser(formData.id, updateData);
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
                  <p>
                    {formData.station_id
                      ? (stations.find(
                          (s) =>
                            (s.station_id || s.id) === formData.station_id
                        )?.display_name || formData.station_id)
                      : "Chưa có trạm"}
                  </p>
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
                  value={formData.station_id || "none"}
                  onValueChange={(v) => handleChange("station_id", v === "none" ? null : v)}
                  disabled={loadingStations}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingStations ? "Đang tải..." : "Chọn trạm"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có trạm</SelectItem>
                    {stations.map((station) => (
                      <SelectItem
                        key={station.station_id || station.id}
                        value={station.station_id || station.id}
                      >
                        {station.display_name ||
                          station.station_id ||
                          station.id}
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
