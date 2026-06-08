import { useEffect }         from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient }    from "@tanstack/react-query";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useSessionStatus }  from "../../hooks/payments/useSessionStatus";
import Spinner               from "../../components/ui/Spinner";
import { QUERY_KEYS }        from "../../constants/queryKeys";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const queryClient    = useQueryClient();
  const sessionId      = searchParams.get("session_id");

  const { data, isLoading } = useSessionStatus(sessionId);

  // لما الدفع يكتمل → invalidate الـ cache
  useEffect(() => {
    if (data?.paymentStatus === "paid") {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    }
  }, [data?.paymentStatus]);

  if (isLoading || data?.paymentStatus !== "paid") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col
                      items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-gray-500 text-sm">Confirming payment...</p>
        <p className="text-gray-400 text-xs">This may take a few seconds.</p>
      </div>
    );
  }

  const patient = data?.paymentRecord?.patient;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8
                      text-center space-y-5">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100
                          flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Successful!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            The patient has been moved to Preparation.
          </p>
        </div>

        {/* Patient Info */}
        {patient && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-left">
            <p className="text-sm font-semibold text-gray-700">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-xs text-primary-500 mt-0.5 font-medium">
              → {patient.currentPhase}
            </p>
          </div>
        )}

        {/* Amount */}
        {data?.paymentRecord && (
          <p className="text-gray-500 text-sm">
            Amount paid:{" "}
            <span className="font-bold text-gray-700">
              {data.paymentRecord.currency?.toUpperCase()}{" "}
              {(data.paymentRecord.amount / 100).toFixed(2)}
            </span>
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/patients")}
            className="flex-1 border border-gray-200 text-gray-600
                       py-3 rounded-xl font-medium text-sm
                       hover:bg-gray-50 transition"
          >
            All Patients
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-primary-500 hover:bg-primary-600
                       text-white py-3 rounded-xl font-semibold text-sm
                       transition active:scale-95 flex items-center
                       justify-center gap-1.5"
          >
            Dashboard
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}