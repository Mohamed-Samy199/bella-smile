import { useQuery }   from "@tanstack/react-query";
import { paymentApi } from "../../api/payment.api";

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn:  () => paymentApi.getMyPayments(),
    select:   (res) => res.data.payments,
  });
};