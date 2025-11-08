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
import { Edit2, Trash2, MapPin } from 'lucide-react';

const fleetData = [
  {
    id: 'CAR001',
    model: 'Toyota Vios',
    location: 'Quận 1',
    status: 'available',
    lastMaintenance: '2024-01-15',
    kmDriven: 45230,
  },
  {
    id: 'CAR002',
    model: 'Honda City',
    location: 'Quận 2',
    status: 'rented',
    lastMaintenance: '2024-02-20',
    kmDriven: 52100,
  },
  {
    id: 'CAR003',
    model: 'Kia Cerato',
    location: 'Quận 3',
    status: 'maintenance',
    lastMaintenance: '2024-01-05',
    kmDriven: 38900,
  },
  {
    id: 'CAR004',
    model: 'Toyota Altis',
    location: 'Quận 1',
    status: 'available',
    lastMaintenance: '2024-02-10',
    kmDriven: 41200,
  },
  {
    id: 'CAR005',
    model: 'Hyundai i10',
    location: 'Quận 4',
    status: 'rented',
    lastMaintenance: '2024-01-25',
    kmDriven: 56780,
  },
];

const statusConfig = {
  available: { label: 'Sẵn Sàng', variant: 'default' as const },
  rented: { label: 'Đã Cho Thuê', variant: 'secondary' as const },
  maintenance: { label: 'Bảo Trì', variant: 'outline' as const },
};

export function FleetManagement() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold text-foreground'>Quản Lý Đội Xe</h2>
          <p className='text-muted-foreground'>
            Theo dõi số lượng xe tại từng điểm và tình trạng bảo trì
          </p>
        </div>
        <Button className='bg-primary text-primary-foreground'>
          + Thêm Xe
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Tổng Xe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>89</div>
          </CardContent>
        </Card>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Đang Sử Dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-secondary'>64</div>
          </CardContent>
        </Card>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Cần Bảo Trì
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-destructive'>5</div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-border'>
        <CardHeader>
          <CardTitle>Danh Sách Xe</CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái các xe trong đội
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='border-border'>
                <TableHead>ID Xe</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className='flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  Địa Điểm
                </TableHead>
                <TableHead>Tình Trạng</TableHead>
                <TableHead>KM Đã Đi</TableHead>
                <TableHead>Bảo Trì Gần Nhất</TableHead>
                <TableHead>Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleetData.map((car) => (
                <TableRow key={car.id} className='border-border'>
                  <TableCell className='font-mono text-sm'>{car.id}</TableCell>
                  <TableCell className='font-semibold'>{car.model}</TableCell>
                  <TableCell>{car.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusConfig[car.status as keyof typeof statusConfig]
                          .variant
                      }
                    >
                      {
                        statusConfig[car.status as keyof typeof statusConfig]
                          .label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>{car.kmDriven.toLocaleString()} km</TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {car.lastMaintenance}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button variant='ghost' size='sm'>
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <Trash2 className='w-4 h-4 text-destructive' />
                      </Button>
                    </div>
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
