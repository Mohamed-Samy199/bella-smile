import axios from "axios";
import { getToken, removeToken } from "../utils/token.js";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor — بيحط الـ token في كل request ───────────────────────
client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status  = error.response?.status;
    const message =
      error.response?.data?.message ||
      "Something went wrong.";

    const requestUrl = error.config?.url;

    // ✅ اعمل logout فقط لو مش request login
    if (
      status === 401 &&
      requestUrl !== "/auth/login"
    ) {
      removeToken();
      window.location.href = "/login";
    }

    return Promise.reject({
      status,
      message,
    });
  }
);

export default client;