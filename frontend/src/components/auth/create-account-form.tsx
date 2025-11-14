"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { stationApi } from "@/lib/api/station.api";

interface CreateAccountFormProps {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
  userRole?: string; // Optional prop for user role
  onSubmit?: (data: any) => Promise<boolean>; // Optional submit handler
}

export function CreateAccountForm({
  onClose,
  onSuccess,
  userRole = "admin",
  onSubmit,
}: CreateAccountFormProps) {
  const currentUserRole = userRole;
  const isStaff = currentUserRole === "staff";
  const isAdmin = currentUserRole === "admin";

  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    password: "",
    role: "",
    station_id: "", // added station_id field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<any[]>([]); // added stations state
  const [loadingStations, setLoadingStations] = useState(false); // added loading state for stations

  useEffect(() => {
    if (isStaff) {
      setFormData((prev) => ({ ...prev, role: "renter" }));
    }
  }, [isStaff]);

  useEffect(() => {
    if (formData.role === "staff") {
      fetchStations();
    }
  }, [formData.role]);

  const fetchStations = async () => {
    setLoadingStations(true);
    try {
      const response = await stationApi.getAllStations();
      setStations(response.data || []);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      toast.error("Không thể tải danh sách trạm", {
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingStations(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{9,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate phone number
    if (!formData.phone_number) {
      newErrors.phone_number = "Số điện thoại là bắt buộc";
    } else if (!validatePhoneNumber(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại phải có 9-11 chữ số";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!isStaff && !formData.role) {
      newErrors.role = "Vui lòng chọn một vai trò";
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
      let ok = false;

      // If custom submit handler provided, use it
      if (onSubmit) {
        ok = await onSubmit(formData);
      } else {
        // Default behavior - just show success
        console.log("Form submitted with data:", formData);
        ok = true;
      }

      if (ok) {
        setSuccess(true);
        onSuccess?.(formData);
        setFormData({
          email: "",
          phone_number: "",
          password: "",
          role: isStaff ? "renter" : "",
          station_id: "",
        });
        if (onClose) setTimeout(onClose, 1500);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Tạo tài khoản thất bại");
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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      station_id: "", // reset station_id when role changes
    }));
    if (errors.role) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.role;
        return newErrors;
      });
    }
  };

  const handleStationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      station_id: value === "none" ? "" : value,
    }));
    if (errors.station_id) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.station_id;
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
              Tài khoản mới đã được tạo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Tạo Tài Khoản Mới</CardTitle>
        <CardDescription>
          Nhập thông tin để tạo một tài khoản mới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone_number"
              className="text-sm font-medium text-foreground"
            >
              Số Điện Thoại
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="0123456789"
              value={formData.phone_number}
              onChange={handleChange}
              className={errors.phone_number ? "border-destructive" : ""}
            />
            {errors.phone_number && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Mật Khẩu
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Chỉ hiển thị role selector nếu là admin */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-foreground"
                >
                  Vai Trò
                </label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger
                    className={errors.role ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renter">Khách Thuê</SelectItem>
                    <SelectItem value="staff">Nhân Viên</SelectItem>
                    <SelectItem value="admin">Quản Trị Viên</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.role}
                  </p>
                )}
              </div>

              {(formData.role === "staff" ||
                (isStaff && formData.role === "renter")) && (
                <div className="space-y-2">
                  <label
                    htmlFor="station_id"
                    className="text-sm font-medium text-foreground"
                  >
                    Trạm Làm Việc
                  </label>
                  <Select
                    value={formData.station_id || "none"}
                    onValueChange={handleStationChange}
                    disabled={loadingStations}
                  >
                    <SelectTrigger
                      className={errors.station_id ? "border-destructive" : ""}
                    >
                      <SelectValue
                        placeholder={
                          loadingStations ? "Đang tải..." : "Chọn trạm"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có trạm</SelectItem>
                      {stations.map((station) => (
                        <SelectItem
                          key={station.station_id || station.id}
                          value={station.station_id || station.id}
                        >
                          {station.display_name ||
                            station.station_id ||
                            station.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.station_id && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.station_id}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Staff chỉ có thể tạo tài khoản renter, không cần hiển thị station_id cho renter */}

          {/* Hiển thị thông báo nếu là staff */}
          {isStaff && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Lưu ý:</strong> Bạn đang tạo tài khoản cho{" "}
                <strong>Khách Thuê</strong>. Chỉ có quyền tạo tài khoản khách
                thuê.
              </p>
            </div>
          )}

          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
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
