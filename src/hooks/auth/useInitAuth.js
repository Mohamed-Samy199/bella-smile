import { useEffect, useState } from "react";
import { authApi }             from "../../api/auth.api";
import { getToken, removeToken } from "../../utils/token";
import useAuthStore            from "../../store/auth.store";

export const useInitAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setAuth   = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const init = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // تتشيك إن الـ token لسه valid
        const res  = await authApi.me();
        const user = res.data?.user;

        if (user) {
          setAuth({ user, token });
        } else {
          clearAuth();
        }
      } catch {
        // الـ token انتهى أو invalid
        removeToken();
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return { isLoading };
};