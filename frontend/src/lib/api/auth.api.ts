import { axiosClient } from "../axios";

export const authApi = {
<<<<<<< Updated upstream
	signUp: async (email: string, phone_number: string, password: string) => {
		const res = await axiosClient.post(
			"/auth/register",
			{ email, phone_number, password },
			{ withCredentials: true }
		);
=======
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
>>>>>>> Stashed changes

		return res.data;
	},

	signIn: async (username: string, password: string) => {
		const res = await axiosClient.post(
			"/auth/login",
			{ username, password },
			{ withCredentials: true }
		);

		const accessToken = res.data?.accessToken;
		return { accessToken };
	},

	signOut: async () => {
		return axiosClient.post("/auth/logout", {}, { withCredentials: true });
	},

	fetchMe: async () => {
		const res = await axiosClient.get("/renters/me", { withCredentials: true });
		return res.data;
	},

	refresh: async () => {
		const res = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });

		return res.data.accessToken;
	},
};
