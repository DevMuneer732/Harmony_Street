import axios from "axios";
import { ApiResponse, SignInData } from "@/types/auth";

const TOKEN_KEY =
  process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY || "hsma-access-token";

export const authService = {
  // 🔹 Sign In
  signIn: async (data: SignInData): Promise<ApiResponse> => {
    try {
      const result = await axios.post(
        "http://209.105.243.7:1011/v1/api/auth/signin",
        data
      );

      if (result.data?.token) {
        localStorage.setItem(TOKEN_KEY, result.data.token);
      }

      return result.data;
    } catch (error: any) {
      console.error("Sign-in error:", error);
      throw error;
    }
  },

  // 🔹 Token helpers
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
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
