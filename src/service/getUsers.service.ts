import api from "@/lib/api";
import { User } from "@/types/auth";

export type UsersResponse = {
  success?: boolean;
  status?: string;
  res?: string;
  message?: string;
  data: User[];
};

// Normalize various envelope styles into UsersResponse
const normalize = (payload: any): UsersResponse => {
  if (Array.isArray(payload)) {
    return { success: true, data: payload };
  }
  if (payload && Array.isArray(payload.data)) {
    return {
      success:
        payload.success === true ||
        payload.status === "success" ||
        payload.res === "success" ||
        payload.ok === true,
      status: payload.status,
      res: payload.res,
      message: payload.message,
      data: payload.data,
    };
  }
  // Unexpected shape
  return {
    success: false,
    message: "Unexpected response shape from /auth/users",
    data: [],
  };
};

export const getUsersService = async (): Promise<UsersResponse> => {
  try {
    // token/header already handled by api interceptor
    const { data } = await api.get<any>("/auth/users");
    return normalize(data);
  } catch (error: any) {
    // Let the store decide how to display this
    throw error;
  }
};
