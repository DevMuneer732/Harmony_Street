// service/status.service.ts
import api from "@/lib/api";
import type { StatusResponse } from "@/types/status";

const normalize = (p: any): StatusResponse => {
  const success =
    p?.success === true || p?.status === "success" || p?.res === "success";
  return {
    res: p?.res ?? (success ? "success" : "error"),
    status: p?.status,
    success,
    msg: p?.msg ?? p?.message,
    message: p?.message,
    data: p?.data,
  };
};

/**
 * Server expects a body like: { isBanned: boolean }
 * e.g. isBanned:true -> Inactive, isBanned:false -> Active
 */
export const setUserBannedService = async (
  userId: string,
  isBanned: boolean
): Promise<StatusResponse> => {
  const { data } = await api.patch<any>(`/auth/suspend/${userId}`, { isBanned });
  return normalize(data);
};
