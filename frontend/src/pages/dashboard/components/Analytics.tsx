'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

const revenueByLocation = [
  { location: 'Quận 1', revenue: 12500000, target: 15000000 },
  { location: 'Quận 2', revenue: 8900000, target: 10000000 },
  { location: 'Quận 3', revenue: 15200000, target: 14000000 },
  { location: 'Quận 4', revenue: 6800000, target: 8000000 },
];

const peakHours = [
  { hour: '6h', bookings: 12, utilization: 45 },
  { hour: '8h', bookings: 45, utilization: 78 },
  { hour: '10h', bookings: 38, utilization: 72 },
  { hour: '12h', bookings: 52, utilization: 85 },
  { hour: '14h', bookings: 48, utilization: 82 },
  { hour: '16h', bookings: 65, utilization: 91 },
  { hour: '18h', bookings: 58, utilization: 88 },
  { hour: '20h', bookings: 35, utilization: 68 },
];

const demandForecast = [
  { month: 'T1', current: 2400, forecast: 2200, ai_recommended: 2600 },
  { month: 'T2', current: 1398, forecast: 2100, ai_recommended: 2400 },
  { month: 'T3', current: 9800, forecast: 3500, ai_recommended: 4100 },
  { month: 'T4', current: 3908, forecast: 4200, ai_recommended: 4600 },
  { month: 'T5', current: 4800, forecast: 5100, ai_recommended: 5800 },
  { month: 'T6', current: 3800, forecast: 5800, ai_recommended: 6200 },
];

export function Analytics() {
  const totalRevenue = revenueByLocation.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const avgUtilization = Math.round(
    peakHours.reduce((sum, hour) => sum + hour.utilization, 0) /
      peakHours.length
  );

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-foreground'>
          Báo Cáo & Phân Tích
        </h2>
        <p className='text-muted-foreground'>
          Doanh thu, tỷ lệ sử dụng và dự báo nhu cầu AI
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Tổng Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              ₫{(totalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className='text-xs text-green-600 mt-2 flex items-center gap-1'>
              <TrendingUp className='w-4 h-4' />
              +18% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card className='border border-border'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Tỷ Lệ Sử Dụng Trung Bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {avgUtilization}%
            </div>
            <p className='text-xs text-muted-foreground mt-2'>Toàn bộ đội xe</p>
          </CardContent>
        </Card>
        <Card className='border border-border bg-accent/5'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-accent flex items-center gap-2'>
              <Zap className='w-4 h-4' />
              Đề Xuất AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm font-semibold text-accent'>
              Nâng cấp 8 xe
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              Để đáp ứng nhu cầu mùa cao điểm
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-border'>
        <CardHeader>
          <CardTitle>Doanh Thu Theo Địa Điểm</CardTitle>
          <CardDescription>So sánh với mục tiêu</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={revenueByLocation}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='var(--color-border)'
              />
              <XAxis
                dataKey='location'
                stroke='var(--color-muted-foreground)'
              />
              <YAxis stroke='var(--color-muted-foreground)' />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                formatter={(value) =>
                  `₫${((value as number) / 1000000).toFixed(1)}M`
                }
              />
              <Legend />
              <Bar
                dataKey='revenue'
                fill='var(--color-primary)'
                name='Doanh Thu Thực Tế'
              />
              <Bar dataKey='target' fill='var(--color-muted)' name='Mục Tiêu' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='border border-border'>
        <CardHeader>
          <CardTitle>Giờ Cao Điểm & Tỷ Lệ Sử Dụng</CardTitle>
          <CardDescription>Phân tích theo giờ trong ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={peakHours}>
              <defs>
                <linearGradient
                  id='colorUtilization'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor='var(--color-primary)'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-primary)'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='var(--color-border)'
              />
              <XAxis dataKey='hour' stroke='var(--color-muted-foreground)' />
              <YAxis stroke='var(--color-muted-foreground)' />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Area
                type='monotone'
                dataKey='utilization'
                stroke='var(--color-primary)'
                fillOpacity={1}
                fill='url(#colorUtilization)'
                name='Tỷ Lệ Sử Dụng (%)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='border border-border bg-primary/5'>
        <CardHeader>
          <CardTitle className='text-primary flex items-center gap-2'>
            <Zap className='w-5 h-5' />
            Dự Báo Nhu Cầu Từ AI
          </CardTitle>
          <CardDescription>
            Gợi ý nâng cấp đội xe dựa trên dự báo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={demandForecast}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='var(--color-border)'
              />
              <XAxis dataKey='month' stroke='var(--color-muted-foreground)' />
              <YAxis stroke='var(--color-muted-foreground)' />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='current'
                stroke='var(--color-secondary)'
                name='Nhu Cầu Hiện Tại'
              />
              <Line
                type='monotone'
                dataKey='forecast'
                stroke='var(--color-primary)'
                name='Dự Báo'
                strokeDasharray='5 5'
              />
              <Line
                type='monotone'
                dataKey='ai_recommended'
                stroke='var(--color-accent)'
                name='Đề Xuất AI'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
