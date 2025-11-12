import { axiosClient } from "../axios";

export const authApi = {
  getProfile: async () => {
    const res = await axiosClient.get("/v1/auth/profile");
    return res.data;
  },

  // Token được lưu trong HTTP-only cookie bởi backend
  // Browser tự động gửi cookie với withCredentials: true (đã set ở axiosClient)
  signUp: async (email: string, phone_number: string, password: string) => {
    const res = await axiosClient.post("/v1/auth/register", {
      email,
      phone_number,
      password,
    });
    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await axiosClient.post("/v1/auth/login", {
      username,
      password,
    });
    // Backend set HTTP-only cookie, không cần trả về token trong response
    const accessToken = res.data?.accessToken;
    const role = res.data?.role;
    const user_id = res.data?.user_id;
    const email = res.data?.email;
    const station_id = res.data?.station_id;
    const user = {
      id: user_id,
      email: email,
      role: role,
      station_id: station_id,
      phone_number: "",
    };
    return { accessToken, role, user };
  },

  signOut: async () => {
    return axiosClient.post("/v1/auth/logout", {});
  },

  fetchMe: async () => {
    const profileRes = await axiosClient.get("/v1/auth/profile", {
      withCredentials: true,
    });
    const baseProfile = profileRes.data;

    if (!baseProfile?.id) {
      throw new Error("Không thể lấy thông tin người dùng");
    }

    const normalizedProfile = {
      ...baseProfile,
      _id: baseProfile.id,
      user_id: baseProfile.id,
    };

    if (baseProfile.role === "renter") {
      try {
        const renterRes = await axiosClient.get("/v1/renters/me", {
          withCredentials: true,
        });
        return {
          ...renterRes.data,
          ...normalizedProfile,
          role: "renter",
        };
      } catch (error) {
        console.warn("Không thể lấy thông tin renter chi tiết:", error);
        return normalizedProfile;
      }
    }

    return {
      ...normalizedProfile,
      role: baseProfile.role,
    };
  },

  refresh: async () => {
    const res = await axiosClient.post("/v1/auth/refresh", {});
    return res.data.accessToken;
  },

  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const res = await axiosClient.patch(
      `/v1/auth/${userId}/change-password`,
      { oldPassword, newPassword, confirmPassword },
      { withCredentials: true }
    );
    return res.data;
  },
};
