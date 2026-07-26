import { useMutation }  from "@tanstack/react-query";
import { useNavigate }  from "react-router-dom";
import toast            from "react-hot-toast";
import { authApi }      from "../../api/auth.api";
import useAuthStore     from "../../store/auth.store";

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth); // ← setAuth مش setUser

  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res.data;

      // نفس اللي بيعمله useLogin
      setAuth({ user, token });

      toast.success("Account created! Welcome.");
      navigate("/");
    },
    onError: (e) => {
      const msg = e.response?.data?.message || "Registration failed.";
      console.log("error =>" , e.response?.data);
      
      toast.error(msg);
    },
  });
};