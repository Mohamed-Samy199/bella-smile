import { useLocation }  from "react-router-dom";
import { Menu }         from "lucide-react";
import useAuthStore     from "../../store/auth.store";

const PAGE_TITLES = {
  "/dashboard":    "Dashboard",
  "/patients":     "Patient List",
  "/doctors":      "List of Doctors",
  "/area-managers":"List of Area Managers",
  "/distributors": "Distributor List",
  "/my-payments":  "My Payments",
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const user     = useAuthStore((s) => s.user);

  // بيدعم dynamic routes زي /patients/:id
  const title = PAGE_TITLES[location.pathname]
    ?? (location.pathname.startsWith("/patients/")
        ? "Patient Details"
        : "Bella Smile");

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6
                       py-3 flex items-center justify-between shrink-0">

      <div className="flex items-center gap-3">
        {/* Hamburger — بس على الموبايل */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700
                     p-1.5 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <h2 className="text-base lg:text-lg font-semibold text-gray-700">
          {title}
        </h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-7 h-7 rounded-full bg-primary-500 hidden sm:flex
                        items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium text-sm hidden sm:block truncate
                         max-w-[120px]">
          {user?.name}
        </span>
      </div>

    </header>
  );
};