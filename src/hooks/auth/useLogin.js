import { useMutation }  from "@tanstack/react-query";
import { useNavigate }  from "react-router-dom";
import toast            from "react-hot-toast";
import { authApi }      from "../../api/auth.api";
import useAuthStore     from "../../store/auth.store";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ email, password }) => authApi.login({ email, password }),

    onSuccess: ({ data }) => {
      setAuth({ user: data.user, token: data.token });
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
  console.log(error);

  toast.error(
    error.message || "Invalid email or password."
  );
},
  });
};
