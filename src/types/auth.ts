// -------------------------------
// Generic API Response Types
// -------------------------------
export interface ApiResponse {
  /** Indicates operation success */
  success: boolean;

  /** Human-readable message from API */
  message?: string;

  /** Alternate response fields used by some APIs */
  res?: string; // e.g., "success" | "error"
  msg?: string; // e.g., "Login successful" | "Invalid credentials"

  /** Optional HTTP-style status indicator */
  status?: string; // e.g., "success" | "fail"

  /** Optional JWT or session token */
  token?: string | null;

  /** Data payload from server */
  data: any;

  /** Optional pagination meta */
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// -------------------------------
// Auth-related Request Types
// -------------------------------
export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  interested?: {
    type: "job" | "project";
    experienceYears: string;
    expected: {
      amount: string;
    };
  };
}

// -------------------------------
// User Type (Returned from API)
// -------------------------------
export interface User {
  _id: string;
  id?: string;

  // Identity Info
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;

  // Company / Branding
  companyName?: string;
  brandName?: string;

  // Address
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string | number;

  // Profile
  profileImage?: string;
  twoFactorEnabled?: boolean;
  isBanned?: boolean;

  // Role / Permissions
  role?: "superadmin" | "admin" | "moderator" | "user";
  status?: "active" | "inactive" | "suspended";

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

// -------------------------------
// Auth Response (Sign-In Success)
// -------------------------------
export interface AuthResponse extends ApiResponse {
  data: {
    token: string;
    user: User;
  };
}
