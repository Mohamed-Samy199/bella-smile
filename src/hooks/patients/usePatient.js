import { useQuery }   from "@tanstack/react-query";
import { patientApi } from "../../api/patient.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const usePatient = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.PATIENT(id),
    queryFn:  () => patientApi.getById(id),
    select:   (res) => res.data.patient,
    enabled:  !!id,
  });
};