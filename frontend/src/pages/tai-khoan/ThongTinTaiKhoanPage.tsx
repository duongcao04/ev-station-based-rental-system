"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  User as UserIcon,
  Edit2,
  Save,
  Phone,
  CheckCircle,
} from "lucide-react";
import { renterApi } from "@/lib/api/renter.api";
import type { User } from "@/types/user";

export default function ThongTinTaiKhoanPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [tempFullName, setTempFullName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await renterApi.getProfile();

      if (res.result) {
        const data = res.result;
        const displayName =
          data.displayName || (data.email ? data.email.split("@")[0] : "");

        const userData = {
          ...data,
          displayName: displayName,
        };

        setUser(userData);
        setTempFullName(displayName);
        setTempEmail(data.email ?? "");
        setTempPhone(data.phoneNumber ?? "");
      } else {
        console.error("Response không có result:", res);
      }
    } catch (error: any) {
      console.error("Lỗi khi fetch profile:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response,
        data: error?.data,
      });
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!user) return;
    try {
      const res = await renterApi.updateProfile(user._id, {
        displayName: tempFullName,
        email: tempEmail,
        phoneNumber: tempPhone,
      });

      if (res.result) {
        setUser({
          ...user,
          displayName: res.result.displayName,
          email: res.result.email,
          phoneNumber: res.result.phoneNumber,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
    }
  };

  const getKycStatusText = (status?: string) => {
    switch (status) {
      case "verified":
        return "Đã xác thực";
      case "rejected":
        return "KYC bị từ chối";
      case "pending":
      default:
        return "Đang chờ xác thực";
    }
  };

  const getKycStatusStyle = (status?: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
      default:
        return "";
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Đang tải thông tin...</div>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "User";

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "NA";

  return (
    <main className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Thông tin tài khoản
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-0 pt-8 px-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-end gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {displayName}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Chỉnh sửa
                  </>
                )}
              </button>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Họ và tên */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  Họ và tên
                </Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {displayName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {user.email}
                  </div>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {user.phoneNumber}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KYC Card */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader className="pb-4 pt-8 px-8">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Thông tin xác thực
            </h3>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Trạng thái xác thực KYC
                </Label>
                <div
                  className={`px-4 py-2 rounded-md inline-block font-medium ${getKycStatusStyle(
                    user.verificationStatus
                  )}`}
                >
                  {getKycStatusText(user.verificationStatus)}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Xác thực bởi nhân viên
                </Label>
                <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                  {user.verifiedStaffName || user.verifiedStaffId || "-"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Ghi chú xác thực
                </Label>
                <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                  {user.note || "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
