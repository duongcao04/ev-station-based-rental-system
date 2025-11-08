'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Car, CreditCard } from 'lucide-react';

interface RentalDetailsProps {
  rental?: any;
}

export function LichSuThueXeChiTietPage({
  rental = {
    id: 1,
    user_id: 101,
    vehicle_id: 201,
    payment_id: 301,
    start_station_id: 401,
    end_station_id: 402,
    start_date: '2025-11-01T08:00:00Z',
    end_date: '2025-11-01T10:30:00Z',
    total_amount: 150.75,
    calculated_price_details: '{"base":100,"time_fee":30.75,"tax":20}',
    deposit_amount: 50,
    status: 'completed',
  },
}: RentalDetailsProps) {
  return (
    <div>
      <h2 className='text-2xl font-bold'>Chi tiết hóa đơn #hard_code</h2>
      <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <User className='w-4 h-4' />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Mã khách hàng</p>
              <p className='font-semibold'>KH#{rental.user_id}</p>
            </div>
            <Separator />
            <div>
              <p className='text-sm text-muted-foreground'>Họ và tên</p>
              <p className='font-semibold'>Nguyễn Văn A</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Số điện thoại</p>
              <p className='font-semibold'>0912 345 678</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Email</p>
              <p className='font-semibold'>customer@example.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <Car className='w-4 h-4' />
              Thông tin xe
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Mã xe</p>
              <p className='font-semibold'>XE#{rental.vehicle_id}</p>
            </div>
            <Separator />
            <div>
              <p className='text-sm text-muted-foreground'>Biển số</p>
              <p className='font-semibold'>29-A-12345</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Loại xe</p>
              <p className='font-semibold'>Toyota Vios 2023</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Tình trạng xe</p>
              <Badge variant='outline'>Tốt</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <CreditCard className='w-4 h-4' />
              Thông tin thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Mã thanh toán</p>
                <p className='font-semibold'>TT#{rental.payment_id}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Phương thức</p>
                <p className='font-semibold'>Thẻ tín dụng</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Chi tiết giá</p>
                <p className='font-semibold text-sm'>
                  {rental.calculated_price_details}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Trạng thái</p>
                <Badge variant='default'>Đã thanh toán</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
