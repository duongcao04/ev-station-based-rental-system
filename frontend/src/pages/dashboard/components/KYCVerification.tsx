"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { KYCDetailsDialog } from "./kyc/KycDetailsDialog";
import { useKycSubmissionsStore } from "@/stores/useKycSubmissionsStore";
import type { KYCSubmission, KYCStatus } from "@/types/kyc";

export function KYCVerification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | KYCStatus>("all");
  const [selectedKYC, setSelectedKYC] = useState<KYCSubmission | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const {
    submissions,
    page,
    totalPages,
    fetchSubmissions,
    verifySubmission,
    loading,
  } = useKycSubmissionsStore();

  useEffect(() => {
    fetchSubmissions({ 
      status: statusFilter === "all" ? undefined : statusFilter, 
      page: 1, 
      q: searchQuery 
    });
  }, [searchQuery, statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchSubmissions({ 
      status: statusFilter === "all" ? undefined : statusFilter, 
      page: newPage, 
      q: searchQuery 
    });
  };

  const handleEdit = (kyc: KYCSubmission) => {
    setSelectedKYC(kyc);
    setDetailsDialogOpen(true);
  };

  const getStatusIcon = (status?: KYCStatus) => {
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

  const getStatusText = (status?: KYCStatus) => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Xác Thực KYC
        </h1>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | KYCStatus)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xác thực</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KYC List */}
        {loading ? (
          <p>Đang tải...</p>
        ) : submissions.length ? (
          submissions.map((s) => (
            <Card key={s.id} className="mb-3 hover:border-primary/50">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{s.full_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {getStatusIcon(s.verification_status)}
                    {getStatusText(s.verification_status)} • Cập nhật:{" "}
                    {s.updated_at?.split("T")[0]}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(s)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Chi tiết
                </Button>
              </CardHeader>
            </Card>
          ))
        ) : (
          <p>Không có kết quả</p>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>
            {page}/{totalPages}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      {selectedKYC && (
        <KYCDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          kyc={selectedKYC}
          onSave={async (status, note) => {
            try {
              await verifySubmission(selectedKYC.id, status, note);
              // Refresh the list after verification
              await fetchSubmissions({ 
                status: statusFilter === "all" ? undefined : statusFilter, 
                page, 
                q: searchQuery 
              });
              // Close dialog after successful save
              setDetailsDialogOpen(false);
            } catch (error) {
              // Error handling is done in the store with toast
              throw error; // Re-throw to let dialog handle it
            }
          }}
        />
      )}
    </div>
  );
}
