import { useFormik }     from "formik";
import Joi               from "joi";
import Modal             from "../ui/Modal";
import FormField         from "../ui/FormField";
import SubmitButton      from "../ui/SubmitButton";
import { useChangePhase } from "../../hooks/patients/useChangePhase";
import { PHASESEXPECT }        from "../../constants/phases";

const schema = Joi.object({
  phase: Joi.string().valid(...PHASESEXPECT).required()
            .messages({ "any.required": "Phase is required." }),
  notes: Joi.string().max(500).optional().allow("")
            .messages({ "any.required": "Notes are required." }),
});

const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => {
    acc[d.path[0]] = d.message;
    return acc;
  }, {});
};

export default function ChangePhaseModal({ isOpen, onClose, patient }) {
  const { mutate: changePhase, isPending } = useChangePhase(onClose);

  const formik = useFormik({
    initialValues: {
      phase: patient?.currentPhase || "",
      notes: "",
    },
    enableReinitialize: true,
    validate,
    onSubmit: (values, { resetForm }) => {
      changePhase(
        { id: patient._id, phase: values.phase, notes: values.notes },
        { onSuccess: () => resetForm() }
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Change Phase Manually" size="sm">
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">
            {patient?.firstName} {patient?.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Current:{" "}
            <span className="text-primary-500 font-medium">
              {patient?.currentPhase}
            </span>
          </p>
        </div>

        {/* Phase Select */}
        <FormField label="New Phase *"
          error={formik.errors.phase}
          touched={formik.touched.phase}>
          <select
            name="phase"
            value={formik.values.phase}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm
                        text-gray-700 bg-white focus:outline-none
                        focus:ring-2 transition
                        ${formik.touched.phase && formik.errors.phase
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-primary-500"
                        }`}
          >
            <option value="">-- Select Phase --</option>
            {PHASESEXPECT.map((phase) => (
              <option key={phase} value={phase}
                className={phase === patient?.currentPhase
                  ? "font-bold text-primary-600" : ""}>
                {phase === patient?.currentPhase ? `✓ ${phase}` : phase}
              </option>
            ))}
          </select>
          {formik.touched.phase && formik.errors.phase && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.phase}</p>
          )}
        </FormField>

        {/* Notes */}
        <FormField label="Notes"
          error={formik.errors.notes}
          touched={formik.touched.notes}>
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Reason for phase change..."
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500
                       resize-none transition"
          />
        </FormField>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl
                        px-4 py-3 text-xs text-amber-700">
          ⚠️ This change will override the patient's current phase.
        </div>

        <SubmitButton isPending={isPending}
          label="Confirm Change" pendingLabel="Saving..." />

      </form>
    </Modal>
  );
}