"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils/image";
import { toast } from "sonner";

import type { KYCSubmission, KYCStatus } from "@/types/kyc";

interface KYCDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kyc: KYCSubmission;
  onSave: (status: "verified" | "rejected", note?: string) => void;
}

export function KYCDetailsDialog({
  open,
  onOpenChange,
  kyc,
  onSave,
}: KYCDetailsDialogProps) {
  const [status, setStatus] = useState<KYCStatus>(
    (kyc.verification_status as KYCStatus) || "pending"
  );
  const [note, setNote] = useState(kyc.note || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (status === "pending") {
      toast.error(
        "Vui lòng chọn trạng thái xác thực (Đã xác thực hoặc Từ chối)"
      );
      return;
    }

    setIsSaving(true);
    try {
      await onSave(status as "verified" | "rejected", note);
    } catch (error) {
      console.error("Error saving KYC verification:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Xác Thực KYC</DialogTitle>
            <DialogDescription>
              Xem thông tin người dùng và cập nhật trạng thái xác thực
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Information - Read Only */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Thông Tin Người Dùng
              </h3>
              <div className="space-y-3 bg-secondary/30 p-4 rounded-lg">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Tên
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {kyc.full_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Email
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {kyc.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Số Điện Thoại
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {kyc.phone_number || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Tài Liệu Đính Kèm
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() =>
                    setSelectedImage(getImageUrl(kyc.national_id_url))
                  }
                >
                  <img
                    src={getImageUrl(kyc.national_id_url)}
                    alt="CCCD"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <p className="text-xs text-muted-foreground p-2">
                    Căn Cước Công Dân
                  </p>
                </div>
                <div
                  className="border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() =>
                    setSelectedImage(getImageUrl(kyc.driver_license_url))
                  }
                >
                  <img
                    src={getImageUrl(kyc.driver_license_url)}
                    alt="License"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <p className="text-xs text-muted-foreground p-2">
                    Giấy Phép Lái Xe
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Nhấp vào ảnh để xem phóng to
              </p>
            </div>

            {/* Status and Note - Editable */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Xác Thực
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Trạng Thái Xác Thực
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as KYCStatus)}
                  >
                    <SelectTrigger className="mt-2 text-base h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-base">
                      <SelectItem
                        value="pending"
                        className="flex items-center gap-2"
                        disabled
                      >
                        <Clock className="w-5 h-5 text-amber-500" /> Chờ xác
                        thực
                      </SelectItem>
                      <SelectItem
                        value="verified"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" /> Đã
                        xác thực
                      </SelectItem>
                      <SelectItem
                        value="rejected"
                        className="flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-destructive" /> Từ
                        chối
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Ghi Chú Xác Thực
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú (lý do từ chối, yêu cầu bổ sung, v.v.)"
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
                disabled={isSaving}
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xem Ảnh Chi Tiết</DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedImage && (
            <div className="flex justify-center items-center p-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[75vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
