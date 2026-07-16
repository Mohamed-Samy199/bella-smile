import { useQuery }     from "@tanstack/react-query";
import { useParams }    from "react-router-dom";
import { useState }     from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { distributorApi } from "../../api/distributor.api";
import Spinner          from "../../components/ui/Spinner";


function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-3xl font-light text-gray-800">{value ?? "—"}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ phase }) {
  const map = {
    "Photographic Evaluation":              { label: "Under evaluation",    cls: "bg-green-100 text-green-700"  },
    "Photographic Evaluation Verification": { label: "Verification",        cls: "bg-gray-100 text-gray-600"    },
    "Pick Up":                              { label: "Pending fingerprints",cls: "bg-amber-100 text-amber-700"  },
    "Preparation":                          { label: "In preparation",      cls: "bg-blue-100 text-blue-700"    },
    "Check Care Plan":                      { label: "Care plan review",    cls: "bg-blue-100 text-blue-700"    },
    "Waiting for Acceptance":               { label: "Awaiting decision",   cls: "bg-amber-100 text-amber-700"  },
    "STL":                                  { label: "STL files sent",      cls: "bg-gray-100 text-gray-600"    },
    "Manufacturing":                        { label: "Manufacturing",       cls: "bg-blue-100 text-blue-700"    },
  };
  const cfg = map[phase] || { label: phase, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${cfg.cls}`}>
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
    <div className="flex items-center justify-between px-5 py-3
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
                  ? "bg-darkColor text-white border border-darkColor"
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

export default function DistributorDashboard() {
  const { id } = useParams();

  // ← صفحة مستقلة لكل جدول
  const [repPage,     setRepPage]     = useState(1);
  const [billingPage, setBillingPage] = useState(1);
  const [filesPage,   setFilesPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["distributor-dashboard", id],
    queryFn:  () => distributorApi.getDashboard(id),
    select:   (res) => res.data,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  const { distributor, stats, representatives, patients } = data || {};
  const recentBilling = data?.recentBilling || [];

  // ── Pagination: Area Managers ──────────────────────────────
  const repList        = representatives || [];
  const repTotalPages  = Math.ceil(repList.length / PAGE_SIZE);
  const repPaginated   = repList.slice((repPage - 1) * PAGE_SIZE, repPage * PAGE_SIZE);

  // ── Pagination: Recent Billing ─────────────────────────────
  const billingTotalPages = Math.ceil(recentBilling.length / PAGE_SIZE);
  const billingPaginated  = recentBilling.slice(
    (billingPage - 1) * PAGE_SIZE, billingPage * PAGE_SIZE
  );

  // ── Pagination: All Files ──────────────────────────────────
  const filesList        = patients || [];
  const filesTotalPages  = Math.ceil(filesList.length / PAGE_SIZE);
  const filesPaginated   = filesList.slice(
    (filesPage - 1) * PAGE_SIZE, filesPage * PAGE_SIZE
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between border-b
                      border-gray-100 pb-3">
        <div>
          <h2 className="text-2xl font-light text-gray-700">
            {distributor?.name}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {stats?.representatives} Area Managers —{" "}
            {stats?.activeDoctors} active doctors
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Area Managers"  value={stats?.representatives}  />
        <StatCard label="Active doctors"   value={stats?.activeDoctors}    />
        <StatCard label="Cases in progress" value={stats?.casesInProgress} />
        <StatCard label="Billed this month"
                  value={`€${(stats?.billedThisMonth || 0).toLocaleString()}`} />
      </div>

      {/* Two columns: Representatives + Recent Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Area Managers */}
        <div className="lg:col-span-3 bg-white rounded-2xl border
                        border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              Area Managers
              {repList.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({repList.length})
                </span>
              )}
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Name", "Doctors", "Cases in progress"].map((h) => (
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
              {!repPaginated.length ? (
                <tr>
                  <td colSpan={3}
                      className="text-center py-6 text-gray-400 text-sm">
                    No representatives found.
                  </td>
                </tr>
              ) : (
                repPaginated.map((rep) => (
                  <tr key={rep._id}
                      className="border-b border-gray-50 last:border-0
                                 hover:bg-gray-50 transition">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                      {rep.name}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {rep.doctorsCount}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {rep.casesInProgress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={repPage}
            totalPages={repTotalPages}
            onPageChange={setRepPage}
          />
        </div>

        {/* Recent Billing */}
        <div className="lg:col-span-2 bg-white rounded-2xl border
                        border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              Recent billing
              {recentBilling.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({recentBilling.length})
                </span>
              )}
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Period", "Amount", "Status"].map((h) => (
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
              {!billingPaginated.length ? (
                <tr>
                  <td colSpan={3}
                      className="text-center py-6 text-gray-400 text-sm">
                    No billing records.
                  </td>
                </tr>
              ) : (
                billingPaginated.map((b, i) => (
                  <tr key={i}
                      className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {b.period}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      €{b.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium px-2.5 py-1
                                       rounded-full bg-green-100 text-green-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={billingPage}
            totalPages={billingTotalPages}
            onPageChange={setBillingPage}
          />
        </div>

      </div>

      {/* All Files */}
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            All files 
            {/* (all Area Managers) */}
            {filesList.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({filesList.length})
              </span>
            )}
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Patient", "Doctor", "Status"].map((h) => (
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
            {!filesPaginated.length ? (
              <tr>
                <td colSpan={4}
                    className="text-center py-6 text-gray-400 text-sm">
                  No active patients.
                </td>
              </tr>
            ) : (
              filesPaginated.map((p) => (
                <tr key={p._id}
                className="border-b border-gray-50 last:border-0
                hover:bg-gray-50 transition">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {p.doctor
                      ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}`
                      : "—"
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge phase={p.currentPhase} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={filesPage}
          totalPages={filesTotalPages}
          onPageChange={setFilesPage}
        />
      </div>

    </div>
  );
}