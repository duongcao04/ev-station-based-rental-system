import { axiosClient, type ApiResponse } from "@/lib/axios";
import type {
  KYCStatus,
  KYCSubmissionsResponse,
  KYCVerifySubmissionResponse,
} from "@/types/kyc";

export interface KYCProfile {
  driver_license_url?: string;
  national_id_url?: string;
  verification_status?: KYCStatus;
  verified_by_staff_id?: string;
  verified_by_staff_name?: string | null;
  note?: string;
  updated_at?: string;
}

export const KYC_API = {
  // Upload file KYC
  uploadKYC: async (files: { driver_license?: File; national_id?: File }) => {
    const formData = new FormData();
    if (files.driver_license)
      formData.append("driver_license", files.driver_license);
    if (files.national_id) formData.append("national_id", files.national_id);

    const res = await axiosClient.post<ApiResponse<KYCProfile>>(
      "/v1/kyc/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.result;
  },

  // Get current user KYC status
  getKYCStatus: async () => {
    const res = await axiosClient.get<ApiResponse<KYCProfile>>("/v1/kyc/me");
    return res.data.result;
  },

  // Admin/Staff: get all submissions
  getSubmissions: async (params?: {
    status?: string;
    page?: number;
    q?: string;
  }): Promise<KYCSubmissionsResponse> => {
    const res = await axiosClient.get<ApiResponse<KYCSubmissionsResponse>>(
      "/v1/kyc/submissions",
      { params }
    );
    if (!res.data?.result) {
      throw new Error("Invalid response from server");
    }
    return res.data.result;
  },

  // Admin/Staff: verify submission
  verifySubmission: async (
    submissionId: string,
    status: "verified" | "rejected",
    note?: string
  ): Promise<KYCVerifySubmissionResponse> => {
    const res = await axiosClient.put<ApiResponse<KYCVerifySubmissionResponse>>(
      `/v1/kyc/verify/${submissionId}`,
      { status, note_staff: note }
    );
    if (!res.data?.result) {
      throw new Error("Invalid response from server");
    }
    return res.data.result;
  },
};
