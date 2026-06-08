import PatientRow from "./PatientRow";

const COLUMNS = [
  { label: "!",         width: "w-8"  },
  { label: "?",         width: "w-8"  },
  { label: "★",         width: "w-8"  },
  { label: "Pr.",       width: "w-10" },
  { label: "Discount",    width: "w-14" },
  { label: "Patient",  width: ""     },
  { label: "Doctor",   width: ""     },
  { label: "BRUX",      width: "w-16" },
  { label: "Num All.",  width: "w-20" },
  { label: "Treatment",    width: "w-16" },
  { label: "Status",     width: ""     },
  { label: "Date",      width: "w-28" },
  { label: "Decision", width: "w-16" },
  { label: "",          width: "w-10" },
];

export default function PatientTable({ patients, onDelete }) {

  if (!patients?.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🦷</p>
        <p className="text-sm">No patients found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-left">

        {/* Head */}
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {COLUMNS.map((col, i) => (
              <th
                key={i}
                className={`px-3 py-3 text-xs font-semibold text-primary-500
                            uppercase tracking-wide ${col.width}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-50">
          {patients.map((patient) => (
            <PatientRow
              key={patient._id}
              patient={patient}
              onDelete={onDelete}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}