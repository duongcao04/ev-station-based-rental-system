import { axiosClient } from "../axios";

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
};
