import { useQuery }   from "@tanstack/react-query";
import { pricingApi } from "../../api/pricing.api";

export const usePricing = () => {
  return useQuery({
    queryKey: ["pricing"],
    queryFn:  () => pricingApi.getCurrent(),
    select:   (res) => res.data.pricing,
    staleTime: 1000 * 60 * 10,  // 10 دقايق
  });
};

export const usePricingHistory = () => {
  return useQuery({
    queryKey: ["pricing-history"],
    queryFn:  () => pricingApi.getHistory(),
    select:   (res) => res.data.history,
  });
};