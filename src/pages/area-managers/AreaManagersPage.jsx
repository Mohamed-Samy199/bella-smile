import { useState } from "react";
import { useFormik } from "formik";
import Joi from "joi";
import { Pencil, Trash2, BarChart2 } from "lucide-react";
import { useAreaManagers } from "../../hooks/area-managers/useAreaManagers";
import { useCreateAreaManager } from "../../hooks/area-managers/useCreateAreaManager";
import { useUpdateAreaManager } from "../../hooks/area-managers/useUpdateAreaManager";
import { useDeleteAreaManager } from "../../hooks/area-managers/useDeleteAreaManager";
import ListPage from "../../components/shared/ListPage";
import Modal from "../../components/ui/Modal";
import EditModal from "../../components/shared/EditModal";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import SubmitButton from "../../components/ui/SubmitButton";
import { useNavigate } from "react-router-dom";

const schema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  address: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  email: Joi.string().email({ tlds: { allow: false } }).optional().allow(""),
  phone: Joi.string().optional().allow(""),
});

const makeValidate = (s) => (values) => {
  const { error } = s.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
};

export default function AreaManagersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filters, setFilters] = useState({ page: 1, size: 30 });

  const { data, isLoading } = useAreaManagers(filters);
  const { mutate: create, isPending: creating } = useCreateAreaManager(() => setShowCreate(false));
  const { mutate: update, isPending: updating } = useUpdateAreaManager(() => setEditTarget(null));
  const { mutate: remove } = useDeleteAreaManager();
  const navigate = useNavigate();

  const createFormik = useFormik({
    initialValues: { firstName: "", lastName: "", address: "", city: "", email: "", phone: "" },
    validate: makeValidate(schema),
    onSubmit: (values) => create(values),
  });

  const editFormik = useFormik({
    initialValues: {
      firstName: editTarget?.firstName || "",
      lastName: editTarget?.lastName || "",
      address: editTarget?.address || "",
      city: editTarget?.city || "",
      email: editTarget?.email || "",
      phone: editTarget?.phone || "",
    },
    enableReinitialize: true,
    validate: makeValidate(schema),
    onSubmit: (values) => update({ id: editTarget._id, data: values }),
  });

  const editFields = [
    {
      type: "grid", name: "nameRow", cols: 2,
      children: [
        { name: "firstName", label: "First Name", placeholder: "Marco" },
        { name: "lastName", label: "Last Name", placeholder: "Rossi" },
      ],
    },
    { name: "address", label: "Address", placeholder: "Via Roma, 1" },
    { name: "city", label: "City", placeholder: "Roma" },
    {
      type: "grid", name: "contactRow", cols: 2,
      children: [
        { name: "email", label: "Email", inputType: "email", placeholder: "manager@email.com" },
        { name: "phone", label: "Phone", placeholder: "333 1234567" },
      ],
    },
  ];

  return (
    <>
      <ListPage
        title="Area Manager List"
        addLabel="Create Area Manager"
        columns={["First Name", "Last Name", "Address", "City", "Email", "Phone", "Actions"]}
        data={data?.result}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSearch={(search) => setFilters((f) => ({ ...f, search, page: 1 }))}
        onAdd={() => setShowCreate(true)}
        renderRow={(am) => (
          <>
            <td className="px-4 py-3 text-sm text-primary-600 font-medium">{am.firstName}</td>
            <td className="px-4 py-3 text-sm text-primary-600 font-medium">{am.lastName}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{am.address || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{am.city || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{am.email || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{am.phone || "—"}</td>

            <td className="px-3 py-3">
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => setEditTarget(am)}
                  className="text-mainColor hover:text-mainColor/80 transition"
                >
                  <Pencil size={20} strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => {
                    if (!window.confirm("Deactivate?")) return;
                    remove(am._id);
                  }}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={20} strokeWidth={2.2} />
                </button>

                <button
                  onClick={() => navigate(`/area-managers/${am._id}/dashboard`)}
                  className="text-gray-400 hover:text-primary-500 hover:text-mainColor transition"
                  title="View dashboard"
                >
                  <BarChart2 size={16} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}
        title="Create Area Manager" size="md">
        <form onSubmit={createFormik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name *"
              error={createFormik.errors.firstName}
              touched={createFormik.touched.firstName}>
              <Input name="firstName" value={createFormik.values.firstName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.firstName}
                touched={createFormik.touched.firstName} />
            </FormField>
            <FormField label="Last Name *"
              error={createFormik.errors.lastName}
              touched={createFormik.touched.lastName}>
              <Input name="lastName" value={createFormik.values.lastName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.lastName}
                touched={createFormik.touched.lastName} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Address">
              <Input name="address" placeholder="Via Roma, 1"
                value={createFormik.values.address}
                onChange={createFormik.handleChange} onBlur={createFormik.handleBlur} />
            </FormField>

            <FormField label="City">
              <Input name="city" placeholder="Roma"
                value={createFormik.values.city}
                onChange={createFormik.handleChange} onBlur={createFormik.handleBlur} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email"
              error={createFormik.errors.email}
              touched={createFormik.touched.email}>
              <Input type="email" name="email"
                value={createFormik.values.email}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.email}
                touched={createFormik.touched.email} />
            </FormField>
            <FormField label="Phone">
              <Input name="phone" value={createFormik.values.phone}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur} />
            </FormField>
          </div>
          <div className="pt-2">
            <SubmitButton isPending={creating}
              label="Create Area Manager" pendingLabel="Saving..." />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit: ${editTarget?.firstName} ${editTarget?.lastName}`}
        formik={editFormik}
        isPending={updating}
        fields={editFields}
      />
    </>
  );
}