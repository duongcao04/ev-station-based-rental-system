import type { adminState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { adminApi } from "@/lib/api/admin.api";
import { getErrorMessage } from "@/lib/utils/error";

export const useAdminStore = create<adminState>((set, get) => ({
  loading: false,

  createAccount: async (email, phone_number, password, role) => {
    try {
      set({ loading: true });
      const res = await adminApi.createAccount(
        email,
        phone_number,
        password,
        role
      );
      toast.success(res.message || "Tạo tài khoản thành công");
      return true;
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error, "Tạo tài khoản thất bại");
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
