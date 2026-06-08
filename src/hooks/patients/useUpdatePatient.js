import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useUpdatePatient = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => patientApi.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT(id) });
      toast.success("Patient updated successfully.");
      onSuccess?.();
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update patient.");
    },
  });
};