import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { areaManagerApi }              from "../../api/areaManager.api";

export const useCreateAreaManager = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => areaManagerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["area-managers"] });
      toast.success("Area manager created.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};