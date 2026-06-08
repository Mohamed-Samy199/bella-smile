import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { doctorApi }                   from "../../api/doctor.api";

export const useDeactivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => doctorApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor deactivated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed.");
    },
  });
};