import Modal        from "../ui/Modal";
import FormField    from "../ui/FormField";
import Input        from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";

export default function EditModal({
  isOpen,
  onClose,
  title,
  formik,
  isPending,
  fields,
  submitLabel = "Salva Modifiche",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <FormField
                key={field.name}
                label={field.label}
                error={formik.errors[field.name]}
                touched={formik.touched[field.name]}
              >
                <select
                  name={field.name}
                  value={formik.values[field.name] || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-xl
                             px-4 py-2.5 text-sm text-gray-700 bg-white
                             focus:outline-none focus:ring-2
                             focus:ring-primary-500 transition"
                >
                  <option value="">-- Select --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
            );
          }

          if (field.type === "grid") {
            return (
              <div key={field.name} className={`grid grid-cols-${field.cols || 2} gap-3`}>
                {field.children.map((child) => (
                  <FormField
                    key={child.name}
                    label={child.label}
                    error={formik.errors[child.name]}
                    touched={formik.touched[child.name]}
                  >
                    <Input
                      type={child.inputType || "text"}
                      name={child.name}
                      placeholder={child.placeholder}
                      value={formik.values[child.name] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors[child.name]}
                      touched={formik.touched[child.name]}
                    />
                  </FormField>
                ))}
              </div>
            );
          }

          return (
            <FormField
              key={field.name}
              label={field.label}
              error={formik.errors[field.name]}
              touched={formik.touched[field.name]}
            >
              <Input
                type={field.inputType || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formik.values[field.name] || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors[field.name]}
                touched={formik.touched[field.name]}
              />
            </FormField>
          );
        })}

        <div className="pt-2">
          <SubmitButton
            isPending={isPending}
            label={submitLabel}
            pendingLabel="Saving..."
          />
        </div>

      </form>
    </Modal>
  );
}