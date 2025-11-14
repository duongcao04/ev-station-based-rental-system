export type KYCStatus = "pending" | "verified" | "rejected";

export interface KYCSubmission {
  id: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  driver_license_url?: string;
  national_id_url?: string;
  verification_status?: KYCStatus;
  note?: string;
  verified_by_staff_id?: string;
  verified_by_staff_name?: string | null;
  updated_at?: string;
}

export interface KYCSubmissionsResponse {
  data: KYCSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

export interface KYCVerifySubmissionParams {
  status?: KYCStatus | "";
  page?: number;
  q?: string;
}

export interface KYCVerifySubmissionResponse {
  id: string;
  full_name: string;
  verification_status: KYCStatus;
  note_staff?: string;
  verified_by_staff_id?: string;
  verified_by_staff_name?: string | null;
  updated_at?: string;
}

export interface KYCSubmissionsState {
  submissions: KYCSubmission[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchSubmissions: (params?: KYCVerifySubmissionParams) => Promise<void>;
  verifySubmission: (
    submissionId: string,
    status: "verified" | "rejected",
    note?: string
  ) => Promise<void>;
}
