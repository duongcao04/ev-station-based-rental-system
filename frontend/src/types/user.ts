export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
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
