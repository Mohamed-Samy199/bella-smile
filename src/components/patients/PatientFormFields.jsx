import FormField from "../ui/FormField";
import Input from "../ui/Input";
import { ROW_COLORS } from "../../constants/patientConstants";
import useAuthStore from "../../store/auth.store";

export default function PatientFormFields({ formik, doctors = [], showDoctor = true }) {
  const user = useAuthStore((s) => s.user);
  const checkboxes = [
    { name: "priority", label: "Priority (Pr.)" },

    // Admin Only
    { name: "sconto", label: "Discount", adminOnly: true },
    { name: "flagUrgent", label: "Urgent (!)", adminOnly: true },
    { name: "flagQuestion", label: "Request (?)", adminOnly: true },
    { name: "flagStar", label: "Star (★)", adminOnly: true },
  ];


  return (
    <div className="space-y-4">

      {/* Doctor */}
      {showDoctor && (
        <FormField
          label="Doctor *"
          error={formik.errors.doctor}
          touched={formik.touched.doctor}
        >
          <select
            name="doctor"
            value={formik.values.doctor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm
                        text-gray-700 bg-white focus:outline-none
                        focus:ring-2 transition
                        ${formik.touched.doctor && formik.errors.doctor
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-primary-500"
              }`}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.firstName} {doc.lastName}
              </option>
            ))}
          </select>
          {formik.touched.doctor && formik.errors.doctor && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.doctor}</p>
          )}
        </FormField>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="First Name *"
          error={formik.errors.firstName}
          touched={formik.touched.firstName}>
          <Input name="firstName" placeholder="Mario"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName} />
        </FormField>

        <FormField label="Last Name *"
          error={formik.errors.lastName}
          touched={formik.touched.lastName}>
          <Input name="lastName" placeholder="Rossi"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName} />
        </FormField>
      </div>

      {/* Nationality + Phone*/}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nationality">
          <Input name="nationality" placeholder="IT"
            value={formik.values.nationality}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        </FormField>

        <FormField label="Phone">
          <Input name="phone" type="tel" placeholder="123-456-7890"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        </FormField>
      </div>

      {/* Row Color */}
      <FormField label="Row Color">
        <div className="flex gap-2">
          {ROW_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => formik.setFieldValue("rowColor", color.value)}
              className={`w-8 h-8 rounded-full border-2 transition
                ${formik.values.rowColor === color.value
                  ? "border-primary-500 scale-110"
                  : "border-transparent"
                }
                ${color.value === "white" ? "bg-white border-gray-300" : ""}
                ${color.value === "pink" ? "bg-pink-200" : ""}
                ${color.value === "yellow" ? "bg-yellow-200" : ""}
                ${color.value === "purple" ? "bg-purple-200" : ""}
              `}
              title={color.label}
            />
          ))}
        </div>
      </FormField>

      {/* Checkboxes */}
      {/* <div className="grid grid-cols-2 gap-2">
        {[
          { name: "brux", label: "BRUX" },
          { name: "sconto", label: "Discount" },
          { name: "priority", label: "Priority (Pr.)" },
          { name: "flagUrgent", label: "Urgent (!)" },
          { name: "flagQuestion", label: "Request (?)" },
          { name: "flagStar", label: "Star (★)" },
        ].map(({ name, label }) => (
          <label key={name}
            className="flex items-center gap-2 cursor-pointer
                       bg-gray-50 rounded-xl px-3 py-2">
            <input
              type="checkbox"
              name={name}
              checked={formik.values[name]}
              onChange={formik.handleChange}
              className="accent-primary-500 w-4 h-4"
            />
            <span className="text-sm text-gray-600">{label}</span>
          </label>
        ))}
      </div> */}
      <div className="grid grid-cols-2 gap-2">
        {checkboxes
          .filter(
            (item) =>
              !item.adminOnly || user?.role === "admin"
          )
          .map(({ name, label }) => (
            <label
              key={name}
              className="flex items-center gap-2 cursor-pointer
                   bg-gray-50 rounded-xl px-3 py-2"
            >
              <input
                type="checkbox"
                name={name}
                checked={formik.values[name]}
                onChange={formik.handleChange}
                className="accent-primary-500 w-4 h-4"
              />

              <span className="text-sm text-gray-600">
                {label}
              </span>
            </label>
          ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-3">
        <FormField label="Ready Date">
          <Input type="date" name="dataPronte"
            value={formik.values.dataPronte || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        </FormField>

        {/* <FormField label="Acceptance Date">
          <Input type="date" name="dataAccettazione"
            value={formik.values.dataAccettazione || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        </FormField> */}

        {/* <FormField label="Phase Two Date">
          <Input type="date" name="dataFaseDue"
            value={formik.values.dataFaseDue || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        </FormField> */}
      </div>


      {/* ── descraption Note ───────────────────────────────── */}
      <div>
        <label className="text-sm font-medium text-gray-700  tracking-wide mb-1.5 block">
          Note
        </label>
        <textarea
          name="descraption"
          placeholder="Add a descraption about this case..."
          rows={3}
          value={formik.values.descraption}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 focus:outline-none
                       focus:ring-2 focus:ring-primary-500
                       resize-none transition placeholder:text-gray-300"
        />
        {formik.touched.descraption && formik.errors.descraption && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.descraption}
          </p>
        )}
      </div>

    </div>
  );
}