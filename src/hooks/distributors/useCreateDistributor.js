import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { distributorApi }              from "../../api/distributor.api";

export const useCreateDistributor = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => distributorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
      toast.success("Distributor created.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};