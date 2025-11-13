"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";

export function AdminList({ onEdit }: { onEdit: (user: any) => void }) {
  const [adminData, setAdminData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getUsers({
          page: currentPage,
          limit: pageSize,
          role: "admin",
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

        setAdminData(result);
        setTotalItems(totalFromMeta);
        setTotalPages(normalizedTotalPages);
      } catch (err) {
        console.error(err);
        setAdminData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [currentPage, pageSize]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  const safeTotalPages = Math.max(1, totalPages);
  const hasData = adminData.length > 0;
  const startIndex = hasData ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = hasData ? startIndex + adminData.length - 1 : 0;
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị {rangeText} trong {totalItems} quản trị
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
              <th className="p-2 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {adminData.map((admin) => (
              <tr
                key={admin.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-2">{admin.displayName}</td>
                <td className="p-2 text-muted-foreground">{admin.email}</td>
                <td className="p-2">{admin.phone}</td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit({ ...admin, type: "admin" })}
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Sửa
                  </Button>
                </td>
              </tr>
            ))}
            {adminData.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={4}>
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
