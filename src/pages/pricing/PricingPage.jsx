import { useState }          from "react";
import { useFormik }         from "formik";
import Joi                   from "joi";
import { History, Pencil, TrendingUp } from "lucide-react";
import { usePricing, usePricingHistory } from "../../hooks/pricing/usePricing";
import { useUpdatePricing }  from "../../hooks/pricing/useUpdatePricing";
import Modal                 from "../../components/ui/Modal";
import FormField             from "../../components/ui/FormField";
import Input                 from "../../components/ui/Input";
import SubmitButton          from "../../components/ui/SubmitButton";
import Spinner               from "../../components/ui/Spinner";

// ── Validation ────────────────────────────────────────────────
const schema = Joi.object({
  pricePerAligner: Joi.number().min(1).required().messages({
    "any.required": "Price is required.",
    "number.min":   "Price must be at least 1.",
    "number.base":  "Please enter a valid number.",
  }),
  currency: Joi.string().valid("eur", "usd", "gbp").optional(),
  note:     Joi.string().max(200).optional().allow(""),
});

const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
};

const CURRENCY_SYMBOLS = { eur: "€", usd: "$", gbp: "£" };

export default function PricingPage() {
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const { data: pricing,  isLoading }    = usePricing();
  const { data: history,  isLoading: loadingHistory } = usePricingHistory();
  const { mutate: update, isPending }    = useUpdatePricing(() => setShowEditModal(false));

  const formik = useFormik({
    initialValues: {
      pricePerAligner: pricing?.pricePerAligner || "",
      currency:        pricing?.currency        || "eur",
      note:            "",
    },
    enableReinitialize: true,
    validate,
    onSubmit: (values) => update(values),
  });

  const symbol = CURRENCY_SYMBOLS[pricing?.currency] || "€";

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <h2 className="text-2xl font-light text-gray-500 border-b
                     border-gray-200 pb-3">
        Pricing Settings
      </h2>

      {/* Current Price Card */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border
                        border-gray-100 p-6">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Current Price per Aligner
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-600">
                  {symbol}{pricing?.pricePerAligner}
                </span>
                <span className="text-gray-400 text-sm uppercase">
                  {pricing?.currency}
                </span>
              </div>

              {pricing?.isDefault && (
                <span className="text-xs text-amber-600 bg-amber-50
                                  px-2 py-0.5 rounded-full mt-2 inline-block">
                  Default price — not yet customized
                </span>
              )}

              {pricing?.updatedBy && (
                <p className="text-xs text-gray-400 mt-2">
                  Last updated by{" "}
                  <span className="font-medium text-gray-600">
                    {pricing.updatedBy.name}
                  </span>
                  {pricing.updatedAt && (
                    <> on {new Date(pricing.updatedAt).toLocaleDateString("en-GB")}</>
                  )}
                </p>
              )}

              {pricing?.note && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  "{pricing.note}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 border border-mainColor bg-mainColor
                           hover:bg-mainColor/80 text-white text-sm font-medium
                           px-4 py-2 rounded-xl transition"
              >
                <Pencil size={14} />
                Edit Price
              </button>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 border border-gray-200
                           hover:bg-gray-50 text-gray-600 text-sm font-medium
                           px-4 py-2 rounded-xl transition"
              >
                <History size={14} />
                History
              </button>
            </div>

          </div>

          {/* Example Calculation */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">
              Example calculations:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((n) => (
                <div key={n}
                     className="bg-gray-50 rounded-xl px-3 py-2 text-center">
                  <p className="text-xs text-gray-400">{n} aligners</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {symbol}{n * (pricing?.pricePerAligner || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Price per Aligner"
        size="sm"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Current → New Preview */}
          {formik.values.pricePerAligner &&
           formik.values.pricePerAligner !== pricing?.pricePerAligner && (
            <div className="flex items-center gap-3 bg-amber-50 border
                            border-amber-200 rounded-xl px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-400">Current</p>
                <p className="font-bold text-gray-600">
                  {symbol}{pricing?.pricePerAligner}
                </p>
              </div>
              <TrendingUp size={16} className="text-amber-500" />
              <div className="text-center">
                <p className="text-xs text-gray-400">New</p>
                <p className="font-bold text-primary-600">
                  {symbol}{formik.values.pricePerAligner}
                </p>
              </div>
            </div>
          )}

          {/* Price Input */}
          <FormField
            label="Price per Aligner *"
            error={formik.errors.pricePerAligner}
            touched={formik.touched.pricePerAligner}
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2
                               text-gray-400 font-medium">
                {CURRENCY_SYMBOLS[formik.values.currency] || "€"}
              </span>
              <input
                type="number"
                name="pricePerAligner"
                min={1}
                step={0.01}
                placeholder="50"
                value={formik.values.pricePerAligner}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-xl pl-8 pr-4 py-2.5
                            text-sm text-gray-800 focus:outline-none
                            focus:ring-2 transition
                            ${formik.touched.pricePerAligner &&
                              formik.errors.pricePerAligner
                              ? "border-red-400 focus:ring-red-300"
                              : "border-gray-300 focus:ring-primary-500"
                            }`}
              />
            </div>
            {formik.touched.pricePerAligner &&
             formik.errors.pricePerAligner && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.pricePerAligner}
              </p>
            )}
          </FormField>

          {/* Currency */}
          <FormField label="Currency">
            <select
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-xl px-4
                         py-2.5 text-sm text-gray-700 bg-white
                         focus:outline-none focus:ring-2
                         focus:ring-primary-500 transition"
            >
              <option value="eur">🇪🇺 EUR (€)</option>
              <option value="usd">🇺🇸 USD ($)</option>
              <option value="gbp">🇬🇧 GBP (£)</option>
            </select>
          </FormField>

          {/* Note */}
          <FormField label="Note (optional)">
            <Input
              name="note"
              placeholder="Reason for price change..."
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormField>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl
                          px-4 py-3 text-xs text-amber-700">
            ⚠️ This will affect all future payments.
            Existing payments won't be affected.
          </div>

          <SubmitButton
            isPending={isPending}
            label="Update Price"
            pendingLabel="Saving..."
          />

        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Price History"
        size="md"
      >
        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : !history?.length ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No history yet.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((record, index) => (
              <div key={record._id}
                   className={`flex items-center justify-between
                               px-4 py-3 rounded-xl border
                               ${index === 0
                                 ? "bg-primary-50 border-primary-100"
                                 : "bg-gray-50 border-gray-100"
                               }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-700">
                      {CURRENCY_SYMBOLS[record.currency]}
                      {record.pricePerAligner}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-primary-500 text-white
                                       px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  {record.updatedBy && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      By {record.updatedBy.name}
                    </p>
                  )}
                  {record.note && (
                    <p className="text-xs text-gray-500 italic mt-0.5">
                      "{record.note}"
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(record.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

    </div>
  );
}