import axios from "axios";
import { toast } from "sonner";

const TOKEN_KEY = process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY || "template-access-token";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://209.105.243.7:1011/v1/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

//  Attach token correctly with template literal
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      toast.error("Network error or server not reachable");
    } else {
      const status = response.status;
      const data = response.data;

      if (status === 401) {
        toast.error("Session expired. Redirecting...");
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
      } else if (status === 403) {
        toast.error("You are not authorized to perform this action");
      } else if (status >= 500) {
        toast.error(data?.error || "Server error. Please try again later.");
      } else if (data?.message) {
        toast.error(data.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
