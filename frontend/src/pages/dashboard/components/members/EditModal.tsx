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

const AVAILABLE_STATIONS = [
  { id: 1, name: "Quận 1" },
  { id: 2, name: "Quận 2" },
  { id: 3, name: "Quận 3" },
  { id: 4, name: "Quận 4" },
  { id: 5, name: "Quận 5" },
  { id: 6, name: "Quận 6" },
  { id: 7, name: "Quận 7" },
  { id: 8, name: "Quận 8" },
  { id: 9, name: "Quận 9" },
  { id: 10, name: "Quận 10" },
  { id: 11, name: "Quận 11" },
  { id: 12, name: "Quận 12" },
  { id: 13, name: "Tân Bình" },
  { id: 14, name: "Tân Phú" },
  { id: 15, name: "Bình Thạnh" },
  { id: 16, name: "Gò Vấp" },
  { id: 17, name: "Phú Nhuận" },
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

  const handleSave = () => {
    // TODO: Save to database
    console.log("Saving:", formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Thông Tin</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Display all information - Read only section */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-foreground">Thông Tin Cơ Bản</h3>

            {userType === "tenants" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Tên Hiển Thị
                    </Label>
                    <p className="text-foreground mt-1">
                      {formData.displayName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-foreground mt-1">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Số Điện Thoại
                    </Label>
                    <p className="text-foreground mt-1">{formData.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Trạng Thái KYC
                    </Label>
                    <p className="text-foreground mt-1">{formData.kycStatus}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Nhân Viên Xác Thực
                    </Label>
                    <p className="text-foreground mt-1">
                      {formData.verifiedBy}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Ghi Chú KYC
                    </Label>
                    <p className="text-foreground mt-1">{formData.kycNote}</p>
                  </div>
                </div>
              </>
            )}

            {userType === "staff" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Tên Hiển Thị
                    </Label>
                    <p className="text-foreground mt-1">
                      {formData.displayName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-foreground mt-1">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Số Điện Thoại
                    </Label>
                    <p className="text-foreground mt-1">{formData.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Trạm Làm Việc
                    </Label>
                    <p className="text-foreground mt-1">{formData.station}</p>
                  </div>
                </div>
              </>
            )}

            {userType === "admin" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Tên Hiển Thị
                    </Label>
                    <p className="text-foreground mt-1">
                      {formData.displayName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-foreground mt-1">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Số Điện Thoại
                    </Label>
                    <p className="text-foreground mt-1">{formData.phone}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Editable fields section */}
          <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-foreground">
              Chỉnh Sửa Thông Tin
            </h3>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium">
                Tên Hiển Thị
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                className="border border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Số Điện Thoại
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border border-border"
              />
            </div>

            {userType === "staff" && (
              <div className="space-y-2">
                <Label htmlFor="station" className="text-sm font-medium">
                  Trạm Làm Việc
                </Label>
                <Select
                  value={formData.station}
                  onValueChange={(value) => handleChange("station", value)}
                >
                  <SelectTrigger id="station" className="border border-border">
                    <SelectValue placeholder="Chọn trạm làm việc" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_STATIONS.map((station) => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
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
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-primary hover:bg-primary/90"
          >
            Lưu Thay Đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
