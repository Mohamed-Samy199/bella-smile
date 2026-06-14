// Sidebar.jsx — في الـ SidebarLink
import { NavLink } from "react-router-dom";
import { usePendingRetreatments } from "../../hooks/patients/useRetreatment";

function SidebarLink({ item, onClose }) {
  const Icon = item.icon;

  // بس للـ retreatments
  const { data: pending } = usePendingRetreatments();
  const showBadge =
    item.to === "/retreatments" && pending?.length > 0;

  return (
    <NavLink to={item.to} onClick={onClose}
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
      <span className="flex-1">{item.label}</span>
      {showBadge && (
        <span className="bg-amber-500 text-white text-xs font-bold
                         w-5 h-5 rounded-full flex items-center
                         justify-center">
          {pending.length}
        </span>
      )}
    </NavLink>
  );
}