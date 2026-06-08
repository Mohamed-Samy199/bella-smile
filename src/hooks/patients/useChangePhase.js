import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useChangePhase = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, phase, notes }) =>
      patientApi.changePhase(id, { phase, notes }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
      toast.success("Phase changed successfully.");
      onSuccess?.();
    },

    onError: (error) => {
      toast.error(error.message || "Failed to change phase.");
    },
  });
};