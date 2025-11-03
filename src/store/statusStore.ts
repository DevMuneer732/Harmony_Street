// store/statusStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { setUserBannedService } from "@/service/status.service";
import type { StatusUser, StatusResponse } from "@/types/status";

interface StatusState {
  isLoading: boolean;
  error: string | null;
  lastUser: StatusUser | null;
  lastMessage: string | null;
  /** Set ban status explicitly */
  setUserBanned: (userId: string, isBanned: boolean) => Promise<boolean>;
  clear: () => void;
}

const ok = (r?: StatusResponse) =>
  r?.success === true || r?.res === "success" || r?.status === "success";

const useStatusStore = create<StatusState>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      lastUser: null,
      lastMessage: null,

      setUserBanned: async (userId, isBanned) => {
        set({ isLoading: true, error: null });
        try {
          const res = await setUserBannedService(userId, isBanned);
          if (ok(res)) {
            const msg = res.msg || res.message || "Status updated";
            set({ isLoading: false, lastUser: res.data ?? null, lastMessage: msg });
            toast.success(msg);
            return true;
          }
          const msg = res?.msg || res?.message || "Failed to update status";
          set({ isLoading: false, error: msg });
          toast.error(msg);
          return false;
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Failed to update status";
          set({ isLoading: false, error: msg });
          toast.error(msg);
          return false;
        }
      },

      clear: () => set({ error: null, lastUser: null, lastMessage: null }),
    }),
    { name: "status-storage", storage: createJSONStorage(() => localStorage) }
  )
);

export default useStatusStore;
