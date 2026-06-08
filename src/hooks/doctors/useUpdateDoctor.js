import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { doctorApi }                   from "../../api/doctor.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useUpdateDoctor = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => doctorApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCTOR(id) });
      toast.success("Doctor updated successfully.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update doctor.");
    },
  });
};