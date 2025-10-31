export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
export interface ApiResponse {
  success: boolean;
  message: string;
  html?: string;
  subject?: string;
  data: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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
  interested: {
    type: "job" | "project";
    experienceYears: string;
    expected: {
      amount: string;
    };
  };
}

export interface User {
  id: string;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  hasLocalPassword: boolean;
  role: "superadmin" | "admin" | "moderator";
  status: "active" | "inactive" | "suspended";
  activePlan: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  loginHistory?: string[];
  lastLogin?: string;
  gmail: any;
  credit?: Record<string, any>;
  isVerified?: boolean;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}