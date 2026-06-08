import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const usePatientWorkflow = (patientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, data = {} }) =>
      patientApi.workflow(patientId, action, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
      toast.success("Phase updated successfully.");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update phase.");
    },
  });
};