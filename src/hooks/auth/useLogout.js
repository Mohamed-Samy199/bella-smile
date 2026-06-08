import { useQueryClient } from "@tanstack/react-query";
import { useNavigate }    from "react-router-dom";
import useAuthStore       from "../../store/auth.store";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth   = useAuthStore((s) => s.clearAuth);
  const navigate    = useNavigate();

  const logout = () => {
    clearAuth();
    queryClient.clear();        // امسح كل الـ cache
    navigate("/login", { replace: true });
  };

  return logout;
};