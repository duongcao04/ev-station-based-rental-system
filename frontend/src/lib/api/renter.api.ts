import { axiosClient, type ApiResponse } from "../axios";
import type { User } from "@/types/user";

export const renterApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const res = await axiosClient.get("/v1/renters/me");
      const data = res.data;

      if (!data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      const profileData = data.dataValues || data;
      
      const userData = profileData.user?.dataValues || profileData.user;
      
      if (!userData) {
        console.error("Response không có user object:", profileData);
        throw new Error("Cấu trúc dữ liệu không hợp lệ: thiếu thông tin user");
      }

      const mappedUser: User = {
        _id: profileData.id || profileData._id,
        displayName: profileData.full_name || "",
        email: userData.email || "",
        phoneNumber: userData.phone_number || "",
        role: userData.role || "renter",
        driverlicenseUrl: profileData.driver_license_url,
        nationalidUrl: profileData.national_id_url,
        verificationStatus: profileData.verification_status,
        verifiedStaffId: profileData.verified_by_staff_id,
        note: profileData.note,
        isRisky: profileData.is_risky,
        createdAt: profileData.created_at,
        updatedAt: profileData.updated_at,
      };

      return {
        success: true,
        message: "Lấy thông tin thành công",
        result: mappedUser,
      };
    } catch (error: any) {
      console.error("Error in getProfile:", error);
      throw error;
    }
  },

  updateProfile: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const res = await axiosClient.patch(`/v1/renters/me/${id}`, {
      full_name: data.displayName,
      email: data.email,
      phone_number: data.phoneNumber,
    });

    const d = res.data?.result || res.data;
    
    if (!d.user) {
      return renterApi.getProfile();
    }

    const mappedUser: User = {
      _id: d.id || id,
      displayName: d.full_name || data.displayName || "",
      email: d.user?.email || data.email || "",
      phoneNumber: d.user?.phone_number || data.phoneNumber || "",
      role: d.user?.role || "renter",
      driverlicenseUrl: d.driver_license_url,
      nationalidUrl: d.national_id_url,
      verificationStatus: d.verification_status,
      verifiedStaffId: d.verified_by_staff_id,
      note: d.note,
      isRisky: d.is_risky,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    };

    return {
      success: true,
      message: res.data?.message || "Cập nhật thông tin thành công",
      result: mappedUser,
    };
  },
};
