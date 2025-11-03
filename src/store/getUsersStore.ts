import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { User } from "@/types/auth";
import { getUsersService, UsersResponse } from "@/service/getUsers.service";

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<boolean>;
  clear: () => void;
}

const isOk = (r?: UsersResponse) =>
  r?.success === true || r?.status === "success" || r?.res === "success";

const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: [],
      isLoading: false,
      error: null,

      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await getUsersService();

          if (isOk(res) && Array.isArray(res.data)) {
            set({ users: res.data, isLoading: false });
            return true;
          }

          const msg = res?.message || "Failed to load users";
          set({ isLoading: false, error: msg });
          toast.error(msg);
          return false;
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load users";
          set({ isLoading: false, error: msg });
          toast.error(msg);
          return false;
        }
      },

      clear: () => set({ users: [], error: null }),
    }),
    {
      name: "users-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUsersStore;
