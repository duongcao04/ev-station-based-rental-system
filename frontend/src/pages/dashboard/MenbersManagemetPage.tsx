"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const savedTab = localStorage.getItem("membersActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("membersActiveTab", tab);
  };

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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
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
          userType={editingUser.type}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
