import { useToggleExempt } from "../../hooks/payments/useToggleExempt";
import { Shield, ShieldOff } from "lucide-react";

export default function PaymentExemptToggle({ doctor }) {
  const { mutate: toggle, isPending } = useToggleExempt();

  const isExempt = doctor.paymentExempt;

  return (
    <button
      onClick={() => {
        if (!window.confirm(
          isExempt
            ? `Remove payment exemption for ${doctor.firstName} ${doctor.lastName}?`
            : `Grant payment exemption to ${doctor.firstName} ${doctor.lastName}? They won't need to pay.`
        )) return;

        toggle({ doctorId: doctor._id, exempt: !isExempt });
      }}
      disabled={isPending}
      title={isExempt ? "Click to remove exemption" : "Click to grant exemption"}
      className={`flex items-center gap-1.5 text-xs font-medium
                  px-2.5 py-1.5 rounded-lg transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isExempt
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
    >
      {isExempt
        ? <><Shield size={12} /> Exempt</>
        : <><ShieldOff size={12} /> Not Exempt</>
      }
    </button>
  );
}