// sendInviteStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { sendInviteService } from "@/service/sendInvite.service";
import type { SendInviteResponse } from "@/types/invite";

interface SendInviteState {
  isLoading: boolean;
  error: string | null;
  lastMessage: string | null;
  lastSuccess: boolean | null;
  sendInvites: (recipients: string[]) => Promise<boolean>;
  clear: () => void;
}

const MAX_INVITES = 10;

const ok = (r?: SendInviteResponse) =>
  r?.success === true || r?.res === "success" || r?.status === "success";

// very light email check (keep client-side friendly)
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);

const useSendInviteStore = create<SendInviteState>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      lastMessage: null,
      lastSuccess: null,

      sendInvites: async (recipients: string[]) => {
        const cleaned = (recipients || [])
          .map((r) => String(r).trim())
          .filter(Boolean);

        if (cleaned.length === 0) {
          const msg = "Please provide at least one recipient email.";
          toast.error(msg);
          set({ error: msg, lastSuccess: false });
          return false;
        }

        if (cleaned.length > MAX_INVITES) {
          const msg = `You can only invite up to ${MAX_INVITES} users at a time.`;
          toast.error(msg);
          set({ error: msg, lastSuccess: false });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const res = await sendInviteService({ recipients: cleaned });

          if (ok(res)) {
            const msg = res.message || res.msg || "Invites sent successfully.";
            set({
              isLoading: false,
              lastMessage: msg,
              lastSuccess: true,
            });
            toast.success(msg);
            return true;
          }

          const msg = res?.message || res?.msg || "Failed to send invites.";
          set({
            isLoading: false,
            error: msg,
            lastMessage: msg,
            lastSuccess: false,
          });
          toast.error(msg);
          return false;
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ||
            e?.response?.data?.msg ||
            e?.message ||
            "Failed to send invites.";
          set({
            isLoading: false,
            error: msg,
            lastMessage: msg,
            lastSuccess: false,
          });
          toast.error(msg);
          return false;
        }
      },

      clear: () => set({ error: null, lastMessage: null, lastSuccess: null }),
    }),
    {
      name: "send-invite-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSendInviteStore;
