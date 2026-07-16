import { useQuery }    from "@tanstack/react-query";
import { patientApi }  from "../../api/patient.api";
import { useNavigate } from "react-router-dom";
import { useState }    from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PHASE_INDEX = {
  "Photographic Evaluation":             0,
  "Photographic Evaluation Verification":1,
  "Pick Up":                             2,
  "Preparation":                         3,
  "Check Care Plan":                     4,
  "Waiting for Acceptance":              5,
  "STL":                                 6,
  "Manufacturing":                       6,
  "Completed":                           7,
  "Not Suitable":                        7,
};

function Steps({ patient }) {
  const cur = PHASE_INDEX[patient.currentPhase] ?? 0;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 7 }, (_, i) => {
        const done   = i < cur;
        const active = i === cur;
        return (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center
                             justify-center text-[11px] font-medium
                             flex-shrink-0
              ${done   ? "bg-darkColor text-white"
              : active ? "border-2 border-darkColor text-darkColor"
              :          "bg-gray-100 text-gray-300 border border-gray-200"
              }`}>
              {i + 1}
            </div>
            {i < 6 && (
              <div className={`w-3 h-px flex-shrink-0
                ${done ? "bg-darkColor" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ patient }) {
  const p  = patient.currentPhase;
  const ad = patient.acceptanceDecision;

  const configs = {
    "Completed":     { label: "Completed",    cls: "bg-green-100 text-green-700" },
    "Not Suitable":  { label: "Not suitable", cls: "bg-red-100 text-red-600"    },
    "STL":           { label: "STL phase",    cls: "bg-blue-100 text-blue-700"  },
    "Manufacturing": { label: "Manufacturing",cls: "bg-blue-100 text-blue-700"  },
  };

  if (configs[p]) {
    const { label, cls } = configs[p];
    return <span className={`text-xs font-medium px-3 py-1 rounded-full ${cls}`}>{label}</span>;
  }

  if (p === "Pick Up" && patient.casePrice?.amount && !patient.doctor?.paymentExempt)
    return <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">Pending payment</span>;

  if (p === "Waiting for Acceptance" && ad === "pending")
    return <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">Awaiting decision</span>;

  if (p === "Photographic Evaluation")
    return <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">Under evaluation</span>;

  return <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">{p}</span>;
}

function StatCard({ label, value, danger }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <p className={`text-2xl font-medium ${danger ? "text-red-500" : "text-gray-800"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition
        ${active
          ? "bg-darkColor text-white border-darkColor"
          : "border-gray-200 text-gray-500 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  );
}

// ── Pagination Component ──────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // بناء أرقام الصفحات المعروضة
  const getPages = () => {
    const pages = [];
    const delta = 1; // كم صفحة حواليين الـ current

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd   = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (rangeEnd < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-5 py-3
                    border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg
                     border border-gray-200 text-gray-500 hover:bg-gray-50
                     disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Pages */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`}
                  className="w-7 h-7 flex items-center justify-center
                             text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 flex items-center justify-center
                          rounded-lg text-xs font-medium transition
                ${currentPage === page
                  ? "bg-darkColor text-white border border-darkColor"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-lg
                     border border-gray-200 text-gray-500 hover:bg-gray-50
                     disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PAGE_SIZE = 10;

export default function OverviewPage() {
  const navigate = useNavigate();
  const [filter,  setFilter]  = useState("all");
  const [page,    setPage]    = useState(1);

  // ── Reset page لما يتغير الـ filter ──────────────────────
  const handleFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["patients", { size: 200 }],
    queryFn:  () => patientApi.getAll({ size: 200, page: 1 }),
    select:   (res) => res.data?.result || [],
  });

  const patients = data || [];
  const active   = patients.filter(
    (p) => p.currentPhase !== "Completed" && p.currentPhase !== "Not Suitable"
  );

  // ── Stats ───────────────────────────────────────────────────
  const stats = {
    awaiting:   patients.filter(p => p.currentPhase === "Photographic Evaluation").length,
    inProd:     patients.filter(p => ["STL","Manufacturing","Preparation"].includes(p.currentPhase)).length,
    pendingPay: patients.filter(p => p.currentPhase === "Pick Up" && p.casePrice?.amount).length,
    completed:  patients.filter(p => {
      if (p.currentPhase !== "Completed") return false;
      const d   = new Date(p.updatedAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  // ── Filter ──────────────────────────────────────────────────
  const filtered = active.filter((p) => {
    if (filter === "stl")     return p.currentPhase === "STL";
    if (filter === "mfg")     return p.currentPhase === "Manufacturing";
    if (filter === "payment") return p.currentPhase === "Pick Up" && p.casePrice?.amount;
    return true;
  });

  // ── Pagination ───────────────────────────────────────────────
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between border-b
                      border-gray-100 pb-3">
        <div>
          <h2 className="text-2xl font-light text-gray-500">Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Across all doctors — {today}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Awaiting evaluation"  value={stats.awaiting}   />
        <StatCard label="Pending payment"      value={stats.pendingPay} danger />
        <StatCard label="In production"        value={stats.inProd}     />
        <StatCard label="Completed this month" value={stats.completed}  />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
                      overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-3.5
                        border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Active patients
            {filtered.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({filtered.length})
              </span>
            )}
          </h3>
          <div className="flex gap-2">
            {[
              { id: "all",     label: "All"             },
              { id: "stl",     label: "STL"             },
              { id: "mfg",     label: "Manufacturing"   },
              { id: "payment", label: "Pending payment" },
            ].map((f) => (
              <FilterBtn
                key={f.id}
                label={f.label}
                active={filter === f.id}
                onClick={() => handleFilter(f.id)}
              />
            ))}
          </div>
        </div>

        {/* Table Body */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Patient", "Doctor", "Progression", "Status"].map((h) => (
                <th key={h}
                    className="text-left text-[11px] font-medium
                               text-gray-400 uppercase tracking-wide
                               px-4 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}
                    className="text-center py-8 text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : !paginated.length ? (
              <tr>
                <td colSpan={4}
                    className="text-center py-8 text-gray-400 text-sm">
                  No patients in this category.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p._id}
                    onClick={() => navigate(`/patients/${p._id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50
                               cursor-pointer transition last:border-0">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-800">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.currentPhase}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {p.doctor
                      ? `${p.doctor.firstName} ${p.doctor.lastName}`
                      : "—"
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <Steps patient={p} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge patient={p} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

      </div>
    </div>
  );
}