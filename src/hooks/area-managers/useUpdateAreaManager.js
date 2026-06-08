import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { areaManagerApi }              from "../../api/areaManager.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useUpdateAreaManager = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => areaManagerApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["area-managers"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AREA_MANAGER(id) });
      toast.success("Area manager updated successfully.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update area manager.");
    },
  });
};