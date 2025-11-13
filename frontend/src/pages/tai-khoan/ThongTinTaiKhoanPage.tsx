"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, User, Edit2, Save, Phone, CheckCircle } from "lucide-react";

export default function ThongTinTaiKhoanPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvan.a@example.com");
  const [phone, setPhone] = useState("0987654321");
  const [tempFullName, setTempFullName] = useState(fullName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);

  type KycStatus = "Đang chờ xác thực" | "Đã xác thực" | "KYC bị từ chối";
  const kycStatus: KycStatus = "Đang chờ xác thực";
  const verifiedBy = "Nguyễn Thị B";
  const verificationNote = "Tài liệu đầy đủ và hợp lệ";

  const handleEdit = () => {
    setTempFullName(fullName);
    setTempEmail(email);
    setTempPhone(phone);
    setIsEditing(true);
  };

  const handleSave = () => {
    setFullName(tempFullName);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getKycStatusStyle = (status: KycStatus) => {
    switch (status) {
      case "Đã xác thực":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "Đang chờ xác thực":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "KYC bị từ chối":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    }
  };

  return (
    <main className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`}
                      alt={fullName}
                    />
                    <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                      {initials || "NA"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name Section */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {email}
                  </p>
                </div>
              </div>

              {/* Action Button */}
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
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Họ và tên
                </Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    type="text"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    className="text-base py-2"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {fullName}
                  </div>
                )}
              </div>

              {/* Email Field */}
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
                    className="text-base py-2"
                    placeholder="Nhập email"
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {email}
                  </div>
                )}
              </div>

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
                    className="text-base py-2"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                    {phone}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
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

        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader className="pb-4 pt-8 px-8">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Thông tin xác thực
            </h3>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* KYC Status */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Trạng thái xác thực KYC
                </Label>
                <div
                  className={`px-4 py-2 rounded-md inline-block font-medium ${getKycStatusStyle(
                    kycStatus
                  )}`}
                >
                  {kycStatus}
                </div>
              </div>

              {/* Verified By */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Xác thực bởi nhân viên
                </Label>
                <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                  {verifiedBy}
                </div>
              </div>

              {/* Verification Note */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Ghi chú xác thực
                </Label>
                <div className="px-4 py-2 rounded-md bg-muted text-foreground">
                  {verificationNote}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 border-0 shadow-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground flex items-start gap-3">
              <span className="text-lg">ℹ️</span>
              <span>
                Thông tin cá nhân của bạn được bảo mật và chỉ được sử dụng để
                cải thiện trải nghiệm người dùng.
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
