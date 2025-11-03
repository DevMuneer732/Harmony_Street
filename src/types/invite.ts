// invite.ts

/** Request payload */
export interface SendInvitePayload {
  recipients: string[]; // list of emails
}

/** Raw/normalized response */
export interface SendInviteResponse {
  res?: string;          // some backends use "res": "success"
  status?: string;       // or "status": "success"
  success?: boolean;     // or boolean success
  msg?: string;          // alt message key
  message?: string;      // primary message key
  data?: unknown;        // optional extra
}
