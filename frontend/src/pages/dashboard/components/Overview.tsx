"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { AlertCircle, Users, Car, DollarSign } from "lucide-react"

const revenueData = [
  { month: "T1", revenue: 2400, bookings: 240 },
  { month: "T2", revenue: 1398, bookings: 221 },
  { month: "T3", revenue: 9800, bookings: 229 },
  { month: "T4", revenue: 3908, bookings: 200 },
  { month: "T5", revenue: 4800, bookings: 218 },
  { month: "T6", revenue: 3800, bookings: 250 },
]

const utilizationData = [
  { name: "Đang Sử Dụng", value: 72 },
  { name: "Rảnh Rỗi", value: 28 },
]

const locationData = [
  { location: "Quận 1", vehicles: 24, utilization: 85 },
  { location: "Quận 2", vehicles: 18, utilization: 72 },
  { location: "Quận 3", vehicles: 32, utilization: 91 },
  { location: "Quận 4", vehicles: 15, utilization: 68 },
]

const COLORS = ["#3b82f6", "#10b981"]

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              Tổng Xe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground mt-2">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
            <p className="text-xs text-muted-foreground mt-2">+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₫45.8M</div>
            <p className="text-xs text-muted-foreground mt-2">+24% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Khách Rủi Ro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground mt-2">Cần giám sát</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border">
          <CardHeader>
            <CardTitle>Doanh Thu & Đặt Xe</CardTitle>
            <CardDescription>Xu hướng 6 tháng gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-primary)" />
                <Bar dataKey="bookings" fill="var(--color-secondary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Tỷ Lệ Sử Dụng</CardTitle>
            <CardDescription>Tổng quát</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Hiệu Suất Theo Địa Điểm</CardTitle>
          <CardDescription>Số lượng xe và tỷ lệ sử dụng tại mỗi điểm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.map((location) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{location.location}</p>
                  <p className="text-sm text-muted-foreground">{location.vehicles} xe</p>
                </div>
                <div className="flex-1 mx-6">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${location.utilization}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{location.utilization}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
