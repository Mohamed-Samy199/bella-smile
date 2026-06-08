import { useQuery }       from "@tanstack/react-query";
import { distributorApi } from "../../api/distributor.api";
import { QUERY_KEYS }     from "../../constants/queryKeys";

export const useDistributors = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISTRIBUTORS(filters),
    queryFn:  () => distributorApi.getAll(filters),
    select:   (res) => res.data,
  });
};