import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

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
      await authService.signUp(email, phone_number, password);

      toast.success("Đăng ký thành công");
      return true;
    } catch (error) {
      console.error(error);
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.msg ||
        "Đăng ký thất bại";
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

      const { accessToken } = await authService.signIn(username, password);

      get().setAccessToken(accessToken);
      await new Promise((resolve) => setTimeout(resolve, 0));

      await get().fetchMe();

      toast.success("Đăng nhập thành công");
      return true;
    } catch (error) {
      console.error(error);

      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.msg ||
        "Đăng nhập thất bại";

      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error(error);
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.msg ||
        "Đăng xuất thất bại";
      toast.error(message);
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi khi lấy dữ liệu người dùng. Thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn vui lòng dadưng nhập lại");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
