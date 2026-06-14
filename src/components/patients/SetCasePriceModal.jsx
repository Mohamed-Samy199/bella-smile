import { useFormik }       from "formik";
import Joi                 from "joi";
import { Euro }            from "lucide-react";
import Modal               from "../ui/Modal";
import SubmitButton        from "../ui/SubmitButton";
import { useSetCasePrice } from "../../hooks/patients/useSetCasePrice";

const CURRENCY_SYMBOLS = { eur: "€", usd: "$", gbp: "£" };

const schema = Joi.object({
  amount:   Joi.number().min(1).required().messages({
    "any.required": "Amount is required.",
    "number.min":   "Amount must be at least €1.",
    "number.base":  "Please enter a valid amount.",
  }),
  currency: Joi.string().valid("eur", "usd", "gbp").optional(),
  note:     Joi.string().max(200).optional().allow(""),
});

export default function SetCasePriceModal({ isOpen, onClose, patient }) {
  const { mutate: setPrice, isPending } = useSetCasePrice(
    patient?._id,
    onClose
  );

  const formik = useFormik({
    initialValues: {
      amount:   patient?.casePrice?.amount   || "",
      currency: patient?.casePrice?.currency || "eur",
      note:     patient?.casePrice?.note     || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      return error.details.reduce(
        (acc, d) => ({ ...acc, [d.path[0]]: d.message }), {}
      );
    },
    onSubmit: (values) => setPrice(values),
  });

  const symbol = CURRENCY_SYMBOLS[formik.values.currency] || "€";

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Set Case Price" size="sm">
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Patient info */}
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">
            {patient?.firstName} {patient?.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Current phase: {patient?.currentPhase}
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-gray-500
                            uppercase tracking-wide mb-1.5 block">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-gray-400 font-medium text-sm">
              {symbol}
            </span>
            <input
              type="number"
              name="amount"
              min={1}
              step={0.01}
              placeholder="0.00"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded-xl pl-8 pr-4 py-2.5
                          text-sm focus:outline-none focus:ring-2 transition
                          ${formik.touched.amount && formik.errors.amount
                            ? "border-red-400 focus:ring-red-200"
                            : "border-gray-300 focus:ring-primary-300"
                          }`}
            />
          </div>
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
          )}
        </div>

        {/* Currency */}
        <div>
          <label className="text-xs font-semibold text-gray-500
                            uppercase tracking-wide mb-1.5 block">
            Currency
          </label>
          <select
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-300 transition"
          >
            <option value="eur">🇪🇺 EUR (€)</option>
            <option value="usd">🇺🇸 USD ($)</option>
            <option value="gbp">🇬🇧 GBP (£)</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-semibold text-gray-500
                            uppercase tracking-wide mb-1.5 block">
            Note
          </label>
          <input
            type="text"
            name="note"
            placeholder="Reason or details..."
            value={formik.values.note}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-300 transition"
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl
                        px-4 py-3 text-xs text-blue-700">
          💡 This amount will be shown to the doctor and charged
          when the patient reaches Pick Up.
        </div>

        <SubmitButton
          isPending={isPending}
          label={`Set Price — ${symbol}${formik.values.amount || "0"}`}
          pendingLabel="Saving..."
        />

      </form>
    </Modal>
  );
}