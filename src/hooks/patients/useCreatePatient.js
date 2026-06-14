import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useCreatePatient = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => patientApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
      toast.success("Patient created successfully.");
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message || "Failed to create patient."),
  });
};
