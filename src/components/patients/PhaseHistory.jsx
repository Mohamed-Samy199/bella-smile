import {
  User,
  CheckCircle,
  CreditCard,
} from "lucide-react";

export default function PhaseHistory({ history = [] }) {
  if (!history.length) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No history available.
      </p>
    );
  }

  // الأحدث أولاً
  const sorted = [...history].reverse();

  return (
    <div className="space-y-0">
      {sorted.map((entry, index) => {
        const isPaymentEvent =
          entry.phase === "Preparation" &&
          entry.notes?.includes("Payment confirmed");

        return (
          <div key={index} className="flex gap-3">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full mt-1 shrink-0
                ${
                  isPaymentEvent
                    ? "bg-emerald-500"
                    : index === 0
                    ? "bg-primary-500"
                    : "bg-gray-200"
                }`}
              />

              {index !== sorted.length - 1 && (
                <div className="w-0.5 bg-gray-100 flex-1 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium
                    ${
                      isPaymentEvent
                        ? "text-emerald-700"
                        : index === 0
                        ? "text-primary-600"
                        : "text-gray-600"
                    }`}
                  >
                    {entry.phase}
                  </span>

                  {isPaymentEvent && (
                    <span
                      className="
                        px-2 py-0.5
                        rounded-full
                        text-[11px]
                        font-semibold
                        bg-green-800
                        text-white
                      "
                    >
                      ✓ PAID
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-500 shrink-0">
                  {new Date(entry.changedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Changed By */}
              {entry.changedBy && (
                <div className="flex items-center gap-1 mt-1">
                  <User size={11} className="text-gray-400" />

                  <span className="text-xs text-gray-500">
                    {entry.changedBy?.name || "Admin"} (
                    {entry.changedBy?.role || "Admin"})
                  </span>
                </div>
              )}

              {/* Payment Card */}
              {isPaymentEvent && (
                <div
                  className="
                    mt-3
                    rounded-xl
                    border
                    border-green-200
                    bg-gradient-to-r
                    from-green-100
                    to-green-300
                    p-4
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={18}
                      className="text-green-600"
                    />

                    <span className="font-semibold text-gray-700">
                      Payment Completed Successfully
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                    <CreditCard size={15} />
                    <span>{entry.notes}</span>
                  </div>
                </div>
              )}

              {/* Normal Notes */}
              {entry.notes && !isPaymentEvent && (
                <p
                  className=" text-sm text-gray-600 mt-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 italic">
                  "{entry.notes}"
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}