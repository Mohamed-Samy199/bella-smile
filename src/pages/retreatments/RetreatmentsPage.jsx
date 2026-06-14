import { useState }               from "react";
import { CheckCircle, XCircle }   from "lucide-react";
import { usePendingRetreatments }   from "../../hooks/patients/useRetreatment";
import Spinner                    from "../../components/ui/Spinner";
import ReviewModal from "../../components/retreatments/ReviewModal";

export default function RetreatmentsPage() {
  const { data: requests, isLoading } = usePendingRetreatments();
  const [selected, setSelected]       = useState(null);
  const [action,   setAction]         = useState(null);

  const handleAction = (patient, act) => {
    setSelected(patient);
    setAction(act);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b
                      border-gray-200 pb-3">
        <h2 className="text-2xl font-light text-gray-500">
          Re-treatment Requests
        </h2>
        {requests?.length > 0 && (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold
                           px-3 py-1 rounded-full">
            {requests.length} pending
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !requests?.length ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🦷</p>
          <p className="text-sm">No pending re-treatment requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id}
                 className="bg-white rounded-2xl border border-gray-100
                            shadow-sm p-5 flex items-start justify-between
                            gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {req.firstName} {req.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Dr:{" "}
                  <span className="font-medium">
                    {req.doctor?.firstName} {req.doctor?.lastName}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Requested:{" "}
                  {new Date(req.retreatmentRequest?.requestedAt)
                    .toLocaleDateString("en-GB")}
                </p>
                {req.retreatmentRequest?.note && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg
                                px-3 py-1.5 mt-1 italic max-w-sm">
                    "{req.retreatmentRequest.note}"
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleAction(req, "approve")}
                  className="flex items-center gap-1.5 bg-green-100
                             hover:bg-green-200 text-green-700 text-xs
                             font-medium px-3 py-2 rounded-xl transition"
                >
                  <CheckCircle size={13} />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req, "reject")}
                  className="flex items-center gap-1.5 bg-red-100
                             hover:bg-red-200 text-red-600 text-xs
                             font-medium px-3 py-2 rounded-xl transition"
                >
                  <XCircle size={13} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={!!selected}
        onClose={() => { setSelected(null); setAction(null); }}
        patient={selected}
        action={action}
      />
    </div>
  );
}