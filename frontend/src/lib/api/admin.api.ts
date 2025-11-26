import { axiosClient } from "../axios";

type AdminUsersParams = {
  page?: number;
  limit?: number;
  role?: string;
  q?: string;
  kycStatus?: string;
};

export const adminApi = {
  createAccount: async (
    email: string,
    phone_number: string,
    password: string,
    role: string,
    station_id?: string
  ) => {
    const payload: any = {
      email,
      phone_number,
      password,
      role,
    };
    if (station_id) {
      payload.station_id = station_id;
    }
    const res = await axiosClient.post("/v1/admin/create-account", payload);
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
  getUser: async (id: string) => {
    const res = await axiosClient.get(`/v1/admin/users/${id}`);
    return res.data;
  },
};
