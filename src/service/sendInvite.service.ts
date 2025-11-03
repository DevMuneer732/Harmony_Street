// sendInvite.service.ts
import api from "@/lib/api";
import type { SendInvitePayload, SendInviteResponse } from "@/types/invite";

/** Normalize various success/message shapes into one */
const normalize = (p: any): SendInviteResponse => {
  const success =
    p?.success === true || p?.status === "success" || p?.res === "success";

  return {
    res: p?.res ?? (success ? "success" : "error"),
    status: p?.status,
    success,
    msg: p?.msg,
    message: p?.message,
    data: p?.data,
  };
};

/**
 * POST /auth/send-app-links
 * body: { recipients: string[] }
 */
export const sendInviteService = async (
  payload: SendInvitePayload
): Promise<SendInviteResponse> => {
  const { data } = await api.post<any>("/auth/send-app-links", payload);
  return normalize(data);
};
