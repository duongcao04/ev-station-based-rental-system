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

export function Settings() {
  const [activeDialog, setActiveDialog] = useState<
    "changePassword" | "createAccount" | null
  >(null);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out");
    // You can redirect to login page or clear session
  };

  const handleCreateAccountSuccess = (data: any) => {
    console.log("New account created:", data);
    // Handle post-creation logic here
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
