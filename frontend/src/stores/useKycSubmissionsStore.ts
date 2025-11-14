import { create } from "zustand";
import { toast } from "sonner";
import { KYC_API } from "@/lib/api/kyc.api";
import { getErrorMessage } from "@/lib/utils/error";
import type { KYCSubmissionsState } from "@/types/kyc";

export const useKycSubmissionsStore = create<KYCSubmissionsState>(
  (set, get) => ({
    submissions: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,

    fetchSubmissions: async (params) => {
      set({ loading: true, error: null });
      try {
        const res = await KYC_API.getSubmissions(params);
        if (res) {
          set({
            submissions: res.data,
            total: res.total,
            page: res.page,
            totalPages: res.totalPages,
            loading: false,
          });
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: any) {
        const errorMessage = getErrorMessage(err, "Lỗi khi lấy danh sách KYC");
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    verifySubmission: async (submissionId, status, note) => {
      try {
        const updated = await KYC_API.verifySubmission(
          submissionId,
          status,
          note
        );
        if (updated) {
          set({
            submissions: get().submissions.map((s) =>
              s.id === submissionId
                ? {
                    ...s,
                    verification_status: status,
                    note: updated.note_staff || note,
                    verified_by_staff_name: updated.verified_by_staff_name,
                  }
                : s
            ),
          });
          toast.success("Cập nhật trạng thái KYC thành công!");
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: any) {
        const errorMessage = getErrorMessage(err, "Lỗi xác thực KYC");
        toast.error(errorMessage);
      }
    },
  })
);
