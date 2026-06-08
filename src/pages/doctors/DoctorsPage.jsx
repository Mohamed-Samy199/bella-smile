import { useState } from "react";
import { useFormik } from "formik";
import Joi from "joi";
import { Pencil, Trash2 } from "lucide-react";
import { useDoctors } from "../../hooks/doctors/useDoctors";
import { useCreateDoctor } from "../../hooks/doctors/useCreateDoctor";
import { useUpdateDoctor } from "../../hooks/doctors/useUpdateDoctor";
import { useDeactivateDoctor } from "../../hooks/doctors/useDeactivateDoctor";
import { useAreaManagers } from "../../hooks/area-managers/useAreaManagers";
import { useDistributors } from "../../hooks/distributors/useDistributors";
import ListPage from "../../components/shared/ListPage";
import Modal from "../../components/ui/Modal";
import EditModal from "../../components/shared/EditModal";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import SubmitButton from "../../components/ui/SubmitButton";
import PaymentExemptToggle from "../../components/payments/PaymentExemptToggle";
import ChangeRoleButton from "../../components/users/ChangeRoleButton";

// ── Schemas ───────────────────────────────────────────────────
const createSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  address: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  phone: Joi.string().optional().allow(""),
  areaManager: Joi.string().hex().length(24).optional().allow(""),
  distributor: Joi.string().hex().length(24).optional().allow(""),
  agency: Joi.string().optional().allow(""),
});

const updateSchema = Joi.object({
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  address: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  phone: Joi.string().optional().allow(""),
  areaManager: Joi.string().hex().length(24).optional().allow(""),
  distributor: Joi.string().hex().length(24).optional().allow(""),
  agency: Joi.string().optional().allow(""),
  isActive: Joi.boolean().optional(),
});

const makeValidate = (schema) => (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
};

export default function DoctorsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filters, setFilters] = useState({ page: 1, size: 30 });

  const { data, isLoading } = useDoctors(filters);
  const { mutate: createDoctor, isPending: creating } = useCreateDoctor(() => setShowCreateModal(false));
  const { mutate: updateDoctor, isPending: updating } = useUpdateDoctor(() => setEditTarget(null));
  const { mutate: deactivate } = useDeactivateDoctor();
  const { data: amData } = useAreaManagers({ size: 100 });
  const { data: distData } = useDistributors({ size: 100 });
  console.log(amData, distData);

  const areaManagers = amData?.result || [];
  const distributors = distData?.result || [];

  // ── Create Formik ─────────────────────────────────────────
  const createFormik = useFormik({
    initialValues: {
      email: "", password: "", firstName: "", lastName: "",
      address: "", city: "", phone: "",
      areaManager: "", distributor: "",agency: ""
    },
    validate: makeValidate(createSchema),
    onSubmit: (values) => {
      const payload = { ...values };
      if (!payload.areaManager) delete payload.areaManager;
      if (!payload.distributor) delete payload.distributor;
      createDoctor(payload);
    },
  });

  // ── Edit Formik ───────────────────────────────────────────
  const editFormik = useFormik({
    initialValues: {
      firstName: editTarget?.firstName || "",
      lastName: editTarget?.lastName || "",
      address: editTarget?.address || "",
      city: editTarget?.city || "",
      phone: editTarget?.phone || "",
      areaManager: editTarget?.areaManager?._id || "",
      distributor: editTarget?.distributor?._id || "",
      agency: editTarget?.agency || "",
    },
    enableReinitialize: true,
    validate: makeValidate(updateSchema),
    onSubmit: (values) => {
      const payload = { ...values };
      if (!payload.areaManager) delete payload.areaManager;
      if (!payload.distributor) delete payload.distributor;
      updateDoctor({ id: editTarget._id, data: payload });
    },
  });

  // ── Edit Fields Config ────────────────────────────────────
  const editFields = [
    {
      type: "grid", name: "nameRow", cols: 2,
      children: [
        { name: "firstName", label: "firstName", placeholder: "Luca" },
        { name: "lastName", label: "lastName", placeholder: "Bianchi" },
      ],
    },
    {
      type: "grid", name: "locationRow", cols: 2,
      children: [
        { name: "address", label: "address", placeholder: "Via Roma, 1" },
        { name: "city", label: "city", placeholder: "Milano" },
      ],
    },
    {
      type: "grid", name: "contactRow", cols: 2,
      children: [
        { name: "phone", label: "phone", placeholder: "02 12345678" },
        { name: "agency", label: "agency", placeholder: "Smile" },
      ],
    },
    {
      type: "select", name: "areaManager", label: "Area Manager",
      options: areaManagers.map((am) => ({
        value: am._id,
        label: `${am.firstName} ${am.lastName}`,
      })),
    },
    {
      type: "select", name: "distributor", label: "Distributor",
      options: distributors.map((d) => ({
        value: d._id,
        label: d.companyName,
      })),
    },
  ];

  return (
    <>
      <ListPage
        title="List of Doctors"
        addLabel="Create Doctor"
        columns={["First Name", "Last Name", "Address", "City", "Email", "Phone", "Agency", "Area Manager", "Created At" , "Payment Exempt","Role", "Actions"]}
        data={data?.result}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSearch={(search) => setFilters((f) => ({ ...f, search, page: 1 }))}
        onAdd={() => setShowCreateModal(true)}
        renderRow={(doc) => (
          <>
            <td className="px-4 py-3 text-sm text-primary-600 font-medium">
              {doc.firstName}
            </td>
            <td className="px-4 py-3 text-sm text-primary-600 font-medium">
              {doc.lastName}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{doc.address || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{doc.city || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{doc.email || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{doc.phone || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{doc.agency || "—"}</td>

            <td className="px-4 py-3 text-sm text-gray-600">
              {doc.areaManager
                ? `${doc.areaManager.firstName} ${doc.areaManager.lastName}`
                : "—"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {new Date(doc.createdAt).toLocaleDateString("en-GB")}
            </td>

            <td className="px-4 py-3">
              <PaymentExemptToggle doctor={doc} />
            </td>
            {/* <td className="px-4 py-3">
              <ChangeRoleButton userId={doc._id} currentRole={doc.role} userName={`${doc.firstName} ${doc.lastName}`} />
            </td> */}
            <td className="px-4 py-3">
              {doc.user ? (
                <ChangeRoleButton
                  userId={doc.user._id}
                  currentRole={doc.user.role}
                  userName={`${doc.firstName} ${doc.lastName}`}
                />
              ) : (
                <span className="text-xs text-gray-400">No user</span>
              )}
            </td>

            {/* Actions */}
            <td className="px-3 py-3">
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => setEditTarget(doc)}
                  className="text-mainColor hover:text-mainColor/80 transition"
                  title="Edit"
                >
                  <Pencil size={20} strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => {
                    if (!window.confirm("Deactivate this doctor?")) return;
                    deactivate(doc._id);
                  }}
                  className="text-gray-300 hover:text-red-500 transition"
                  title="Deactivate"
                >
                  <Trash2 size={20} strokeWidth={2.2} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}
        title="Create Doctor" size="lg">
        <form onSubmit={createFormik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name *"
              error={createFormik.errors.firstName}
              touched={createFormik.touched.firstName}>
              <Input name="firstName" placeholder="Luca"
                value={createFormik.values.firstName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.firstName}
                touched={createFormik.touched.firstName} />
            </FormField>
            <FormField label="Last Name *"
              error={createFormik.errors.lastName}
              touched={createFormik.touched.lastName}>
              <Input name="lastName" placeholder="Bianchi"
                value={createFormik.values.lastName}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.lastName}
                touched={createFormik.touched.lastName} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email *"
              error={createFormik.errors.email}
              touched={createFormik.touched.email}>
              <Input type="email" name="email"
                value={createFormik.values.email}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.email}
                touched={createFormik.touched.email} />
            </FormField>
            <FormField label="Password *"
              error={createFormik.errors.password}
              touched={createFormik.touched.password}>
              <Input type="password" name="password"
                value={createFormik.values.password}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                error={createFormik.errors.password}
                touched={createFormik.touched.password} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Address">
              <Input name="address" value={createFormik.values.address}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur} />
            </FormField>
            <FormField label="City">
              <Input name="city" value={createFormik.values.city}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone">
              <Input name="phone" value={createFormik.values.phone}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur} />
            </FormField>
             <FormField label="Agency">
              <Input name="agency" value={createFormik.values.agency}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Area Manager">
              <select name="areaManager"
                value={createFormik.values.areaManager}
                onChange={createFormik.handleChange}
                className="w-full border border-gray-300 rounded-xl px-4
                           py-2.5 text-sm text-gray-700 bg-white
                           focus:outline-none focus:ring-2
                           focus:ring-primary-500">
                <option value="">-- Select --</option>
                {areaManagers.map((am) => (
                  <option key={am._id} value={am._id}>
                    {am.firstName} {am.lastName}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Distributor">
              <select name="distributor"
                value={createFormik.values.distributor}
                onChange={createFormik.handleChange}
                className="w-full border border-gray-300 rounded-xl px-4
                           py-2.5 text-sm text-gray-700 bg-white
                           focus:outline-none focus:ring-2
                           focus:ring-primary-500">
                <option value="">-- Select --</option>
                {distributors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.companyName}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="pt-2">
            <SubmitButton isPending={creating}
              label="Create Doctor" pendingLabel="Saving..." />
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
        submitLabel="Save Changes"
      />
    </>
  );
}