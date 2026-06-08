import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft }           from "lucide-react";

export default function PaymentCancelPage() {
  const navigate       = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8
                      text-center space-y-5">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100
                          flex items-center justify-center">
            <XCircle size={40} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Cancelled
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            No charges were made. The patient remains in Pick Up.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/patients")}
            className="flex-1 flex items-center justify-center gap-1.5
                       border border-gray-200 text-gray-600 py-3
                       rounded-xl font-medium text-sm hover:bg-gray-50
                       transition"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/patients")}
            className="flex-1 bg-primary-500 hover:bg-primary-600
                       text-white py-3 rounded-xl font-semibold text-sm
                       transition active:scale-95"
          >
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}