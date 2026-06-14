import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../api/patient.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";

export const useSetCasePrice = (patientId, onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => patientApi.setCasePrice(patientId, data),

    onSuccess: (res) => {
      const newCasePrice = res.data.casePrice;

      // ── 1) Optimistic update للـ patients list ─────────────
      // بدل ما ننتظر refetch، نحدث الـ cache مباشرة
      queryClient.setQueriesData(
        { queryKey: ["patients"], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          // الـ paginated response عندها result array
          const result = oldData?.result ?? oldData?.data?.result;
          if (!Array.isArray(result)) return oldData;

          const updatedResult = result.map((p) =>
            p._id === patientId
              ? { ...p, casePrice: newCasePrice }
              : p
          );

          // رجّع نفس الـ shape بس بالـ data الجديدة
          if (oldData?.result) {
            return { ...oldData, result: updatedResult };
          }
          return {
            ...oldData,
            data: { ...oldData.data, result: updatedResult },
          };
        }
      );

      // ── 2) Invalidate عشان يجيب أحدث بيانات من السيرفر ────
      queryClient.invalidateQueries({ queryKey: ["patients"] });

      // ── 3) لو فيه patient detail page مفتوح ───────────────
      if (patientId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PATIENT(patientId),
        });
      }

      toast.success("Case price set successfully.");
      onSuccess?.();
    },

    onError: (e) => toast.error(e.message || "Failed to set price."),
  });
};
