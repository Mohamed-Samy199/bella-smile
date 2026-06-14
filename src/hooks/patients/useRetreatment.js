import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { patientApi } from "../../api/patient.api";

export const useRequestRetreatment = (patientId, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note) => patientApi.requestRetreatment(patientId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Re-treatment request sent.");
      onSuccess?.();
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });
};

export const useReviewRetreatment = (patientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, rejectReason }) =>
      patientApi.reviewRetreatment(patientId, action, rejectReason),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({
        queryKey: ["patient", patientId]
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["retreatments-pending"] });
      toast.success(`Re-treatment ${action === "approve" ? "approved ✅" : "rejected."}`);
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });
};

export const usePendingRetreatments = () => {
  return useQuery({
    queryKey: ["retreatments-pending"],
    queryFn: () => patientApi.getPendingRetreatments(),
    select: (res) => res.data.requests,
  });
};