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

export function StaffList({ onEdit }: { onEdit: (user: any) => void }) {
  const [staffData, setStaffData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [stationFilter, setStationFilter] = useState<string>("");

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getUsers({
          page: currentPage,
          limit: pageSize,
          role: "staff",
          q: searchTerm || undefined,
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

        if (currentPage > normalizedTotalPages && normalizedTotalPages > 0) {
          setCurrentPage(normalizedTotalPages);
          return;
        }

        setStaffData(result);
        setTotalItems(totalFromMeta);
        setTotalPages(normalizedTotalPages);
      } catch (err) {
        console.error(err);
        setStaffData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [currentPage, pageSize, searchTerm]);

  if (loading) return <p>Đang tải dữ liệu...</p>;


  const filteredData = staffData.filter((staff) => {
    const matchesStation =
      stationFilter === "" || staff.station === stationFilter;
    return matchesStation;
  });

  const safeTotalPages = Math.max(1, totalPages);
  const hasData = filteredData.length > 0;
  const startIndex = hasData ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = hasData ? startIndex + filteredData.length - 1 : 0;
  const rangeText = hasData ? `${startIndex}-${endIndex}` : "0";

  const goPrev = () =>
    setCurrentPage((p) => {
      if (p <= 1) return 1;
      return p - 1;
    });

  const goNext = () =>
    setCurrentPage((p) => {
      if (p >= safeTotalPages) return safeTotalPages;
      return p + 1;
    });

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
            Trạm Làm Việc
          </label>
          <Select
            value={stationFilter || "all"}
            onValueChange={(value) =>
              setStationFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {AVAILABLE_STATIONS.map((station) => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị {rangeText} trong {totalItems} nhân viên
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

      <div className="relative w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-2 text-left">Tên Hiển Thị</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Số Điện Thoại</th>
              <th className="p-2 text-left">Trạm Làm Việc</th>
              <th className="p-2 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((staff) => (
              <tr
                key={staff.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-2">{staff.displayName}</td>
                <td className="p-2 text-muted-foreground">{staff.email}</td>
                <td className="p-2">{staff.phone}</td>
                <td className="p-2">{staff.station}</td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit({ ...staff, type: "staff" })}
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  className="p-4 text-center text-muted-foreground"
                  colSpan={5}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
