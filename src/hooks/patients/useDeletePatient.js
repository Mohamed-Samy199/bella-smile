import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => patientApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully.");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete patient.");
    },
  });
};