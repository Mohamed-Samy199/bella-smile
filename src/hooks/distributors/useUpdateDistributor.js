import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { distributorApi }              from "../../api/distributor.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useUpdateDistributor = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => distributorApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DISTRIBUTOR(id) });
      toast.success("Distributor updated successfully.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update distributor.");
    },
  });
};