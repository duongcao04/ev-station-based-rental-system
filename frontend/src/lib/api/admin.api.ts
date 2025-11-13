import { axiosClient } from "../axios";

type AdminUsersParams = {
  page?: number;
  limit?: number;
  role?: string;
  q?: string;
};

export const adminApi = {
  createAccount: async (
    email: string,
    phone_number: string,
    password: string,
    role: string
  ) => {
    const res = await axiosClient.post("/v1/admin/create-account", {
      email,
      phone_number,
      password,
      role,
    });
    return res.data;
  },

  getUsers: async (params?: AdminUsersParams) => {
    const res = await axiosClient.get("/v1/admin/users", {
      params,
    });
    return res.data;
  },

  updateUser: async (id: number, data: any) => {
    const res = await axiosClient.patch(`/v1/admin/users/${id}`, data);
    return res.data;
  },
};
