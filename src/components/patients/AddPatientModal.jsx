import { useFormik }        from "formik";
import Joi                  from "joi";
import Modal                from "../ui/Modal";
import SubmitButton         from "../ui/SubmitButton";
import PatientFormFields    from "./PatientFormFields";
import { useCreatePatient } from "../../hooks/patients/useCreatePatient";
import { useDoctors }       from "../../hooks/doctors/useDoctors";
import useAuthStore         from "../../store/auth.store";

// ── Validation ────────────────────────────────────────────────
const schema = Joi.object({
  doctor:       Joi.string().hex().length(24).required()
                  .messages({ "any.required": "Doctor is required." }),
  firstName:    Joi.string().min(2).max(50).required()
                  .messages({ "any.required": "First name is required." }),
  lastName:     Joi.string().min(2).max(50).required()
                  .messages({ "any.required": "Last name is required." }),
  nationality:  Joi.string().max(100).optional().allow(""),
  phone:        Joi.string().max(20).optional().allow(""),
  treatment:    Joi.string().optional().allow("").allow(null),
  numAligners:  Joi.number().min(0).optional(),
  // amount:       Joi.number().min(0).optional(),
  rowColor:     Joi.string().valid("white","pink","yellow","purple").optional(),
  brux:         Joi.boolean().optional(),
  sconto:       Joi.boolean().optional(),
  priority:     Joi.boolean().optional(),
  flagUrgent:   Joi.boolean().optional(),
  flagQuestion: Joi.boolean().optional(),
  flagStar:     Joi.boolean().optional(),
  dataPronte:       Joi.date().optional().allow("").allow(null),
  dataAccettazione: Joi.date().optional().allow("").allow(null),
  dataFaseDue:      Joi.date().optional().allow("").allow(null),
});

const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => {
    acc[d.path[0]] = d.message;
    return acc;
  }, {});
};

const INITIAL_VALUES = {
  doctor: "", firstName: "", lastName: "",
  nationality: "", treatment: "", numAligners: 0,
  phone: "",
  // amount: 0,
  rowColor: "white",
  brux: false, sconto: false, priority: false,
  flagUrgent: false, flagQuestion: false, flagStar: false,
  dataPronte: "", dataAccettazione: "", dataFaseDue: "",
};

export default function AddPatientModal({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const { mutate: createPatient, isPending } = useCreatePatient(onClose);
  const { data: doctorsData } = useDoctors({ size: 100 });
  const doctors = doctorsData?.result || [];

  const formik = useFormik({
    initialValues: {
      ...INITIAL_VALUES,
      doctor: user?.role === "doctor" ? user._id : "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      // شيل الـ empty values
      const payload = Object.entries(values).reduce((acc, [k, v]) => {
        if (v !== "" && v !== null) acc[k] = v;
        return acc;
      }, {});

      createPatient(payload, {
        onSuccess: () => resetForm(),
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="New Evaluation" size="lg">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <PatientFormFields
          formik={formik}
          doctors={doctors}
          showDoctor={user?.role === "admin"}
        />
        <div className="pt-2 sticky bottom-0 bg-white pb-1">
          <SubmitButton isPending={isPending}
            label="Create Patient" pendingLabel="Saving..." />
        </div>
      </form>
    </Modal>
  );
}