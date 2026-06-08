import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Stethoscope,
  Building2, Truck, LogOut, CreditCard, Euro, X,
} from "lucide-react";
import logo from "../../assets/logo/bella.png";
import useAuthStore from "../../store/auth.store";
import { useLogout } from "../../hooks/auth/useLogout";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["admin", "doctor"] },
  { label: "Area Manager", to: "/area-managers", icon: Building2, roles: ["admin"] },
  { label: "Doctors", to: "/doctors", icon: Stethoscope, roles: ["admin"] },
  { label: "Distributors", to: "/distributors", icon: Truck, roles: ["admin"] },
  { label: "Patients", to: "/patients", icon: Users, roles: ["admin", "doctor"] },
  { label: "Payments", to: "/my-payments", icon: CreditCard, roles: ["doctor"] },
  { label: "Pricing", to: "/pricing", icon: Euro, roles: ["admin"] },
];

export default function Sidebar({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        w-52 bg-white flex flex-col shadow-sm
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo + Close Button (mobile) */}
      <div className="flex items-center justify-between py-6 px-4
                      border-b border-gray-100">
        <Link to="/" onClick={onClose}>
          <img src={logo} alt="Bella Smile"
            className="h-12 w-auto object-contain" />
        </Link>

        {/* زرار الإغلاق — بس على الموبايل */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-gray-600
                     p-1 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <SidebarLink
            key={item.to}
            item={item}
            onClose={onClose}
          />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-primary-500 flex
                          items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5
                     rounded-xl text-gray-500 hover:bg-red-50
                     hover:text-red-500 transition-colors text-sm
                     font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item, onClose }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
         font-medium transition-colors
         ${isActive
          ? "bg-primary-50 text-primary-600 font-semibold"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
};