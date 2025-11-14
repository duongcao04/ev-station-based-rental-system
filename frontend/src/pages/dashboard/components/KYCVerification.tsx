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
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { KYCDetailsDialog } from "./kyc/KycDetailsDialog";

interface KYC {
  id: string;
  userName: string;
  email: string;
  phone: string;
  cccdImage: string;
  licenseImage: string;
  status: "pending" | "verified" | "rejected";
  note: string;
  submittedAt: string;
}

const ITEMS_PER_PAGE = 5;

export function KYCVerification() {
  const [kycList, setKycList] = useState<KYC[]>([
    {
      id: "1",
      userName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      cccdImage: "/identity-card.jpg",
      licenseImage: "/generic-identification-card.png",
      status: "pending",
      note: "",
      submittedAt: "2025-01-10",
    },
    {
      id: "2",
      userName: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      cccdImage: "/identity-card.jpg",
      licenseImage: "/generic-identification-card.png",
      status: "verified",
      note: "Xác thực thành công",
      submittedAt: "2025-01-08",
    },
    {
      id: "3",
      userName: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0923456789",
      cccdImage: "/identity-card.jpg",
      licenseImage: "/generic-identification-card.png",
      status: "rejected",
      note: "Ảnh CCCD không rõ ràng, vui lòng tải lại",
      submittedAt: "2025-01-07",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKYC, setSelectedKYC] = useState<KYC | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const filteredKYC = kycList.filter(
    (kyc) =>
      kyc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kyc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kyc.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredKYC.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedKYC = filteredKYC.slice(startIndex, endIndex);

  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Đã xác thực";
      case "rejected":
        return "Từ chối";
      case "pending":
      default:
        return "Chờ xác thực";
    }
  };

  const handleEdit = (kyc: KYC) => {
    setSelectedKYC(kyc);
    setDetailsDialogOpen(true);
  };

  const handleSaveKYC = (
    status: "pending" | "verified" | "rejected",
    note: string
  ) => {
    if (selectedKYC) {
      setKycList((prev) =>
        prev.map((kyc) =>
          kyc.id === selectedKYC.id ? { ...kyc, status, note } : kyc
        )
      );
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Xác Thực KYC</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý và xác thực tài liệu người dùng
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* KYC List */}
          <div className="space-y-3">
            {paginatedKYC.length > 0 ? (
              paginatedKYC.map((kyc) => (
                <Card
                  key={kyc.id}
                  className="border border-border hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {kyc.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {kyc.userName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {kyc.email} • {kyc.phone}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusIcon(kyc.status)}
                            <span className="text-xs text-muted-foreground">
                              {getStatusText(kyc.status)} • Nộp:{" "}
                              {kyc.submittedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEdit(kyc)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Chi Tiết
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy KYC nào</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredKYC.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1} đến{" "}
                {Math.min(endIndex, filteredKYC.length)} trong{" "}
                {filteredKYC.length} kết quả
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "primary" : "outline"} // <-- change here
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Tiếp
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedKYC && (
        <KYCDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          kyc={selectedKYC}
          onSave={handleSaveKYC}
        />
      )}
    </div>
  );
}
