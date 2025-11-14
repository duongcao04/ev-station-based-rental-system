"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "./components/kyc/ImageUpload";
import {
  FileText,
  Dices as License,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useKycStore } from "@/stores/useKycStore";

export default function KYCPage() {
  const [activeDialog, setActiveDialog] = useState<"cccd" | "license" | null>(
    null
  );

  const { profile, fetchKYC, uploadKYC } = useKycStore();

  useEffect(() => {
    fetchKYC();
  }, []);

  const canEdit = profile?.verification_status !== "verified";

  const handleFileUpload = async (docType: "cccd" | "license", file: File) => {
    const files =
      docType === "cccd" ? { national_id: file } : { driver_license: file };

    await uploadKYC(files);
    await fetchKYC();
    setActiveDialog(null);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "verified":
        return "Đã xác thực";
      case "rejected":
        return "Bị từ chối";
      case "pending":
      default:
        return "Chờ xác thực";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Xác Thực Danh Tính
            </h1>
            <p className="text-muted-foreground mt-2">
              Vui lòng tải lên các giấy tờ cần thiết để xác thực danh tính
            </p>
          </div>

          {/* KYC Cards */}
          <div className="space-y-6">
            {/* CCCD */}
            <Card className="border border-border hover:border-primary/50 transition-colors mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Căn Cước Công Dân
                      </CardTitle>
                      <CardDescription>
                        {profile?.national_id_url ? (
                          <span className="flex items-center gap-2 mt-1">
                            {getStatusIcon(profile.verification_status)}
                            <span>
                              {profile.national_id_url.split("/").pop()} •{" "}
                              {getStatusText(profile.verification_status)}
                            </span>
                          </span>
                        ) : (
                          "Tải lên ảnh CCCD"
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    onClick={() => canEdit && setActiveDialog("cccd")}
                    variant={canEdit ? "outline" : "secondary"}
                    size="sm"
                    disabled={!canEdit}
                  >
                    {profile?.national_id_url ? "Thay Đổi" : "Tải Lên"}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Driver License */}
            <Card className="border border-border hover:border-primary/50 transition-colors mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <License className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Giấy Phép Lái Xe (Mặt Trước)
                      </CardTitle>
                      <CardDescription>
                        {profile?.driver_license_url ? (
                          <span className="flex items-center gap-2 mt-1">
                            {getStatusIcon(profile.verification_status)}
                            <span>
                              {profile.driver_license_url.split("/").pop()} •{" "}
                              {getStatusText(profile.verification_status)}
                            </span>
                          </span>
                        ) : (
                          "Tải lên ảnh giấy phép lái xe"
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    onClick={() => canEdit && setActiveDialog("license")}
                    variant={canEdit ? "outline" : "secondary"}
                    size="sm"
                    disabled={!canEdit}
                  >
                    {profile?.driver_license_url ? "Thay Đổi" : "Tải Lên"}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> Hình ảnh phải rõ ràng, đầy đủ thông tin và
              còn hạn sử dụng. Thời gian xác thực thường mất 1-3 ngày làm việc.
            </p>
          </div>
        </div>
      </div>

      {/* CCCD Dialog */}
      <Dialog
        open={activeDialog === "cccd" && canEdit}
        onOpenChange={(open) => setActiveDialog(open ? "cccd" : null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tải Lên Căn Cước Công Dân</DialogTitle>
            <DialogDescription>
              Chọn ảnh CCCD (JPG/PNG, tối đa 5MB)
            </DialogDescription>
          </DialogHeader>
          <FileUpload
            onUpload={(file) => handleFileUpload("cccd", file)}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Driver License Dialog */}
      <Dialog
        open={activeDialog === "license" && canEdit}
        onOpenChange={(open) => setActiveDialog(open ? "license" : null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tải Lên Giấy Phép Lái Xe</DialogTitle>
            <DialogDescription>
              Chọn ảnh mặt trước giấy phép (JPG/PNG, tối đa 5MB)
            </DialogDescription>
          </DialogHeader>
          <FileUpload
            onUpload={(file) => handleFileUpload("license", file)}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
