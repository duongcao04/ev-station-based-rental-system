"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Search, X } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RenterList({ onEdit }: { onEdit: (user: any) => void }) {
  const [tenantsData, setTenantsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState<string>("");

  // Mapping trạng thái KYC với nhãn và màu nền/chữ
  const kycStatusMap: Record<
    string,
    { label: string; bg: string; text: string }
  > = {
    pending: {
      label: "Đang chờ xác thực",
      bg: "bg-yellow-100 dark:bg-yellow-950",
      text: "text-yellow-800 dark:text-yellow-200",
    },
    verified: {
      label: "Đã xác thực",
      bg: "bg-green-100 dark:bg-green-950",
      text: "text-green-800 dark:text-green-200",
    },
    rejected: {
      label: "KYC bị từ chối",
      bg: "bg-red-100 dark:bg-red-950",
      text: "text-red-800 dark:text-red-200",
    },
  };

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getUsers({
          page: currentPage,
          limit: pageSize,
          role: "renter",
        });

        const result = response?.result ?? [];
        const meta = response?.meta ?? {};
        const totalFromMeta =
          typeof meta.total === "number" ? meta.total : result.length || 0;
        const totalPagesFromMeta =
          typeof meta.totalPages === "number"
            ? meta.totalPages
            : Math.ceil(totalFromMeta / pageSize);
        const normalizedTotalPages = Math.max(
          1,
          totalPagesFromMeta && totalPagesFromMeta > 0
            ? totalPagesFromMeta
            : Math.ceil((totalFromMeta || 0) / pageSize) || 1
        );

        if (currentPage > normalizedTotalPages) {
          setCurrentPage(normalizedTotalPages);
          return;
        }

        setTenantsData(result);
        setTotalItems(totalFromMeta);
        setTotalPages(normalizedTotalPages);
      } catch (err) {
        console.error(err);
        setTenantsData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [currentPage, pageSize]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  const filteredData = tenantsData.filter((tenant) => {
    const matchesSearch =
      searchTerm === "" ||
      tenant.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone?.includes(searchTerm);
    const matchesKycFilter = kycFilter === "" || tenant.kycStatus === kycFilter;
    return matchesSearch && matchesKycFilter;
  });

  const safeTotalPages = Math.max(1, totalPages);
  const hasData = filteredData.length > 0;
  const startIndex = hasData ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = hasData ? startIndex + filteredData.length - 1 : 0;
  const rangeText = hasData ? `${startIndex}-${endIndex}` : "0";

  const goPrev = () => setCurrentPage((p) => (p <= 1 ? 1 : p - 1));

  const goNext = () =>
    setCurrentPage((p) => (p >= safeTotalPages ? safeTotalPages : p + 1));

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-1 block">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:w-48">
          <label className="text-sm font-medium text-foreground mb-1 block">
            Trạng Thái KYC
          </label>
          <Select
            value={kycFilter || "all"}
            onValueChange={(value) =>
              setKycFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Đang chờ xác thực</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="rejected">KYC bị từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Header: số dòng và số lượng hiển thị */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị {rangeText} trong {totalItems} khách thuê
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Số dòng:</label>
          <select
            className="border border-border rounded px-2 py-1 text-sm bg-background"
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="relative w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-2 text-left">Tên Hiển Thị</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Số Điện Thoại</th>
              <th className="p-2 text-left">Trạng Thái KYC</th>
              <th className="p-2 text-left">Nhân Viên Xác Thực</th>
              <th className="p-2 text-left">Ghi Chú KYC</th>
              <th className="p-2 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-2">{tenant.displayName}</td>
                <td className="p-2 text-muted-foreground">{tenant.email}</td>
                <td className="p-2">{tenant.phone}</td>

                {/* Trạng thái KYC */}
                <td className="p-2">
                  {kycStatusMap[tenant.kycStatus] ? (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        kycStatusMap[tenant.kycStatus].bg
                      } ${kycStatusMap[tenant.kycStatus].text}`}
                    >
                      {kycStatusMap[tenant.kycStatus].label}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Không xác định
                    </span>
                  )}
                </td>

                <td className="p-2">{tenant.verifiedBy}</td>
                <td className="p-2 text-xs truncate">{tenant.kycNote}</td>
                <td className="p-2">
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
            {!hasData && (
              <tr>
                <td
                  className="p-4 text-center text-muted-foreground"
                  colSpan={7}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Trang {Math.min(currentPage, safeTotalPages)}/{safeTotalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentPage === 1 || loading}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={currentPage >= safeTotalPages || loading}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
