"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { Lock, LogOut, UserPlus } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/api/admin.api";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "sonner";
import { CronSettingsManager } from "./CronSettingsManager";

export function Settings() {
  const [activeDialog, setActiveDialog] = useState<
    "changePassword" | "createAccount" | null
  >(null);

  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  const currentUserRole = user?.role || "admin";
  const isStaff = currentUserRole === "staff";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleCreateAccountSuccess = (data: any) => {
    console.log("New account created:", data);
    // Handle post-creation logic here
  };

  const handleCreateAccount = async (formData: any) => {
    try {
      let response;
      
      // Nếu là staff, chỉ được tạo tài khoản renter và dùng API register
      if (isStaff) {
        // Đảm bảo role là renter
        if (formData.role !== "renter") {
          toast.error("Nhân viên chỉ được tạo tài khoản cho khách thuê");
          return false;
        }
        response = await authApi.signUp(
          formData.email,
          formData.phone_number,
          formData.password
        );
      } else {
        // Admin có thể tạo tài khoản với bất kỳ role nào
        response = await adminApi.createAccount(
          formData.email,
          formData.phone_number,
          formData.password,
          formData.role,
          formData.station_id || undefined
        );
      }
      
      // Sử dụng message từ backend response
      const message = response?.message || "Tạo tài khoản thành công";
      toast.success(message);
      return true;
    } catch (err: any) {
      // Sử dụng message từ backend response
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Tạo tài khoản thất bại";
      toast.error(message);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Cài Đặt</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý tài khoản và bảo mật của bạn
            </p>
          </div>

          {/* Settings Cards */}
          <div className="space-y-4">
            {/* Cron Job Settings Card */}
            <CronSettingsManager />
            
            {/* Change Password Card */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Đổi Mật Khẩu</CardTitle>
                      <CardDescription>
                        Cập nhật mật khẩu để bảo vệ tài khoản
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveDialog("changePassword")}
                    variant="outline"
                    size="sm"
                  >
                    Đổi Mật Khẩu
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Create Account Card */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Tạo Tài Khoản</CardTitle>
                      <CardDescription>
                        Tạo một tài khoản mới trong hệ thống
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveDialog("createAccount")}
                    variant="outline"
                    size="sm"
                  >
                    Tạo Tài Khoản
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Logout Card */}
            <Card className="border border-destructive/30 hover:border-destructive/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <LogOut className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Đăng Xuất</CardTitle>
                      <CardDescription>
                        Đăng xuất khỏi tài khoản hiện tại
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="text-white"
                    size="sm"
                  >
                    Đăng Xuất
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={activeDialog === "changePassword"}
        onOpenChange={(open) => {
          setActiveDialog(open ? "changePassword" : null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi Mật Khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu cũ và mật khẩu mới để cập nhật
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm onClose={() => setActiveDialog(null)} />
        </DialogContent>
      </Dialog>

      {/* Create Account Dialog */}
      <Dialog
        open={activeDialog === "createAccount"}
        onOpenChange={(open) => {
          setActiveDialog(open ? "createAccount" : null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo Tài Khoản Mới</DialogTitle>
            <DialogDescription>
              Điền các thông tin bên dưới để tạo tài khoản mới
            </DialogDescription>
          </DialogHeader>
          <CreateAccountForm
            onClose={() => setActiveDialog(null)}
            onSuccess={handleCreateAccountSuccess}
            onSubmit={handleCreateAccount}
            userRole={currentUserRole}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

