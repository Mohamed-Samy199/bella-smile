import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { distributorApi }              from "../../api/distributor.api";

export const useDeleteDistributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => distributorApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
      toast.success("Distributor deactivated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};