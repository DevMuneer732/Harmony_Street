import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

      // ✅ LOGIN FUNCTION
      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const response = await authService.signIn({ email, password });

          const isSuccess =
            response?.success === true ||
            response?.res === "success" ||
            response?.status === "success";

          if (isSuccess && response.token) {
            // Save token in localStorage
            localStorage.setItem("hsma-access-token", response.token);
            authService.setToken(response.token);

            set({
              token: response.token,
              user: response.data ?? null,
              isAuthenticated: true,
            });

            toast.success("Login successful!");
            return true;
          } else {
            toast.error(response?.message || "Invalid email or password");
            return false;
          }
        } catch (err: any) {
          console.error("Login failed:", err);
          toast.error(err?.message || "Login failed. Please try again.");
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ LOGOUT FUNCTION
      logout: () => {
        try {
          authService.signOut();
        } catch (e) {
          console.warn("Sign out error:", e);
        }

        localStorage.removeItem("hsma-access-token");

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
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage), // ✅ the correct way
    }
  )
);

export default useAuthStore;
