// src/store/inviteStats.store.ts
import { create } from "zustand";
import { getInviteStatsService } from "@/service/inviteStats.service";
import { InviteStatsItem, InviteStatsPagination } from "@/types/inviteStats";


type State = {
  items: InviteStatsItem[];
  pagination: InviteStatsPagination | null;
  isLoading: boolean;
  error: string | null;

  page: number;
  limit: number;
  email: string;

  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  setEmail: (e: string) => void;

  fetch: (overrides?: Partial<{ page: number; limit: number; email: string }>) => Promise<void>;
};

const useInviteStatsStore = create<State>((set, get) => ({
  items: [],
  pagination: null,
  isLoading: false,
  error: null,

  page: 1,
  limit: 10,
  email: "",

  setPage: (p) => set({ page: p }),
  setLimit: (l) => set({ limit: l }),
  setEmail: (e) => set({ email: e }),

  fetch: async (overrides = {}) => {
    const { page, limit, email } = { page: get().page, limit: get().limit, email: get().email, ...overrides };
    set({ isLoading: true, error: null });

    try {
      const res = await getInviteStatsService({ page, limit, email });
      set({
        items: res.data ?? [],
        pagination: res.pagination ?? null,
        page,
        limit,
        email: email ?? "",
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err?.response?.data?.message || err?.message || "Failed to load invite stats" });
    }
  },
}));

export default useInviteStatsStore;
