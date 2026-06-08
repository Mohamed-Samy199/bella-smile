import { useQuery } from "@tanstack/react-query";
import { authApi }  from "../../api/auth.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getToken }   from "../../utils/token";

export const useMe = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn:  () => authApi.me(),
    // بيشتغل بس لو فيه token
    enabled:  !!getToken(),
    select:   (res) => res.data.user,
  });
};