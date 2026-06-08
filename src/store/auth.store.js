import { create } from "zustand";
import { persist } from "zustand/middleware";
import { removeToken, setToken } from "../utils/token.js";

const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,
      token: null,

      // بعد الـ login
      setAuth: ({ user, token }) => {
        setToken(token);
        set({ user, token });
      },

      // logout
      clearAuth: () => {
        removeToken();
        set({ user: null, token: null });
      },

      // لو الـ user غير بياناته
      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: "bella_auth",       // اسم الـ key في localStorage
      partialize: (state) => ({ user: state.user }),  // بنحفظ الـ user بس مش الـ token
    }
  )
);

export default useAuthStore;