import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { pricingApi }                  from "../../api/pricing.api";

export const useUpdatePricing = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => pricingApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      queryClient.invalidateQueries({ queryKey: ["pricing-history"] });
      toast.success("Price updated successfully.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update price.");
    },
  });
};