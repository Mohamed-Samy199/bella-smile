import { useQuery }   from "@tanstack/react-query";
import { paymentApi } from "../../api/payment.api";

export const useSessionStatus = (sessionId) => {
  return useQuery({
    queryKey: ["session-status", sessionId],
    queryFn:  () => paymentApi.checkSession(sessionId),
    select:   (res) => res.data,
    enabled:  !!sessionId,
    refetchInterval: (data) => {
      // بيعمل polling كل 2 ثانية لحد ما الدفع يكتمل
      if (data?.paymentStatus === "paid") return false;
      return 2000;
    },
  });
};