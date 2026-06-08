import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { doctorApi }                   from "../../api/doctor.api";

export const useCreateDoctor = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => doctorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor created successfully.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create doctor.");
    },
  });
};