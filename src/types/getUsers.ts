// src/types/getUsers.ts
import type { User } from "@/types/auth";

/**
 * Generic API envelope used by your backend.
 * Adjust the union values if your API uses different strings.
 */
export type ApiEnvelope<T> = {
  success?: boolean;               
  status?: "success" | "error";   
  res?: "success" | "error";        
  message?: string;                  
  data: T;                         
};

/** Response shape for GET /auth/users */
export type GetUsersResponse = ApiEnvelope<User[]>;

/** Zustand store slice for users */
export interface UsersStoreState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

/** Store action signatures */
export type FetchUsers = () => Promise<boolean>;
export type ClearUsers = () => void;
