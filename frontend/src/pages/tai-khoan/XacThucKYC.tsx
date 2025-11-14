"use client";

import { useState } from "react";
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
  X,
} from "lucide-react";

interface KYCDocument {
  name: string;
  fileName?: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt?: string;
  rejectionReason?: string;
  preview?: string;
}

export default function KYCPage() {
  const [activeDialog, setActiveDialog] = useState<"cccd" | "license" | null>(
    null
  );
  const [documents, setDocuments] = useState<Record<string, KYCDocument>>({
    cccd: {
      name: "Căn Cước Công Dân",
      status: "pending",
    },
    license: {
      name: "Giấy Phép Lái Xe",
      status: "pending",
    },
  });

  const handleFileUpload = (
    docType: "cccd" | "license",
    fileName: string,
    preview?: string | null
  ) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        fileName,
        preview,
        status: "pending",
        uploadedAt: new Date().toLocaleDateString("vi-VN"),
      } as KYCDocument,
    }));
    setActiveDialog(null);
  };

  const handleClearPreview = (docType: "cccd" | "license") => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        preview: undefined,
        fileName: undefined,
      },
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã xác thực";
      case "rejected":
        return "Từ chối";
      case "pending":
      default:
        return "Chờ xác thực";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10";
      case "rejected":
        return "bg-destructive/10";
      case "pending":
      default:
        return "bg-amber-500/10";
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
              Vui lòng tải lên các tài liệu cần thiết để xác thực thông tin của
              bạn
            </p>
          </div>

          {/* KYC Cards and Preview */}
          <div className="space-y-6">
            {/* CCCD Section */}
            <div>
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
                          {documents.cccd.fileName ? (
                            <span className="flex items-center gap-2 mt-1">
                              {getStatusIcon(documents.cccd.status)}
                              <span>
                                {documents.cccd.fileName} •{" "}
                                {getStatusText(documents.cccd.status)}
                              </span>
                            </span>
                          ) : (
                            "Tải lên ảnh CCCD của bạn"
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveDialog("cccd")}
                      variant={
                        documents.cccd.status === "approved"
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                    >
                      {documents.cccd.fileName ? "Thay Đổi" : "Tải Lên"}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              {documents.cccd.preview && (
                <div className="relative rounded-lg overflow-hidden bg-background border border-border">
                  <img
                    src={documents.cccd.preview || "/placeholder.svg"}
                    alt="CCCD Preview"
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={() => handleClearPreview("cccd")}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Driver License Section */}
            <div>
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
                          {documents.license.fileName ? (
                            <span className="flex items-center gap-2 mt-1">
                              {getStatusIcon(documents.license.status)}
                              <span>
                                {documents.license.fileName} •{" "}
                                {getStatusText(documents.license.status)}
                              </span>
                            </span>
                          ) : (
                            "Tải lên ảnh giấy phép lái xe"
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveDialog("license")}
                      variant={
                        documents.license.status === "approved"
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                    >
                      {documents.license.fileName ? "Thay Đổi" : "Tải Lên"}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              {documents.license.preview && (
                <div className="relative rounded-lg overflow-hidden bg-background border border-border">
                  <img
                    src={documents.license.preview || "/placeholder.svg"}
                    alt="License Preview"
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={() => handleClearPreview("license")}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-3">
            <Button className="flex-1" size="lg">
              Gửi Xác Thực
            </Button>
            <Button variant="outline" size="lg">
              Hủy
            </Button>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> Hình ảnh phải rõ ràng, đầy đủ thông tin và
              còn hạn sử dụng. Thời gian xác thực thường mất 1-3 ngày làm việc.
            </p>
          </div>
        </div>
      </div>

      {/* CCCD Upload Dialog */}
      <Dialog
        open={activeDialog === "cccd"}
        onOpenChange={(open) => setActiveDialog(open ? "cccd" : null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tải Lên Căn Cước Công Dân</DialogTitle>
            <DialogDescription>
              Chọn ảnh CCCD của bạn (JPG, PNG, tối đa 5MB)
            </DialogDescription>
          </DialogHeader>
          <FileUpload
            onUpload={(fileName, preview) =>
              handleFileUpload("cccd", fileName, preview)
            }
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Driver License Upload Dialog */}
      <Dialog
        open={activeDialog === "license"}
        onOpenChange={(open) => setActiveDialog(open ? "license" : null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tải Lên Giấy Phép Lái Xe</DialogTitle>
            <DialogDescription>
              Chọn ảnh mặt trước của giấy phép (JPG, PNG, tối đa 5MB)
            </DialogDescription>
          </DialogHeader>
          <FileUpload
            onUpload={(fileName, preview) =>
              handleFileUpload("license", fileName, preview)
            }
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
