import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { authApi } from "@/lib/api/auth.api";
import { getErrorMessage } from "@/lib/utils/error";

let queryClient: any = null;
export const setQueryClient = (client: any) => {
  queryClient = client;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (email, phone_number, password) => {
    try {
      set({ loading: true });

      //call api
      const res = await authApi.signUp(email, phone_number, password);

      toast.success(res?.message || "Đăng ký thành công");
      return true;
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error, "Đăng ký thất bại");
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });
      //call api

      const data = await authApi.signIn(
        username,
        password
      );

      const accessToken = data?.accessToken ?? null;
      const message = data?.message;
      if (accessToken) {
        get().setAccessToken(accessToken);
      }
      await new Promise((resolve) => setTimeout(resolve, 0));

      await get().fetchMe();

      toast.success(message || "Đăng nhập thành công");
      return true;
    } catch (error) {
      console.error(error);

      const message = getErrorMessage(error, "Đăng nhập thất bại");

      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      const res = await authApi.signOut();
      
      // Invalidate React Query cache để cập nhật UI
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
      }
      
      toast.success(res?.message || "Đăng xuất thành công");
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error, "Đăng xuất thất bại");
      toast.error(message);
      
      // Vẫn invalidate cache ngay cả khi có lỗi
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
      }
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authApi.fetchMe();

      const userData = { ...user, _id: user._id || user.id || user.user_id };
      set({ user: userData });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy dữ liệu người dùng. Thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authApi.refresh();
      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
  changePassword: async (userId, oldPassword, newPassword, confirmPassword) => {
    try {
      set({ loading: true });
      const res = await authApi.changePassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword
      );
      toast.success(res.message || "Đổi mật khẩu thành công");
      return true;
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error, "Đổi mật khẩu thất bại");
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
