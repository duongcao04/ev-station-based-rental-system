'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TCar } from '../../../lib/types/car.type';

interface DataTableProps {
  data: TCar[];
  isLoading?: boolean;
  onEdit?: (vehicle: TCar) => void;
  onDelete?: (vehicleId: string) => void;
}

const statusConfig = {
  available: { label: 'Sẵn Sàng', variant: 'default' as const },
  rented: { label: 'Đã Cho Thuê', variant: 'secondary' as const },
  maintenance: { label: 'Bảo Trì', variant: 'outline' as const },
};

type ColumnKey =
  | 'id'
  | 'displayName'
  | 'location'
  | 'isInStock'
  | 'quality'
  | 'lastMaintenance';

const columns: { key: ColumnKey; label: string }[] = [
  { key: 'id', label: 'ID Xe' },
  { key: 'displayName', label: 'Tên xe' },
  { key: 'location', label: 'Thương hiệu' },
  { key: 'isInStock', label: 'Tình Trạng' },
  { key: 'quality', label: 'Số lượng xe' },
  { key: 'lastMaintenance', label: 'Bảo Trì Gần Nhất' },
];

export function DataTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([
    'id',
    'displayName',
    'location',
    'isInStock',
    'quality',
    'lastMaintenance',
  ]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((vehicle) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        vehicle.id.toLowerCase().includes(searchLower) ||
        vehicle.displayName.toLowerCase().includes(searchLower) ||
        vehicle.brand?.displayName.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || vehicle.isInStock;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const toggleColumnVisibility = (columnKey: ColumnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((k) => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleDelete = (vehicleId: string) => {
    onDelete?.(vehicleId);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return <div className='text-center py-8'>Đang tải dữ liệu...</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex-1 max-w-sm relative'>
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm theo ID, tên xe hoặc Địa Điểm...'
            className='pl-9'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex gap-2'>
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Lọc theo trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả trạng thái</SelectItem>
              <SelectItem value='available'>Sẵn Sàng</SelectItem>
              <SelectItem value='rented'>Đã Cho Thuê</SelectItem>
              <SelectItem value='maintenance'>Bảo Trì</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='gap-2 bg-transparent'
              >
                <Eye className='h-4 w-4' />
                Cột
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='px-2 py-1.5 text-sm font-semibold'>
                Hiển thị/Ẩn cột
              </div>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.includes(column.key)}
                  onCheckedChange={() => toggleColumnVisibility(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              {visibleColumns.map((columnKey) => (
                <TableHead key={columnKey}>
                  {columns.find((c) => c.key === columnKey)?.label}
                </TableHead>
              ))}
              <TableHead className='text-right'>Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 1}
                  className='text-center text-muted-foreground py-8'
                >
                  Không tìm thấy xe nào
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((vehicle) => (
                <TableRow key={vehicle.id} className='hover:bg-muted/50'>
                  {visibleColumns.includes('id') && (
                    <TableCell className='font-mono text-sm'>
                      {vehicle?.id}
                    </TableCell>
                  )}
                  {visibleColumns.includes('displayName') && (
                    <TableCell className='font-semibold'>
                      {vehicle?.displayName}
                    </TableCell>
                  )}
                  {visibleColumns.includes('location') && (
                    <TableCell>{vehicle?.brand?.displayName}</TableCell>
                  )}
                  {visibleColumns.includes('isInStock') && (
                    <TableCell>
                      <Badge
                        variant={vehicle?.isInStock ? 'default' : 'destructive'}
                      >
                        {vehicle?.isInStock ? 'Còn xe' : 'Hết xe'}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes('quality') && (
                    <TableCell>
                      {vehicle?.quantity.toLocaleString()} xe
                    </TableCell>
                  )}
                  {visibleColumns.includes('lastMaintenance') && (
                    <TableCell className='text-sm text-muted-foreground'>
                      {/* {vehicle.lastMaintenance} */}
                    </TableCell>
                  )}
                  <TableCell className='text-right'>
                    <div className='flex gap-2 justify-end'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit?.(vehicle)}
                        title='Chỉnh sửa'
                      >
                        <Edit2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setDeleteConfirm(vehicle.id)}
                        title='Xóa'
                      >
                        <Trash2 className='h-4 w-4 text-destructive' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-2 justify-end'>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Xóa
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results summary */}
      {filteredData.length > 0 && (
        <div className='text-sm text-muted-foreground'>
          Hiển thị {filteredData.length} trên {data.length} xe
        </div>
      )}
    </div>
  );
}
