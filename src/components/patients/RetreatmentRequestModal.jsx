import { useState }               from "react";
import { RefreshCw }              from "lucide-react";
import Modal                      from "../ui/Modal";
import { useRequestRetreatment }  from "../../hooks/patients/useRetreatment";

export default function RetreatmentRequestModal({ isOpen, onClose, patient }) {
  const [note, setNote] = useState("");

  const { mutate, isPending } = useRequestRetreatment(
    patient?._id,
    onClose
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Request Re-treatment" size="sm">

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm font-semibold text-gray-700">
          {patient?.firstName} {patient?.lastName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Current: <span className="text-green-600">Completed</span>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl
                      px-4 py-3 mb-4 text-xs text-blue-700">
        This will send a request to the admin to restart this patient's
        treatment from <strong>Evaluation Verification</strong>.
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500
                          uppercase tracking-wide mb-1.5 block">
          Reason
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why does this patient need re-treatment?"
          rows={3}
          maxLength={500}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                     text-sm text-gray-700 focus:outline-none focus:ring-2
                     focus:ring-primary-300 resize-none transition"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} disabled={isPending}
          className="flex-1 border border-gray-200 text-gray-600 py-3
                     rounded-xl text-sm font-medium hover:bg-gray-50
                     transition disabled:opacity-40">
          Cancel
        </button>
        <button
          onClick={() => mutate(note)}
          disabled={isPending}
          className="flex-1 bg-mainColor hover:bg-mainColor/80 text-white
                     py-3 rounded-xl font-semibold text-sm transition
                     active:scale-95 disabled:opacity-60 flex items-center
                     justify-center gap-2"
        >
          {isPending
            ? "Sending..."
            : <><RefreshCw size={14} /> Send Request</>
          }
        </button>
      </div>
    </Modal>
  );
}