export interface RenterProfileResponse {
  id: string;
  full_name: string;
  driver_license_url?: string;
  national_id_url?: string;
  verification_status?: string;
  verified_by_staff_id?: string;
  note?: string;
  is_risky?: boolean;
  created_at?: string;
  updated_at?: string;
  user: {
    email: string;
    phone_number: string;
    role: "admin" | "staff" | "renter";
  };
}
