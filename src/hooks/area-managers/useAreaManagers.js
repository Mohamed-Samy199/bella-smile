import { useQuery }        from "@tanstack/react-query";
import { areaManagerApi }  from "../../api/areaManager.api";
import { QUERY_KEYS }      from "../../constants/queryKeys";

export const useAreaManagers = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AREA_MANAGERS(filters),
    queryFn:  () => areaManagerApi.getAll(filters),
    select:   (res) => res.data,
  });
};