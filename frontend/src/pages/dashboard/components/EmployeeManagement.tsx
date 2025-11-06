'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp } from 'lucide-react';

const employeeData = [
  {
    id: 'EMP001',
    name: 'Võ Minh Khôi',
    location: 'Quận 1',
    role: 'Nhân viên giao/nhận',
    transactions: 324,
    satisfaction: 4.8,
    status: 'active',
  },
  {
    id: 'EMP002',
    name: 'Đặng Thanh Huyền',
    location: 'Quận 2',
    role: 'Nhân viên giao/nhận',
    transactions: 287,
    satisfaction: 4.6,
    status: 'active',
  },
  {
    id: 'EMP003',
    name: 'Trần Quốc Anh',
    location: 'Quận 3',
    role: 'Quản lý điểm',
    transactions: 156,
    satisfaction: 4.9,
    status: 'active',
  },
  {
    id: 'EMP004',
    name: 'Phạm Hồng Giang',
    location: 'Quận 1',
    role: 'Nhân viên giao/nhận',
    transactions: 298,
    satisfaction: 4.5,
    status: 'active',
  },
  {
    id: 'EMP005',
    name: 'Lý Thái Bình',
    location: 'Quận 4',
    role: 'Kỹ thuật viên',
    transactions: 142,
    satisfaction: 4.7,
    status: 'inactive',
  },
];

export function EmployeeManagement() {
  const topPerformer = employeeData.reduce((prev, current) =>
    prev.transactions > current.transactions ? prev : current
  );

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-foreground'>
          Quản Lý Nhân Viên
        </h2>
        <p className='text-muted-foreground'>
          Theo dõi hiệu suất và hài lòng khách hàng
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Tổng Nhân Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {employeeData.length}
            </div>
          </CardContent>
        </Card>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Đang Làm Việc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-secondary'>
              {employeeData.filter((e) => e.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className='border border-border bg-primary/5'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-primary flex items-center gap-2'>
              <TrendingUp className='w-4 h-4' />
              Nhân Viên Xuất Sắc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold text-primary'>
              {topPerformer.name}
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              {topPerformer.transactions} giao dịch
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-border'>
        <CardHeader>
          <CardTitle>Danh Sách Nhân Viên</CardTitle>
          <CardDescription>
            Hiệu suất giao/nhận và mức độ hài lòng khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='border-border'>
                <TableHead>Tên Nhân Viên</TableHead>
                <TableHead>Vị Trí</TableHead>
                <TableHead>Chức Vụ</TableHead>
                <TableHead>Giao Dịch</TableHead>
                <TableHead className='flex items-center gap-1'>
                  <Star className='w-4 h-4' />
                  Đánh Giá
                </TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow key={employee.id} className='border-border'>
                  <TableCell className='font-semibold'>
                    {employee.name}
                  </TableCell>
                  <TableCell>{employee.location}</TableCell>
                  <TableCell className='text-sm'>{employee.role}</TableCell>
                  <TableCell className='font-semibold'>
                    {employee.transactions}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <span className='text-sm font-semibold text-primary'>
                        {employee.satisfaction}
                      </span>
                      <Star className='w-4 h-4 fill-accent text-accent' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === 'active' ? 'default' : 'outline'
                      }
                    >
                      {employee.status === 'active' ? 'Hoạt Động' : 'Ngừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant='ghost' size='sm'>
                      Xem Chi Tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
