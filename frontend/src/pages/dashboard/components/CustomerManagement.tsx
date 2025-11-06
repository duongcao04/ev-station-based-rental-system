"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, MessageSquare } from "lucide-react"

const customerData = [
  {
    id: "CUST001",
    name: "Nguyễn Văn A",
    email: "nguyena@email.com",
    phone: "0912345678",
    rentals: 12,
    status: "regular",
    risk: "low",
  },
  {
    id: "CUST002",
    name: "Trần Thị B",
    email: "tranb@email.com",
    phone: "0987654321",
    rentals: 8,
    status: "vip",
    risk: "low",
  },
  {
    id: "CUST003",
    name: "Lê Văn C",
    email: "levan@email.com",
    phone: "0923456789",
    rentals: 3,
    status: "regular",
    risk: "high",
  },
  {
    id: "CUST004",
    name: "Phạm Thị D",
    email: "phamd@email.com",
    phone: "0934567890",
    rentals: 15,
    status: "vip",
    risk: "low",
  },
  {
    id: "CUST005",
    name: "Hoàng Văn E",
    email: "hoange@email.com",
    phone: "0945678901",
    rentals: 2,
    status: "regular",
    risk: "medium",
  },
]

const riskConfig = {
  low: { label: "Thấp", color: "bg-green-100 text-green-800" },
  medium: { label: "Trung Bình", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "Cao", color: "bg-red-100 text-red-800" },
}

export function CustomerManagement() {
  const riskCustomers = customerData.filter((c) => c.risk !== "low")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Quản Lý Khách Hàng</h2>
        <p className="text-muted-foreground">Hồ sơ khách hàng, lịch sử thuê và xử lý khiếu nại</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Khách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Khách VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">156</div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Khách Rủi Ro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{riskCustomers.length}</div>
          </CardContent>
        </Card>
      </div>

      {riskCustomers.length > 0 && (
        <Card className="border-2 border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Khách Hàng Có Rủi Ro
            </CardTitle>
            <CardDescription>Những khách thường vi phạm hoặc gây hư hỏng</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Tên Khách</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số Lần Thuê</TableHead>
                  <TableHead>Mức Độ Rủi Ro</TableHead>
                  <TableHead>Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-border">
                    <TableCell className="font-semibold">{customer.name}</TableCell>
                    <TableCell className="text-sm">{customer.email}</TableCell>
                    <TableCell>{customer.rentals}</TableCell>
                    <TableCell>
                      <Badge className={riskConfig[customer.risk as keyof typeof riskConfig].color}>
                        {riskConfig[customer.risk as keyof typeof riskConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Tất Cả Khách Hàng</CardTitle>
          <CardDescription>Danh sách và lịch sử thuê</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Tên Khách</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Điện Thoại</TableHead>
                <TableHead>Số Lần Thuê</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Rủi Ro</TableHead>
                <TableHead>Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer) => (
                <TableRow key={customer.id} className="border-border">
                  <TableCell className="font-semibold">{customer.name}</TableCell>
                  <TableCell className="text-sm">{customer.email}</TableCell>
                  <TableCell className="text-sm">{customer.phone}</TableCell>
                  <TableCell>{customer.rentals}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "vip" ? "secondary" : "outline"}>
                      {customer.status === "vip" ? "VIP" : "Thường"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={riskConfig[customer.risk as keyof typeof riskConfig].color}>
                      {riskConfig[customer.risk as keyof typeof riskConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
