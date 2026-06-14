import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi }                  from "../../api/payment.api";
import { QUERY_KEYS }                  from "../../constants/queryKeys";
import toast                           from "react-hot-toast";

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId }) => paymentApi.createSession({ patientId }),

    onSuccess: (res) => {
      const { exempted, sessionUrl } = res.data;

      if (exempted) {
        // الدكتور عنده استثناء → المريض اتنقل بدون دفع
        toast.success("Proceeded to Preparation (payment exemption).");
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
        return;
      }

      // redirect لـ Stripe
      window.location.href = sessionUrl;
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create payment session.");
    },
  });
};
