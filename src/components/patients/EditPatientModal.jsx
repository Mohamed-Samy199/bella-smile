import { useFormik }        from "formik";
import Joi                  from "joi";
import Modal                from "../ui/Modal";
import SubmitButton         from "../ui/SubmitButton";
import PatientFormFields    from "./PatientFormFields";
import { useUpdatePatient } from "../../hooks/patients/useUpdatePatient";
import { useDoctors }       from "../../hooks/doctors/useDoctors";
import useAuthStore         from "../../store/auth.store";

const schema = Joi.object({
  firstName:    Joi.string().min(2).max(50).optional(),
  lastName:     Joi.string().min(2).max(50).optional(),
  nationality:  Joi.string().max(100).optional().allow(""),
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

// تحويل Date لـ string للـ input
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function EditPatientModal({ isOpen, onClose, patient }) {
  const user = useAuthStore((s) => s.user);
  const { mutate: updatePatient, isPending } = useUpdatePatient(onClose);
  const { data: doctorsData } = useDoctors({ size: 100 });
  const doctors = doctorsData?.data || [];

  const formik = useFormik({
    initialValues: {
      firstName:    patient?.firstName    || "",
      lastName:     patient?.lastName     || "",
      nationality:  patient?.nationality  || "",
      treatment:    patient?.treatment    || "",
      numAligners:  patient?.numAligners  || 0,
      phone:          patient?.phone          || "",
      // amount:       patient?.amount       || 0,
      rowColor:     patient?.rowColor     || "white",
      brux:         patient?.brux         || false,
      sconto:       patient?.sconto       || false,
      priority:     patient?.priority     || false,
      flagUrgent:   patient?.flagUrgent   || false,
      flagQuestion: patient?.flagQuestion || false,
      flagStar:     patient?.flagStar     || false,
      dataPronte:       formatDate(patient?.dataPronte),
      dataAccettazione: formatDate(patient?.dataAccettazione),
      dataFaseDue:      formatDate(patient?.dataFaseDue),
    },
    enableReinitialize: true,
    validate,
    onSubmit: (values) => {
      const payload = Object.entries(values).reduce((acc, [k, v]) => {
        if (v !== "" && v !== null) acc[k] = v;
        return acc;
      }, {});

      updatePatient({ id: patient._id, data: payload });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Edit Patient" size="lg">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <PatientFormFields
          formik={formik}
          doctors={doctors}
          showDoctor={false}  // Edit مش بيغير الدكتور
        />
        <div className="pt-2 sticky bottom-0 bg-white pb-1">
          <SubmitButton isPending={isPending}
            label="Save Changes" pendingLabel="Saving..." />
        </div>
      </form>
    </Modal>
  );
}