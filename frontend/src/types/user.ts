export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "staff" | "renter";
  displayName?: string;
  driverlicenseUrl?: string;
  nationalidUrl?: String;
  verificationStatus?: String;
  verifiedStaffId?: String;
  note?: String;
  isRisky?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
