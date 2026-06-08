// import { Navigate, Outlet } from "react-router-dom";
// import { getToken } from "../utils/token";

// export default function ProtectedRoute() {
//   const token = getToken();
//   if (!token) return <Navigate to="/login" replace />;
//   return <Outlet />;
// }

import { Navigate, Outlet } from "react-router-dom";
import useAuthStore          from "../store/auth.store";
import { getToken }          from "../utils/token";

export default function ProtectedRoute() {
  const user  = useAuthStore((s) => s.user);
  const token = getToken();

  // لو مفيش token أو user → redirect للـ login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}