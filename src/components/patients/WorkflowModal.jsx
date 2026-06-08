import { useMemo }          from "react";
import { useFormik }                  from "formik";
import Joi                            from "joi";
import { CreditCard, ExternalLink }   from "lucide-react";
import Modal                          from "../ui/Modal";
import FormField                      from "../ui/FormField";
import Input                          from "../ui/Input";
import SubmitButton                   from "../ui/SubmitButton";
import Spinner                        from "../ui/Spinner";
import { WORKFLOW_CONFIG }            from "../../constants/workflow";
import { usePatientWorkflow }         from "../../hooks/patients/usePatientWorkflow";
import { useCreateSession }           from "../../hooks/payments/useCreateSession";
import useAuthStore                   from "../../store/auth.store";

// ── Schema Builder ────────────────────────────────────────────
const buildSchema = (fields = []) => {
  const shape = { notes: Joi.string().max(500).optional().allow("") };

  fields.forEach((field) => {
    switch (field.type) {
      case "select":
        shape[field.name] = field.required
          ? Joi.string()
               .valid(...field.options.map((o) => o.value))
               .required()
               .messages({
                 "any.only":     `Please select a valid ${field.label}.`,
                 "any.required": `${field.label} is required.`,
                 "string.empty": `${field.label} is required.`,
               })
          : Joi.string()
               .valid(...field.options.map((o) => o.value))
               .optional()
               .allow("");
        break;
      case "number":
        shape[field.name] = field.required
          ? Joi.number().min(field.min ?? 0).required()
          : Joi.number().min(field.min ?? 0).optional();
        break;
      case "date":
        shape[field.name] = field.required
          ? Joi.date().required().messages({
              "any.required": `${field.label} is required.`,
              "date.base":    `${field.label} must be a valid date.`,
            })
          : Joi.date().optional().allow("");
        break;
      case "checkbox":
        shape[field.name] = Joi.boolean().optional();
        break;
      default:
        shape[field.name] = Joi.string().optional().allow("");
    }
  });

  return Joi.object(shape);
};

const buildInitialValues = (fields = []) =>
  fields.reduce(
    (acc, field) => {
      acc[field.name] =
        field.type === "checkbox" ? false
        : field.type === "number" ? 0
        : "";
      return acc;
    },
    { notes: "" }
  );

const makeValidate = (schema) => (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => {
    acc[d.path[0]] = d.message;
    return acc;
  }, {});
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function WorkflowModal({ isOpen, onClose, patient }) {
  const config  = WORKFLOW_CONFIG[patient?.currentPhase];
  const user    = useAuthStore((s) => s.user);

  const { mutate: runAction,     isPending: actionPending }  = usePatientWorkflow(patient?._id);
  const { mutate: createSession, isPending: sessionPending } = useCreateSession();

  const schema        = useMemo(() => buildSchema(config?.fields),        [patient?.currentPhase]);
  const initialValues = useMemo(() => buildInitialValues(config?.fields), [patient?.currentPhase]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validate: makeValidate(schema),
    onSubmit: (values, { resetForm }) => {
      const payload = Object.entries(values).reduce((acc, [k, v]) => {
        if (v !== "" && v !== undefined && v !== null) acc[k] = v;
        return acc;
      }, {});

      runAction(
        { action: config.action, data: payload },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    },
  });

  if (!isOpen || !patient || !config) return null;

  // ── هل المرحلة دي محتاجة دفع؟ ───────────────────────────
  // Doctor → محتاج يدفع
  // Admin  → مش محتاج
  const needsPayment =
    config.requiresPayment && user?.role === "doctor" && !patient?.doctor?.paymentExempt;

  const handlePayClick = () => {
    createSession({ patientId: patient._id });
    // redirect سيتم تلقائياً
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Move to: ${config.label}`}
      size="sm"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-xl py-3 space-y-1">
          <p className="text-md font-semibold text-gray-700">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-sm text-gray-400">
            Current:{" "}
            <span className="text-primary-500 font-medium">
              {patient.currentPhase}
            </span>
          </p>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>

        {/* ── Payment Required Block ──────────────────────── */}
        {needsPayment ? (
          <div className="space-y-4">

            {/* Payment Info */}
            <div className="bg-amber-50 border border-amber-200
                            rounded-xl px-4 py-4 space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">
                  Payment Required
                </p>
              </div>
              <p className="text-xs text-amber-600">
                To proceed to Preparation, you need to complete the
                payment for{" "}
                <span className="font-bold">
                  {patient.numAligners} aligners
                </span>
                .
              </p>
              <p className="text-xs text-amber-500">
                You'll be redirected to Stripe's secure checkout page.
              </p>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePayClick}
              disabled={sessionPending}
              className="w-full bg-primary-500 hover:bg-primary-600
                         text-white py-3 rounded-xl font-semibold text-sm
                         transition active:scale-95 disabled:opacity-60
                         flex items-center justify-center gap-2"
            >
              {sessionPending ? (
                <>
                  <Spinner size="sm" color="white" />
                  Redirecting...
                </>
              ) : (
                <>
                  <ExternalLink size={15} />
                  Pay & Proceed to Preparation
                </>
              )}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-200 text-gray-500
                         py-2.5 rounded-xl text-sm font-medium
                         hover:bg-gray-50 transition"
            >
              Cancel
            </button>

          </div>

        ) : (
          /* ── Normal Workflow ────────────────────────────── */
          <>
            {/* Dynamic Fields */}
            {config.fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={formik.values[field.name]}
                error={formik.errors[field.name]}
                touched={formik.touched[field.name]}
                onChange={(val) => formik.setFieldValue(field.name, val)}
                onBlur={() => formik.setFieldTouched(field.name, true)}
              />
            ))}

            {/* Notes */}
            <FormField label="Note">
              <textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Add a note..."
                rows={3}
                className="w-full border border-gray-300 rounded-xl
                           px-4 py-2.5 text-sm text-gray-700
                           placeholder-gray-400 focus:outline-none
                           focus:ring-2 focus:ring-primary-500
                           resize-none transition"
              />
            </FormField>

            {/* Next Phase */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Next phase:</span>
              <span className="bg-primary-50 text-primary-600 px-2 py-0.5
                               rounded-full font-medium">
                {config.label}
              </span>
            </div>

            {/* Submit */}
            <SubmitButton
              isPending={actionPending}
              label={`Confirm → ${config.label}`}
              pendingLabel="Processing..."
            />
          </>
        )}

      </form>
    </Modal>
  );
}

// ── Dynamic Field Renderer ────────────────────────────────────
function DynamicField({ field, value, error, touched, onChange, onBlur }) {
  if (field.type === "select") {
    return (
      <FormField label={field.label} error={error} touched={touched}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm
                      text-gray-700 bg-white focus:outline-none
                      focus:ring-2 transition
                      ${touched && error
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-primary-500"
                      }`}
        >
          <option value="">-- Select --</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  if (field.type === "number") {
    return (
      <FormField label={field.label} error={error} touched={touched}>
        <Input
          type="number"
          min={field.min ?? 0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onBlur={onBlur}
          error={error}
          touched={touched}
        />
      </FormField>
    );
  }

  if (field.type === "date") {
    return (
      <FormField label={field.label} error={error} touched={touched}>
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          error={error}
          touched={touched}
        />
      </FormField>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 cursor-pointer
                         bg-gray-50 rounded-xl px-4 py-3">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          className="accent-primary-500 w-4 h-4"
        />
        <span className="text-sm text-gray-700 font-medium">
          {field.label}
        </span>
      </label>
    );
  }

  return null;
}
