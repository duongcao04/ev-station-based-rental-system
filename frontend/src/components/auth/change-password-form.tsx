"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface ChangePasswordFormProps {
  onClose?: () => void;
}

export function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
  const { user, changePassword } = useAuthStore();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if all fields are filled
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Mật khẩu cũ là bắt buộc";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    }

    // Check password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Check if passwords match
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user?._id) {
        setErrors({ submit: "Người dùng chưa đăng nhập" });
        return;
      }

      const ok = await changePassword(
        user?._id,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      if (ok) {
        setSuccess(true);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({});
        if (onClose) setTimeout(onClose, 1500);
      } else {
        setErrors({ submit: "Đổi mật khẩu thất bại. Vui lòng thử lại." });
      }
    } catch {
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (success) {
    return (
      <Card className="border border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Thành công!
            </h3>
            <p className="text-sm text-muted-foreground">
              Mật khẩu của bạn đã được cập nhật
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Đổi Mật Khẩu</CardTitle>
        <CardDescription>
          Cập nhật mật khẩu của bạn để bảo mật tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="oldPassword"
              className="text-sm font-medium text-foreground"
            >
              Mật Khẩu Cũ
            </label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Nhập mật khẩu cũ"
              value={formData.oldPassword}
              onChange={handleChange}
              className={errors.oldPassword ? "border-destructive" : ""}
            />
            {errors.oldPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.oldPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-foreground"
            >
              Mật Khẩu Mới
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? "border-destructive" : ""}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Xác Nhận Mật Khẩu
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
