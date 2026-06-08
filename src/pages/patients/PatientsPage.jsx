import { useState }          from "react";
import { useSearchParams }   from "react-router-dom";
import { Plus }              from "lucide-react";
import { usePatients }       from "../../hooks/patients/usePatients";
import { useDeletePatient }  from "../../hooks/patients/useDeletePatient";
import PatientFilters        from "../../components/patients/PatientFilters";
import PatientTable          from "../../components/patients/PatientTable";
import Pagination            from "../../components/ui/Pagination";
import AddPatientModal       from "../../components/patients/AddPatientModal";

export default function PatientsPage({ defaultPhase }) {
  const [searchParams]      = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);

  const phaseFromUrl = searchParams.get("phase") || defaultPhase || "";

  const [filters, setFilters] = useState({
    page:  1,
    size:  10,
    phase: phaseFromUrl,
  });

  const { data, isLoading, isError } = usePatients(filters);
  const { mutate: deletePatient }    = useDeletePatient();

  const patients   = data?.patients        || [];
  const pagination = data?.pagination  || null;
  
  return (
    <div className="space-y-5">

      {/* Add Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-mainColor hover:bg-mainColor/50
                     text-white font-semibold px-8 py-3 rounded-xl
                     transition active:scale-95 shadow-sm"
        >
          <Plus size={18} />
          New Evaluation
        </button>
      </div>

      {/* Title لو فيه defaultPhase */}
      {/* {defaultPhase && ( */}
        <h2 className="text-2xl font-light text-center text-gray-600 border-b
                       border-mainColor pb-2 w-fit mx-auto">
          {/* {defaultPhase} */}
            {filters?.phase || "All Patients"}
        </h2>
      {/* )} */}

      {/* Filters */}
      <PatientFilters filters={filters} onChange={setFilters} />

      {/* Pagination Top */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600
                        rounded-xl px-4 py-3 text-sm">
          Failed to load patients.
        </div>
      )}

      {/* Table */}
      {isLoading ? <TableSkeleton /> : (
        <PatientTable patients={patients} onDelete={(id) => {
          if (!window.confirm("Delete this patient?")) return;
          deletePatient(id);
        }} />
      )}

      {/* Pagination Bottom */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />

      {/* Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-50 h-10" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 border-t border-gray-50 bg-white
                                px-4 flex items-center gap-4">
          <div className="h-3 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-40 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}