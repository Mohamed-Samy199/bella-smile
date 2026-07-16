import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/notFoundPage/notFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import DoctorsPage from "../pages/doctors/DoctorsPage";
import AreaManagersPage from "../pages/area-managers/AreaManagersPage";
import DistributorsPage from "../pages/distributors/DistributorsPage";
import ScrollToTopButton from "../components/shared/ScrollToTopButton/ScrollToTopButton";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import PaymentSuccessPage from "../pages/payments/PaymentSuccessPage";
import PaymentCancelPage from "../pages/payments/PaymentCancelPage";
import MyPaymentsPage from "../pages/payments/MyPaymentsPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import CourseDaish from "../pages/course-daish/CourseDaish";
import RetreatmentsPage from "../pages/retreatments/RetreatmentsPage";
import OverviewPage from "../pages/overview/OverviewPage";
import DistributorDashboard from "../pages/distributors/DistributorDashboard";
import AreaManagerDashboard from "../pages/area-managers/AreaManagerDashboard";
import DoctorDashboard from "../pages/doctors/DoctorDashboard";
import DoctorOverviewPage from "../pages/doctors/DoctorOverviewPage";

export default function AppRoutes() {
  return (
    <>
      <Routes>

        {/* ━━━━━━━━━ Website ━━━━━━━━━ */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/course-daish" element={<CourseDaish />} />
        </Route>

        {/* ━━━━━━━━━ Auth ━━━━━━━━━ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* ━━━━━━━━━ Dashboard ━━━━━━━━━ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/my-payments" element={<MyPaymentsPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/doctors/:id/overview" element={<DoctorOverviewPage />} />


            <Route element={<AdminRoute />}>
              <Route path="/area-managers" element={<AreaManagersPage />} />
              <Route path="/distributors" element={<DistributorsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/retreatments" element={<RetreatmentsPage />} />
              <Route path="/distributors/:id/dashboard" element={<DistributorDashboard />} />
              <Route path="/area-managers/:id/dashboard" element={<AreaManagerDashboard />} />

            </Route>
          </Route>
        </Route>

        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        {/* ━━━━━━━━━ Fallback ━━━━━━━━━ */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>

      <ScrollToTopButton />
    </>
  );
}