import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/service/auth.service";
import { toast } from "react-hot-toast";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const response = await authService.signIn({ email, password });

          if (response?.res === "success" && response.token) {
            authService.setToken(response.token);

            set({
              token: response.token,
              user: response.data ?? null,
              isAuthenticated: true,
              isLoading: false,
            });

            toast.success("Login successful!");
            return true;
          }

          toast.error(response?.message || "Invalid email or password");
          set({ isLoading: false });
          return false;
        } catch (err) {
          console.error("Login failed:", err);
          set({ isLoading: false });
          toast.error("Login failed. Please try again.");
          return false;
        }
      },

      logout: () => {
        authService.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        toast.success("Logged out successfully");
      },
    }),
    {
      name: "auth-storage", // key for Zustand persistence
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
