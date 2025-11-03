// status.ts

export interface StatusUser {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: number | string;
  brandName?: string;
  profileImage?: string;
  twoFactorEnabled?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface StatusResponse {
  res?: string;       // "success" | "error"
  status?: string;    // some backends use this instead
  success?: boolean;  // boolean success
  msg?: string;       // message
  message?: string;   // alt message key
  data?: StatusUser;  // user object after toggle
}
