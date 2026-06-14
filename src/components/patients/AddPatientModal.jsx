import { useRef, useState }  from "react";
import { useFormik }         from "formik";
import Joi                   from "joi";
import { Upload, X, Image }  from "lucide-react";
import Modal                 from "../ui/Modal";
import SubmitButton          from "../ui/SubmitButton";
import PatientFormFields     from "./PatientFormFields";
import { useCreatePatient }  from "../../hooks/patients/useCreatePatient";
import { useDoctors }        from "../../hooks/doctors/useDoctors";
import useAuthStore          from "../../store/auth.store";

// ── Validation ────────────────────────────────────────────────
const schema = Joi.object({
  doctor:       Joi.string().hex().length(24).required()
                  .messages({ "any.required": "Doctor is required." }),
  firstName:    Joi.string().min(2).max(50).required()
                  .messages({ "any.required": "First name is required.",
                              "string.empty": "First name is required." }),
  lastName:     Joi.string().min(2).max(50).required()
                  .messages({ "any.required": "Last name is required.",
                              "string.empty": "Last name is required." }),
  nationality:  Joi.string().max(100).optional().allow(""),
  phone:        Joi.string().max(20).optional().allow(""),
  descraption:  Joi.string().max(1000).optional().allow(""),
  rowColor:     Joi.string().valid("white","pink","yellow","purple").optional(),
  sconto:       Joi.boolean().optional(),
  priority:     Joi.boolean().optional(),
  flagUrgent:   Joi.boolean().optional(),
  flagQuestion: Joi.boolean().optional(),
  flagStar:     Joi.boolean().optional(),
  dataPronte:       Joi.date().optional().allow("").allow(null),
  initialNote:  Joi.string().max(1000).optional().allow(""),
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
  nationality: "", descraption: "", phone: "", rowColor: "white",
  sconto: false, priority: false,
  flagUrgent: false, flagQuestion: false, flagStar: false,
  dataPronte: "", initialNote: "",
};

export default function AddPatientModal({ isOpen, onClose }) {
  const user    = useAuthStore((s) => s.user);
  const { mutate: createPatient, isPending } = useCreatePatient(onClose);
  const { data: doctorsData } = useDoctors({ size: 100 });
  const doctors = doctorsData?.result || [];

  // ── Photos state ──────────────────────────────────────────
  const [photos,    setPhotos]    = useState([]);
  const [previews,  setPreviews]  = useState([]);
  const [dragging,  setDragging]  = useState(false);
  const fileInputRef              = useRef(null);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    if (valid.length !== files.length) {
      alert("Only JPG, PNG, WEBP images allowed.");
    }

    // Remove duplicates by name
    const existing = new Set(photos.map((p) => p.name));
    const newFiles = valid.filter((f) => !existing.has(f.name));

    setPhotos((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => ({
        url:  URL.createObjectURL(f),
        name: f.name,
      })),
    ]);
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setPhotos((prev)   => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Formik ────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      ...INITIAL_VALUES,
      doctor: user?.role === "doctor" ? user._id : "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      // بناء الـ FormData
      const formData = new FormData();

      // بيانات المريض
      Object.entries(values).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) {
          formData.append(k, v);
        }
      });

      // الصور
      photos.forEach((file) => formData.append("files", file));

      createPatient(formData, {
        onSuccess: () => {
          resetForm();
          setPhotos([]);
          setPreviews([]);
        },
      });
    },
  });

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setPreviews([]);
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}
           title="New Patient Evaluation" size="lg">
      <form onSubmit={formik.handleSubmit} className="space-y-5">

        {/* Patient Fields */}
        <PatientFormFields
          formik={formik}
          doctors={doctors}
          showDoctor={user?.role === "admin"}
        />

        

        {/* ── Photos Upload ──────────────────────────────── */}
        <div>
          <label className="text-sm font-medium text-gray-700  tracking-wide mb-1.5 block flex
                            items-center gap-1.5">
            <Image size={13} />
            Patient Photos
          </label>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl py-5 flex flex-col
                        items-center justify-center gap-1.5 cursor-pointer
                        transition-all
                        ${dragging
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
                        }`}
          >
            <Upload size={20} className={dragging
              ? "text-primary-500" : "text-gray-400"} />
            <p className="text-sm text-gray-500">
              Drop photos here or{" "}
              <span className="text-primary-500 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP • Max 20 photos
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previews.map((p, i) => (
                <div key={p.name}
                     className="relative group aspect-square rounded-xl
                                overflow-hidden bg-gray-100">
                  <img src={p.url} alt={p.name}
                       className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-500/80
                               hover:bg-red-600 text-white p-0.5 rounded-lg
                               opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {previews.length} photo(s) selected
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2 sticky bottom-0 bg-white pb-1">
          <SubmitButton
            isPending={isPending}
            label={`Create Patient${photos.length > 0
              ? ` + ${photos.length} photo(s)` : ""}`}
            pendingLabel="Creating..."
          />
        </div>

      </form>
    </Modal>
  );
}