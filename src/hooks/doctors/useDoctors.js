import { useQuery }   from "@tanstack/react-query";
import { doctorApi }  from "../../api/doctor.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const useDoctors = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCTORS(filters),
    queryFn:  () => doctorApi.getAll(filters),
    select:   (res) => res.data,
  });
};