import { axiosClient } from "../axios";

export const authApi = {
	signUp: async (email: string, phone_number: string, password: string) => {
		const res = await axiosClient.post(
			"/auth/register",
			{ email, phone_number, password },
			{ withCredentials: true }
		);

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
