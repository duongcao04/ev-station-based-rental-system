import { axiosClient } from "../axios";

export const authApi = {
	// Token được lưu trong HTTP-only cookie bởi backend
	// Browser tự động gửi cookie với withCredentials: true (đã set ở axiosClient)
	signUp: async (email: string, phone_number: string, password: string) => {
		const res = await axiosClient.post(
			"/v1/auth/register",
			{ email, phone_number, password }
		);
		return res.data;
	},

	signIn: async (username: string, password: string) => {
		const res = await axiosClient.post(
			"/v1/auth/login",
			{ username, password }
		);
		// Backend set HTTP-only cookie, không cần trả về token trong response
		const accessToken = res.data?.accessToken;
		return { accessToken };
	},

	signOut: async () => {
		return axiosClient.post("/v1/auth/logout", {});
	},

	fetchMe: async () => {
		const res = await axiosClient.get("/v1/renters/me");
		return res.data;
	},

	refresh: async () => {
		const res = await axiosClient.post("/v1/auth/refresh", {});
		return res.data.accessToken;
	},
};
