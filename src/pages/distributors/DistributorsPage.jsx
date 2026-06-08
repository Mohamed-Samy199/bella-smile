import { useState }               from "react";
import { useFormik }              from "formik";
import Joi                        from "joi";
import { Pencil, Trash2 }         from "lucide-react";
import { useDistributors }        from "../../hooks/distributors/useDistributors";
import { useCreateDistributor }   from "../../hooks/distributors/useCreateDistributor";
import { useUpdateDistributor }   from "../../hooks/distributors/useUpdateDistributor";
import { useDeleteDistributor }   from "../../hooks/distributors/useDeleteDistributor";
import ListPage                   from "../../components/shared/ListPage";
import Modal                      from "../../components/ui/Modal";
import EditModal                  from "../../components/shared/EditModal";
import FormField                  from "../../components/ui/FormField";
import Input                      from "../../components/ui/Input";
import SubmitButton               from "../../components/ui/SubmitButton";

const schema = Joi.object({
  companyName: Joi.string().min(2).required(),
  address:     Joi.string().optional().allow(""),
  email:       Joi.string().email({ tlds: { allow: false } }).optional().allow(""),
  phone:       Joi.string().optional().allow(""),
});

const makeValidate = (s) => (values) => {
  const { error } = s.validate(values, { abortEarly: false });
  if (!error) return {};
  return error.details.reduce((acc, d) => ({ ...acc, [d.path[0]]: d.message }), {});
};

export default function DistributorsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filters,    setFilters]    = useState({ page: 1, size: 30 });

  const { data, isLoading }                     = useDistributors(filters);
  const { mutate: create,  isPending: creating } = useCreateDistributor(() => setShowCreate(false));
  const { mutate: update,  isPending: updating } = useUpdateDistributor(() => setEditTarget(null));
  const { mutate: remove }                       = useDeleteDistributor();

  const createFormik = useFormik({
    initialValues: { companyName: "", address: "", email: "", phone: "" },
    validate: makeValidate(schema),
    onSubmit: (values) => create(values),
  });

  const editFormik = useFormik({
    initialValues: {
      companyName: editTarget?.companyName || "",
      address:     editTarget?.address     || "",
      email:       editTarget?.email       || "",
      phone:       editTarget?.phone       || "",
    },
    enableReinitialize: true,
    validate: makeValidate(schema),
    onSubmit: (values) => update({ id: editTarget._id, data: values }),
  });

  const editFields = [
    { name: "companyName", label: "Society *", placeholder: "Smilepharm Milano" },
    { name: "address",     label: "Address", placeholder: "Via Roma, 1" },
    {
      type: "grid", name: "contactRow", cols: 2,
      children: [
        { name: "email", label: "Email", inputType: "email" },
        { name: "phone", label: "Phone" },
      ],
    },
  ];

  return (
    <>
      <ListPage
        title="Distributor List"
        addLabel="Create Distributor"
        columns={["Society", "Address", "Email", "Phone", "Actions"]}
        data={data?.result}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSearch={(search) => setFilters((f) => ({ ...f, search, page: 1 }))}
        onAdd={() => setShowCreate(true)}
        renderRow={(dist) => (
          <>
            <td className="px-4 py-3 text-sm text-primary-600 font-medium">
              {dist.companyName}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{dist.address || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{dist.email   || "—"}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{dist.phone   || "—"}</td>

            <td className="px-3 py-3">
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => setEditTarget(dist)}
                  className="text-mainColor hover:text-mainColor/80 transition"
                >
                  <Pencil size={20} strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => {
                    if (!window.confirm("Deactivate?")) return;
                    remove(dist._id);
                  }}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={20} strokeWidth={2.2} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}
             title="Create Distributor" size="md">
        <form onSubmit={createFormik.handleSubmit} className="space-y-4">
          <FormField label="Society *"
            error={createFormik.errors.companyName}
            touched={createFormik.touched.companyName}>
            <Input name="companyName"
              value={createFormik.values.companyName}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              error={createFormik.errors.companyName}
              touched={createFormik.touched.companyName} />
          </FormField>
          <FormField label="Address">
            <Input name="address" value={createFormik.values.address}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur} />
          </FormField>
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
              label="Create Distributor" pendingLabel="Saving..." />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Modify: ${editTarget?.companyName}`}
        formik={editFormik}
        isPending={updating}
        fields={editFields}
      />
    </>
  );
}