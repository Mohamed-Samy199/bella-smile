import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { areaManagerApi }              from "../../api/areaManager.api";

export const useDeleteAreaManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => areaManagerApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["area-managers"] });
      toast.success("Area manager deactivated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};