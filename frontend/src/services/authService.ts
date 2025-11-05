import api from "@/lib/axios";

export const authService = {
  signUp: async (email: string, phone_number: string, password: string) => {
    const res = await api.post(
      "/auth/register",
      { email, phone_number, password },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/login",
      { username, password },
      { withCredentials: true }
    );

    const accessToken = res.data?.accessToken;
    return { accessToken };
  },

  signOut: async () => {
    return api.post("/auth/logout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/renters/me", { withCredentials: true });

    return res.data;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });

    return res.data.accessToken;
  },
};
