import { useMutation }  from "@tanstack/react-query";
import { useNavigate }  from "react-router-dom";
import toast            from "react-hot-toast";
import { authApi }      from "../../api/auth.api";
import useAuthStore     from "../../store/auth.store";

export const useRegister = () => {
  const navigate  = useNavigate();
  const setUser   = useAuthStore((s) => s.setUser);
  const setToken  = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      toast.success("Account created! Welcome.");
      navigate("/doctor-dashboard");
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Registration failed.");
    },
  });
};