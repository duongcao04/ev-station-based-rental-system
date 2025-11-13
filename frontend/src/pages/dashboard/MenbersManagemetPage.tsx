"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RenterList } from "./components/members/RenterList";
import { StaffList } from "./components/members/StaffList";
import { AdminList } from "./components/members/AdminList";
import { EditModal } from "./components/members/EditModal";

export default function MembersManagementPage() {
  const [activeTab, setActiveTab] = useState("tenants");
  const [editingUser, setEditingUser] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Thành Viên</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý khách thuê, nhân viên và quản trị viên
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Danh Sách Thành Viên</CardTitle>
          <CardDescription>
            Xem và quản lý thông tin các thành viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="tenants">Khách Thuê</TabsTrigger>
              <TabsTrigger value="staff">Nhân Viên</TabsTrigger>
              <TabsTrigger value="admin">Quản Trị</TabsTrigger>
            </TabsList>

            <TabsContent value="tenants" className="mt-6">
              <RenterList onEdit={setEditingUser} />
            </TabsContent>
            <TabsContent value="staff" className="mt-6">
              <StaffList onEdit={setEditingUser} />
            </TabsContent>
            <TabsContent value="admin" className="mt-6">
              <AdminList onEdit={setEditingUser} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {editingUser && (
        <EditModal
          user={editingUser}
          userType={activeTab}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
