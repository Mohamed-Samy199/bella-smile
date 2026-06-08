import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientApi } from "../../api/patient.api";
import toast from "react-hot-toast";

export const useSetAcceptanceDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, decision }) =>
      patientApi.setAcceptanceDecision(
        patientId,
        decision
      ),

    onSuccess: () => {
      toast.success("Decision updated");

      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update decision"
      );
    },
  });
};