import { useMyPayments } from "../../hooks/payments/useMyPayments";
import Spinner           from "../../components/ui/Spinner";
import EmptyState        from "../../components/ui/EmptyState";

const STATUS_STYLES = {
  succeeded: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  failed:    "bg-red-100 text-red-700",
  refunded:  "bg-gray-100 text-gray-600",
};
const CURRENCY_SYMBOLS = { eur: "€", usd: "$", gbp: "£" };

export default function MyPaymentsPage() {
  const { data: payments, isLoading } = useMyPayments();


  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <EmptyState
        icon="💳"
        title="No payments yet"
        message="Your payment history will appear here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-light text-gray-500 border-b
                     border-gray-200 pb-3">
        My Payments
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Patient", "Aligners", "Amount", "Status", "Date"].map((col) => (
                <th key={col}
                    className="px-4 py-3 text-xs font-semibold
                               text-primary-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => {
              const symbol = CURRENCY_SYMBOLS[payment.currency?.toLowerCase()] || "$";
              return (
                <tr key={payment._id}
                    className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {payment.patient?.firstName} {payment.patient?.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  {payment.numAligners}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                  {symbol}
                  {(payment.amount).toFixed(2)}
                </td>
                  {/* {payment.amount ? (payment.amount / 100).toFixed(2) : "0.00"} */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1
                                    rounded-full capitalize
                    ${STATUS_STYLES[payment.status] || "bg-gray-100 text-gray-500"}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}