import { create } from "zustand";
import { toast } from "sonner";
import { type KYCProfile, KYC_API } from "@/lib/api/kyc.api";
import { getErrorMessage } from "@/lib/utils/error";

interface KYCState {
  profile: KYCProfile | null;
  loading: boolean;
  error: string | null;
  fetchKYC: () => Promise<void>;
  uploadKYC: (files: {
    driver_license?: File;
    national_id?: File;
  }) => Promise<void>;
}

export const useKycStore = create<KYCState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchKYC: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await KYC_API.getKYCStatus();
      set({ profile, loading: false });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, "Lỗi khi lấy thông tin KYC");
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  uploadKYC: async (files) => {
    set({ loading: true, error: null });
    try {
      const updatedProfile = await KYC_API.uploadKYC(files);
      set({ profile: updatedProfile, loading: false });
      toast.success("Tải lên giấy tờ thành công! Vui lòng đợi xác thực.");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, "Lỗi khi tải lên giấy tờ");
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));
