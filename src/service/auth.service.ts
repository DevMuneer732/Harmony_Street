import api from "@/lib/api";
import { ApiResponse, SignInData } from "@/types/auth";

const TOKEN_KEY =
  process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY || "hsma-access-token";

// 🔹 Normalize the API response (handles multiple shapes gracefully)
const normalizeAuthResponse = (payload: any): ApiResponse => {
  if (!payload) {
    return {
      res: "error",
      msg: "Empty response from server.",
      data: null,
         success: false, 
    };
  }

  return {
    res: payload.res ?? (payload.success ? "success" : "error"),
    msg:
      payload.msg ??
      payload.message ??
      (payload.success ? "Success" : "An error occurred."),
    data: payload.data ?? payload.user ?? null,
    token: payload.token ?? null,
    success:
      payload.success === true ||
      payload.status === "success" ||
      payload.res === "success" ||
      !!payload.token,
  };
};

export const authService = {
  // 🔹 Sign In
  signIn: async (credentials: SignInData): Promise<ApiResponse> => {
    try {
      const { data } = await api.post<any>("/auth/signin", credentials);
      const normalized = normalizeAuthResponse(data);

      if (normalized.token) {
        localStorage.setItem(TOKEN_KEY, normalized.token);
      }

      return normalized;
    } catch (error: any) {
      console.error("Sign-in error:", error);
      throw error;
    }
  },

  // 🔹 Token helpers
  getToken: (): string | null => {
    return typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_KEY)
      : null;
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  signOut: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};
