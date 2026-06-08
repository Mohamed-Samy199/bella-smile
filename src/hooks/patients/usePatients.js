import { useQuery } from "@tanstack/react-query";
import { patientApi } from "../../api/patient.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PATIENTS(filters),
    queryFn: () => patientApi.getAll(filters),

    // ✅ رجّع الـ result فقط
    select: (res) => ({
      patients: res.data.result,
      pagination: {
        total: res.data.docsCount,
        limit: res.data.limit,
        totalPages: res.data.pages,
        page: res.data.currentPage,
      },
    }),
  });
};