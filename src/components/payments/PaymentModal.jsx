// src/components/payments/PaymentModal.jsx
import { CreditCard, ExternalLink, Shield } from "lucide-react";
import Modal                from "../ui/Modal";
import Spinner              from "../ui/Spinner";
import { useCreateSession } from "../../hooks/payments/useCreateSession";

export default function PaymentModal({ isOpen, onClose, patient }) {
  const { mutate: createSession, isPending } = useCreateSession();

  const handlePay = () => {
    createSession({ patientId: patient._id });
    // redirect سيتم تلقائياً في الـ hook
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Payment Required" size="sm">

      {/* Patient Info */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5">
        <p className="text-sm font-semibold text-gray-700">
          {patient?.firstName} {patient?.lastName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {patient?.numAligners} aligners → Preparation phase
        </p>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <Shield size={16} className="text-primary-500 mt-0.5 shrink-0" />
          <p>You'll be redirected to Stripe's secure checkout page.</p>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <CreditCard size={16} className="text-primary-500 mt-0.5 shrink-0" />
          <p>After payment, the patient will automatically move to Preparation.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isPending}
          className="flex-1 border border-gray-200 text-gray-600
                     py-3 rounded-xl font-medium text-sm
                     hover:bg-gray-50 transition disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          onClick={handlePay}
          disabled={isPending}
          className="flex-1 bg-mainColor hover:bg-mainColor/80
                     text-white py-3 rounded-xl font-semibold text-sm
                     transition active:scale-95 disabled:opacity-60
                     flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Spinner size="sm" color="white" />
              Redirecting...
            </>
          ) : (
            <>
              <ExternalLink size={15} />
              Pay with Stripe
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3 flex
                    items-center justify-center gap-1">
        🔒 Secured by Stripe
      </p>

    </Modal>
  );
}