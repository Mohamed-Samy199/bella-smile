import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { paymentApi }                  from "../../api/payment.api";

export const useToggleExempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, exempt }) => paymentApi.toggleExempt(doctorId, exempt),
    onSuccess: (_, { exempt }) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success(`Payment exemption ${exempt ? "enabled" : "disabled"}.`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};