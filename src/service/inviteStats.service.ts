// src/service/inviteStats.service.ts
import api from "@/lib/api";
import { InviteStatsResponse } from "@/types/inviteStats";


export interface GetInviteStatsParams {
  page?: number;
  limit?: number;
  email?: string; 
}

export const getInviteStatsService = async (
  params: GetInviteStatsParams
): Promise<InviteStatsResponse> => {
  const { page = 1, limit = 10, email } = params ?? {};

  // Build params object and only add email if it has a value
  const reqParams: Record<string, string | number> = { page, limit };
  if (email) reqParams.email = email;

  const { data } = await api.get<InviteStatsResponse>("/stats/invite-stats", {
    params: reqParams,
  });
  return data;
};
