import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SectionCard({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
                    overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-mainColor/10
                   hover:bg-mainColor/20 transition"
      >
        <span className="flex items-center gap-2 text-base font-semibold
                         text-gray-700">
          <span>{icon}</span>
          {title}
        </span>
        {open
          ? <ChevronUp size={15} className="text-gray-400" />
          : <ChevronDown size={15} className="text-gray-400" />
        }
      </button>

      {open && (
        <div className="px-5 pb-4 pt-1 border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}