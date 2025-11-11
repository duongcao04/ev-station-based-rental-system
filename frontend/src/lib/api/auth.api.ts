import { axiosClient } from "../axios";

export const authApi = {
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
    try {
      // Thử endpoint renter trước
      const res = await axiosClient.get("/v1/renters/me", {
        withCredentials: true,
      });
      console.log("User is renter");
      return { ...res.data, role: "renter" };
    } catch (renterError) {
      console.log("User is not renter, checking admin/staff...");

      try {
        // Thử endpoint admin
        const adminRes = await axiosClient.get("/v1/admin/users", {
          withCredentials: true,
        });
        console.log("User is admin");
        return { ...adminRes.data, role: "admin" };
      } catch (adminError) {
        try {
          // Thử endpoint staff
          const staffRes = await axiosClient.get("/v1/kyc/submissions", {
            withCredentials: true,
          });
          console.log("User is staff");
          return { ...staffRes.data, role: "staff" };
        } catch (staffError) {
          // Nếu tất cả đều thất bại, ném lỗi
          throw new Error("Cannot fetch user profile from any role endpoint");
        }
      }
    }
  },

  refresh: async () => {
    const res = await axiosClient.post("/v1/auth/refresh", {});
    return res.data.accessToken;
  },
};
