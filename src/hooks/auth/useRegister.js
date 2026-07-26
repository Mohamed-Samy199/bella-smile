import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import useAuthStore from "../../store/auth.store";

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth); // ← setAuth مش setUser

  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
console.log(res);

      // نفس اللي بيعمله useLogin
      setAuth({ user, token });

      toast.success("Account created! Welcome.");
      navigate("/");
    },
    onError: (e) => {
      console.log("Full error response:", e.response?.data);
      console.log("error ========>" , e);
      
      const msg = e.response?.data?.message || "Registration failed.";
      toast.error(msg);
    },
  });
};




// export const useLogin = () => {
//   const navigate = useNavigate();
//   const setAuth  = useAuthStore((s) => s.setAuth);

//   return useMutation({
//     mutationFn: ({ email, password }) => authApi.login({ email, password }),

//     onSuccess: ({ data }) => {
//       setAuth({ user: data.user, token: data.token });
//       toast.success(`Welcome back, ${data.user.name}!`);
//       navigate("/dashboard", { replace: true });
//     },
//     onError: (error) => {
//   console.log(error);

//   toast.error(
//     error.message || "Invalid email or password."
//   );
// },
//   });
// };
