import { CreditCard, ExternalLink, Shield } from "lucide-react";
import Modal                from "../ui/Modal";
import Spinner              from "../ui/Spinner";
import { useCreateSession } from "../../hooks/payments/useCreateSession";


export default function PaymentModal({ isOpen, onClose, patient }) {
  const { mutate: createSession, isPending } = useCreateSession();
  const casePrice = patient?.casePrice;

  const CURRENCY_SYMBOLS = { eur: "€", usd: "$", gbp: "£" };
  const symbol = CURRENCY_SYMBOLS[casePrice?.currency] || "€";

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Payment Required" size="sm">

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm font-semibold text-gray-700">
          {patient?.firstName} {patient?.lastName}
        </p>
        {/* <p className="text-xs text-gray-400 mt-0.5">
          {patient?.numAligners} aligners → Preparation phase
        </p> */}
      </div>

      {/* Case Price Display */}
      {casePrice?.amount ? (
        <div className="bg-primary-50 border border-primary-100 rounded-xl
                        px-4 py-4 mb-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Amount Due</p>
          <p className="text-3xl font-black text-primary-600">
            {symbol}{casePrice.amount}
          </p>
          <p className="text-xs text-gray-400 mt-1 uppercase">
            {casePrice.currency}
          </p>
          {casePrice.note && (
            <p className="text-xs text-gray-500 italic mt-2">
              "{casePrice.note}"
            </p>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl
                        px-4 py-3 mb-4 text-sm text-amber-700">
          ⚠️ Price not set yet. Please contact your administrator.
        </div>
      )}

      <div className="space-y-2 mb-5">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <Shield size={16} className="text-primary-500 mt-0.5 shrink-0" />
          <p>You'll be redirected to Stripe's secure checkout page.</p>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <CreditCard size={16} className="text-primary-500 mt-0.5 shrink-0" />
          <p>After payment, the patient will move to Preparation.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} disabled={isPending}
          className="flex-1 border border-gray-200 text-gray-600 py-3
                     rounded-xl font-medium text-sm hover:bg-gray-50
                     transition disabled:opacity-40">
          Cancel
        </button>
        <button
          onClick={() => createSession({ patientId: patient._id })}
          disabled={isPending || !casePrice?.amount}
          className="flex-1 bg-mainColor hover:bg-mainColor/80 text-white
                     py-3 rounded-xl font-semibold text-sm transition
                     active:scale-95 disabled:opacity-60 flex items-center
                     justify-center gap-2"
        >
          {isPending ? (
            <><Spinner size="sm" color="white" /> Redirecting...</>
          ) : (
            <><ExternalLink size={15} />
              Pay {casePrice?.amount ? `${symbol}${casePrice.amount}` : ""}
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        🔒 Secured by Stripe
      </p>
    </Modal>
  );
}

