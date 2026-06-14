import { useState } from 'react'
import {useReviewRetreatment} from '../../hooks/patients/useRetreatment'

export default function ReviewModal({ isOpen, onClose, patient, action }) {
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useReviewRetreatment(patient?._id);

  const handleSubmit = () => {
    mutate(
      { action, rejectReason: reason },
      { onSuccess: onClose }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center
                    justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6
                      space-y-4">
        <h3 className="font-semibold text-gray-800">
          {action === "approve" ? "Approve Re-treatment" : "Reject Request"}
        </h3>

        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">
            {patient?.firstName} {patient?.lastName}
          </p>
          {patient?.retreatmentRequest?.note && (
            <p className="text-xs text-gray-500 mt-1 italic">
              "{patient.retreatmentRequest.note}"
            </p>
          )}
        </div>

        {action === "approve" && (
          <div className="bg-green-50 border border-green-200 rounded-xl
                          px-4 py-3 text-xs text-green-700">
            ✅ Patient will be moved to{" "}
            <strong>Photographic Evaluation Verification</strong>.
          </div>
        )}

        {action === "reject" && (
          <div>
            <label className="text-xs font-semibold text-gray-500
                              uppercase tracking-wide mb-1.5 block">
              Reject Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-3 py-2
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-300 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} disabled={isPending}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5
                       rounded-xl text-sm font-medium hover:bg-gray-50
                       transition disabled:opacity-40">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex-1 text-white py-2.5 rounded-xl font-semibold
                        text-sm transition active:scale-95 disabled:opacity-60
                        ${action === "approve"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                        }`}
          >
            {isPending
              ? "Processing..."
              : action === "approve" ? "Approve" : "Reject"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

