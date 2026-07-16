import { useState }              from "react";
import { useQuery }              from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText,
         Image, Upload, AlertCircle } from "lucide-react";
import { doctorApi }             from "../../api/doctor.api";
import Spinner                   from "../../components/ui/Spinner";

// ── نفس الـ STEPS من DoctorDashboard ─────────────────────────
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

function Steps({ phase }) {
  if (phase === "Not Suitable") {
    return (
      <div className="flex items-center gap-2 bg-red-50 border
                      border-red-100 rounded-xl px-4 py-3">
        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
        <p className="text-sm font-medium text-red-600">Not Suitable</p>
      </div>
    );
  }

  const cur = PHASE_TO_STEP[phase] ?? 0;

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex items-start min-w-[560px]">
        {STEPS.map((label, i) => {
          const done   = i < cur;
          const active = i === cur;
          const displayLabel =
            i === 6 && phase === "Manufacturing" ? "Manufacturing" : label;

          return (
            <div key={i}
                 className="flex items-start flex-shrink-0 w-[70px]">
              <div className="flex flex-col items-center flex-shrink-0 w-[70px]">
                <div className={`w-6 h-6 rounded-full flex items-center
                                 justify-center text-[11px] font-medium
                                 flex-shrink-0 transition
                  ${done   ? "bg-mainColor text-white"
                  : active ? "border-2 border-mainColor text-mainColor bg-white"
                  :          "border border-gray-200 text-gray-300 bg-white"
                  }`}>
                  {done ? "✓" : i + 1}
                </div>
                <p className={`mt-1.5 text-[10px] text-center leading-tight px-0.5
                  ${done || active ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                  {displayLabel}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-shrink-0 w-5 mt-3 mx-0.5
                  ${done ? "bg-mainColor" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocCard({ label, value, done, placeholder, icon: Icon }) {
  return (
    <div className={`rounded-xl border p-4 transition
      ${done
        ? "bg-green-50/60 border-green-100"
        : "bg-white border-gray-100 border-dashed"
      }`}>
      <p className={`text-xs mb-1 ${done ? "text-green-600" : "text-gray-400"}`}>
        {label}
      </p>
      {done ? (
        <p className="text-sm font-medium text-green-700">{value} ✓</p>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          {Icon && <Icon size={14} />}
          <p className="text-sm">{placeholder}</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ phase }) {
  const map = {
    "Photographic Evaluation":              { label: "Under evaluation",    cls: "bg-green-100 text-green-700"  },
    "Photographic Evaluation Verification": { label: "Evaluation received", cls: "bg-blue-100 text-blue-700"   },
    "Pick Up":                              { label: "Pending payment",     cls: "bg-amber-100 text-amber-700" },
    "Preparation":                          { label: "In preparation",      cls: "bg-blue-100 text-blue-700"   },
    "Check Care Plan":                      { label: "Care plan review",    cls: "bg-blue-100 text-blue-700"   },
    "Waiting for Acceptance":               { label: "Awaiting decision",   cls: "bg-amber-100 text-amber-700" },
    "STL":                                  { label: "STL phase",           cls: "bg-gray-100 text-gray-600"   },
    "Manufacturing":                        { label: "Manufacturing",       cls: "bg-blue-100 text-blue-700"   },
    "Completed":                            { label: "Completed",           cls: "bg-green-100 text-green-700" },
    "Not Suitable":                         { label: "Not Suitable",        cls: "bg-red-100 text-red-600"     },
  };
  const cfg = map[phase] || { label: phase, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full
                      whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, danger }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className={`text-2xl font-light mb-1
        ${danger ? "text-red-500" : "text-gray-800"}`}>
        {value ?? "—"}
      </p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function DoctorOverviewPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["doctor-overview", id],
    queryFn:  () => doctorApi.getOverview(id),
    select:   (res) => res.data,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  const { doctor, stats, featured, patients } = data || {};
console.log(data);

  const selectedPatient = selectedId
    ? patients?.find((p) => p._id === selectedId)
    : null;

  const displayed = selectedPatient || featured;

  const photosCount = displayed?.documents?.filter(
    (d) => d.mimeType?.startsWith("image/")
  ).length || 0;

  const pdfsCount = displayed?.documents?.filter(
    (d) => d.mimeType === "application/pdf"
  ).length || 0;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition p-1
                     rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-light text-gray-600">
            Dr. {doctor?.firstName} {doctor?.lastName}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {doctor?.city || "—"}
            {doctor?.agency ? ` · ${doctor.agency}` : ""}
            {doctor?.paymentExempt && (
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5
                               rounded-full text-[10px] font-medium">
                Payment exempt
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total patients"   value={stats?.totalPatients}  />
        <StatCard label="Active cases"     value={stats?.activePatients} />
        <StatCard label="Completed"        value={stats?.completedCases} />
        <StatCard label="Pending payment"  value={stats?.pendingPayment} danger />
      </div>

      {/* Featured / Selected Patient */}
      {displayed ? (
        <div className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-5 space-y-4">

          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-2">
                {selectedId ? "Selected patient" : "Latest active case"}
                {selectedId && (
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-[11px] text-gray-400 hover:text-gray-600
                               underline"
                  >
                    ← back
                  </button>
                )}
              </p>
              <h3 className="text-base font-semibold text-gray-800">
                {displayed.firstName} {displayed.lastName}
              </h3>
            </div>
            <StatusBadge phase={displayed.currentPhase} />
          </div>

          <Steps phase={displayed.currentPhase} />

          <div className="grid grid-cols-2 gap-3">
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

          <button
            onClick={() => navigate(`/patients/${displayed._id}`)}
            className="w-full bg-mainColor hover:bg-mainColor/90 text-white
                       py-2.5 rounded-xl text-sm font-medium transition
                       active:scale-95"
          >
            Open full patient record →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No active cases.</p>
        </div>
      )}

      {/* All Patients */}
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            All patients ({patients?.length || 0})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
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
              {!patients?.length ? (
                <tr>
                  <td colSpan={4}
                      className="text-center py-8 text-gray-400 text-sm">
                    No patients.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p._id}
                    onClick={() => setSelectedId(
                      selectedId === p._id ? null : p._id
                    )}
                    className={`border-b border-gray-50 last:border-0
                               hover:bg-gray-50 cursor-pointer transition
                               ${selectedId === p._id
                                 ? "bg-mainColor/5 border-l-2 border-l-mainColor"
                                 : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800">
                        {p.firstName} {p.lastName}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {p.management?.trattamento || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 text-center">
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
      </div>

    </div>
  );
}