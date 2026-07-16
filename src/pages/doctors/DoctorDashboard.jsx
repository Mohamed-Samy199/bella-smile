import { useState }        from "react";
import { useQuery }        from "@tanstack/react-query";
import { useNavigate }     from "react-router-dom";
import { patientApi }      from "../../api/patient.api";
import useAuthStore        from "../../store/auth.store";
import Spinner             from "../../components/ui/Spinner";
import { FileText, Image, Upload, X, AlertCircle,
         ChevronLeft, ChevronRight } from "lucide-react";

// ── Progress Steps ────────────────────────────────────────────
const STEPS = [
  "Photographic Evaluation",
  "Photographic Evaluation Verification",
  "Pick Up",
  "Preparation",
  "Check Care Plan",
  "Waiting for Acceptance",
  "STL",
  "Completed",
];

const PHASE_TO_STEP = {
  "Photographic Evaluation":              0,
  "Photographic Evaluation Verification": 1,
  "Pick Up":                              2,
  "Preparation":                          3,
  "Check Care Plan":                      4,
  "Waiting for Acceptance":               5,
  "STL":                                  6,
  "Manufacturing":                        6,
  "Completed":                            7,
};

const NOT_SUITABLE_PHASE = "Not Suitable";

function Steps({ phase }) {
  if (phase === NOT_SUITABLE_PHASE) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100
                      rounded-xl px-4 py-3">
        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
        <p className="text-sm font-medium text-red-600">Not Completed</p>
      </div>
    );
  }

  const cur = PHASE_TO_STEP[phase] ?? 0;

  return (
    <div className="overflow-x-auto sm:overflow-visible -mx-1 px-1 pb-1 sm:pb-0">
      <div className="flex items-start min-w-[560px] sm:min-w-0">
        {STEPS.map((label, i) => {
          const done   = i < cur;
          const active = i === cur;

          const displayLabel =
            i === 6 && phase === "Manufacturing" ? "Manufacturing" : label;

          return (
            <div
              key={i}
              className="flex items-start flex-shrink-0 w-[70px]
                         sm:flex-1 sm:w-auto sm:last:flex-none"
            >
              <div className="flex flex-col items-center flex-shrink-0
                              w-[70px] sm:flex-1 sm:w-auto sm:last:flex-none">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex
                                 items-center justify-center text-[11px]
                                 sm:text-xs font-medium flex-shrink-0 transition
                  ${done   ? "bg-mainColor text-white"
                  : active ? "border-2 border-mainColor text-mainColor bg-white"
                  :          "border border-gray-200 text-gray-300 bg-white"
                  }`}>
                  {done ? "✓" : i + 1}
                </div>
                <p className={`mt-1.5 text-[10px] sm:text-[11px] text-center
                               leading-tight px-0.5
                  ${done || active ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                  {displayLabel}
                </p>
              </div>

              {i < STEPS.length - 1 && (
                <div className={`h-px flex-shrink-0 sm:flex-1 w-5 sm:w-auto
                                 mt-2.5 sm:mt-3.5 mx-0.5
                  ${done ? "bg-mainColor" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Document Card ─────────────────────────────────────────────
function DocCard({ label, value, done, placeholder, icon: Icon }) {
  return (
    <div className={`rounded-xl border p-3 sm:p-4 transition
      ${done
        ? "bg-green-50/60 border-green-100"
        : "bg-white border-gray-100 border-dashed"
      }`}>
      <p className={`text-xs mb-1 ${done ? "text-green-600" : "text-gray-400"}`}>
        {label}
      </p>
      {done ? (
        <p className="text-sm font-medium text-green-700 break-words">{value} ✓</p>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          {Icon && <Icon size={14} />}
          <p className="text-sm">{placeholder}</p>
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ phase }) {
  const map = {
    "Photographic Evaluation":              { label: "Under evaluation",    cls: "bg-green-100 text-green-700"  },
    "Photographic Evaluation Verification": { label: "Evaluation received", cls: "bg-blue-100 text-blue-700"   },
    "Pick Up":                              { label: "Pending payment",     cls: "bg-amber-100 text-amber-700" },
    "Preparation":                          { label: "In preparation",      cls: "bg-blue-100 text-blue-700"   },
    "Check Care Plan":                      { label: "Care plan review",    cls: "bg-blue-100 text-blue-700"   },
    "Waiting for Acceptance":               { label: "Awaiting decision",   cls: "bg-amber-100 text-amber-700" },
    "STL":                                  { label: "STL files sent",      cls: "bg-gray-100 text-gray-600"   },
    "Manufacturing":                        { label: "Manufacturing",       cls: "bg-blue-100 text-blue-700"   },
    "Completed":                            { label: "Completed",           cls: "bg-green-100 text-green-700" },
    "Not Suitable":                         { label: "Not Completed",       cls: "bg-red-100 text-red-600"     },
  };
  const cfg = map[phase] || { label: phase, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ── Pagination Component ──────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages      = [];
    const delta      = 1;
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
    <div className="flex items-center justify-between px-4 sm:px-5 py-3
                    border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg
                     border border-gray-200 text-gray-500 hover:bg-gray-50
                     disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} />
        </button>

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
                  ? "bg-mainColor text-white border border-mainColor"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          )
        )}

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

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);

  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage]             = useState(1); // ← صفحة جدول My patients

  const { data, isLoading } = useQuery({
    queryKey: ["patients", { size: 100 }],
    queryFn:  () => patientApi.getAll({ size: 100, page: 1 }),
    select:   (res) => res.data?.result || [],
  });

  const patients = data || [];

  const activePatients = patients.filter(
    (p) => p.currentPhase !== "Completed" &&
           p.currentPhase !== "Not Suitable"
  );

  const latestActive = activePatients[0] || null;

  const selectedPatient = selectedId
    ? patients.find((p) => p._id === selectedId) || null
    : null;

  const displayed = selectedPatient || latestActive;
  const isCustomSelection = !!selectedPatient;

  const photosCount = displayed?.documents?.filter(
    (d) => d.mimeType?.startsWith("image/")
  ).length || 0;

  const pdfsCount = displayed?.documents?.filter(
    (d) => d.mimeType === "application/pdf"
  ).length || 0;

  // ── Pagination: My Patients ────────────────────────────────
  const totalPages = Math.ceil(patients.length / PAGE_SIZE);
  const paginated  = patients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <div className="space-y-4 sm:space-y-5 px-3 sm:px-0">

      {/* Header */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-xl sm:text-2xl font-light text-gray-500">
          Welcome, Dr. {user?.name?.split(" ")[0]}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {activePatients.length} active case{activePatients.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Featured / Selected Patient */}
      {displayed ? (
        <div className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-4 sm:p-5 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-start
                          sm:justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-2 flex-wrap">
                {isCustomSelection ? "Selected patient" : "Active case"}
                {isCustomSelection && (
                  <button
                    onClick={() => setSelectedId(null)}
                    className="inline-flex items-center gap-0.5 text-[11px]
                               text-gray-400 hover:text-gray-600 underline"
                  >
                    <X size={11} /> back to latest
                  </button>
                )}
              </p>
              <h3 className="text-base font-semibold text-gray-800">
                {displayed.firstName} {displayed.lastName}
              </h3>
            </div>
            <div>
              <StatusBadge phase={displayed.currentPhase} />
            </div>
          </div>

          <Steps phase={displayed.currentPhase} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DocCard
              label="Patient photos"
              value={`${photosCount} file${photosCount !== 1 ? "s" : ""}`}
              done={photosCount > 0}
              placeholder="No photos uploaded"
              icon={Image}
            />
            <DocCard
              label="PDF documents"
              value={`${pdfsCount} file${pdfsCount !== 1 ? "s" : ""}`}
              done={pdfsCount > 0}
              placeholder="No PDFs uploaded"
              icon={FileText}
            />
            <DocCard
              label="Preview link"
              value="Link added"
              done={!!displayed.previewLink}
              placeholder="No preview link"
              icon={Upload}
            />
            <DocCard
              label="Case price"
              done={!!displayed.casePrice?.amount}
              value={`${displayed.casePrice?.currency?.toUpperCase()} ${displayed.casePrice?.amount}`}
              placeholder="Not set yet"
              icon={FileText}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => navigate(`/patients/${displayed._id}`)}
              className="flex-1 bg-mainColor hover:bg-mainColor/90 text-white
                         py-2.5 rounded-xl text-sm font-medium transition
                         active:scale-95"
            >
              Open case
            </button>
            <button
              onClick={() => navigate(`/patients/${displayed._id}?tab=documents`)}
              className="flex-1 border border-gray-200 hover:bg-gray-50
                         text-gray-600 py-2.5 rounded-xl text-sm font-medium
                         transition"
            >
              Upload documents
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-8 sm:p-10 text-center">
          <p className="text-gray-400 text-sm">No active cases.</p>
          <button
            onClick={() => navigate("/patients")}
            className="mt-3 text-xs text-primary-500 hover:underline"
          >
            View all patients →
          </button>
        </div>
      )}

      {/* My Patients */}
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            My patients
            {patients.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({patients.length})
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Patient", "Treatment", "Aligners", "Status"].map((h) => (
                  <th key={h}
                      className="text-left text-[11px] font-medium
                                 text-gray-400 uppercase tracking-wide
                                 px-4 py-2.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!paginated.length ? (
                <tr>
                  <td colSpan={4}
                      className="text-center py-8 text-gray-400 text-sm">
                    No patients yet.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr
                    key={p._id}
                    onClick={() => setSelectedId(p._id)}
                    className={`border-b border-gray-50 last:border-0
                               hover:bg-gray-50 cursor-pointer transition
                               ${selectedId === p._id ? "bg-mainColor/5" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                        {p.firstName} {p.lastName}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {p.management?.trattamento || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-center whitespace-nowrap">
                      {(p.management?.arcataInferiore ?? 0) +
                       (p.management?.arcataSuperiore ?? 0) || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge phase={p.currentPhase} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
}