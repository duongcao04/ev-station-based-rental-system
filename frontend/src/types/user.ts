export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "staff" | "renter";
  displayName?: string;
  driverlicenseUrl?: string;
  nationalidUrl?: string;
  verificationStatus?: string;
  verifiedStaffId?: string;
  note?: string;
  isRisky?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
