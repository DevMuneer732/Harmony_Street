// src/types/inviteStats.ts

/** Represents a single invite record */
export interface InviteStatsItem {
  _id: string;
  type: string;                    // e.g., "email", "bulk", etc.
  recipients: string[];            // emails invited
  count: number;                   // number of recipients
  sentBy: string;                  // user/admin who sent
  createdAt: string;               // ISO date string
}

/** Pagination details returned by the API */
export interface InviteStatsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** API response shape for fetching invite stats */
export interface InviteStatsResponse {
  data: InviteStatsItem[];
  pagination: InviteStatsPagination;
  message?: string;
  success?: boolean;
}
