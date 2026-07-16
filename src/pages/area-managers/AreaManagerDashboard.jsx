import { useState }                      from "react";
import { useQuery }                      from "@tanstack/react-query";
import { useParams, useNavigate }        from "react-router-dom";
import { ChevronLeft, ChevronRight }     from "lucide-react";
import { areaManagerApi }                from "../../api/areaManager.api";
import Spinner                           from "../../components/ui/Spinner";

const PHASE_TO_STEP = {
  "Photographic Evaluation":              0,
  "Photographic Evaluation Verification": 1,
  "Pick Up":                              2,
  "Preparation":                          3,
  "Check Care Plan":                      4,
  "Waiting for Acceptance":                5,
  "STL":                                  6,
  "Manufacturing":                        6, // نفس المرحلة (بديلة، مش متتالية) زي باقي الداشبورد
};

function MiniSteps({ phase }) {
  if (!phase) return (
    <span className="text-xs text-gray-300 bg-gray-50 px-2.5 py-1
                     rounded-full border border-gray-100 whitespace-nowrap">
      No files
    </span>
  );

  const cur   = PHASE_TO_STEP[phase] ?? 0;
  const total = 7;

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {Array.from({ length: total }, (_, i) => {
        const done   = i < cur;
        const active = i === cur;
        return (
          <div key={i} className="flex items-center gap-0.5 sm:gap-1">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex
                             items-center justify-center text-[9px]
                             sm:text-[10px] font-medium flex-shrink-0
              ${done   ? "bg-darkColor text-white"
              : active ? "border-2 border-darkColor text-darkColor"
              :          "border border-gray-200 text-gray-300"
              }`}>
              {i + 1}
            </div>
            {i < total - 1 && (
              <div className={`w-2 sm:w-3 h-px flex-shrink-0
                ${done ? "bg-darkColor" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, danger }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
      <p className={`text-2xl sm:text-3xl font-light mb-1
        ${danger ? "text-red-500" : "text-gray-800"}`}>
        {value ?? "—"}
      </p>
      <p className="text-xs sm:text-sm text-gray-400">{label}</p>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages      = [];
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd   = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);
    if (rangeStart > 2)            pages.push("...");
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push("...");
    if (totalPages > 1)            pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-3
                    border-t border-gray-100">
      <p className="text-xs text-gray-400">
        {currentPage} / {totalPages}
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

const PAGE_SIZE = 10;

export default function AreaManagerDashboard() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["area-manager-dashboard", id],
    queryFn:  () => areaManagerApi.getDashboard(id),
    select:   (res) => res.data,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  const { stats, doctors = [], areaManager } = data || {};

  const totalPages = Math.ceil(doctors.length / PAGE_SIZE);
  const paginated  = doctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4 sm:space-y-5 px-3 sm:px-0">

      {/* Header */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-xl sm:text-2xl font-light text-gray-500">
          My doctors
        </h2>
        {areaManager && (
          <p className="text-xs text-gray-400 mt-0.5">
            {areaManager.name}
            {areaManager.distributorName && ` — ${areaManager.distributorName}`}
          </p>
        )}
      </div>

      {/* Stats — على الموبايل: 1 كولومن، من sm: 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Doctors followed"  value={stats?.doctorsFollowed}  />
        <StatCard label="Cases in progress" value={stats?.casesInProgress}  />
        <StatCard label="Awaiting action"   value={stats?.awaitingAction} danger />
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Doctors
            {doctors.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({doctors.length})
              </span>
            )}
          </h3>
        </div>

        {/* على الموبايل → Cards بدل Table */}
        <div className="sm:hidden divide-y divide-gray-50">
          {!paginated.length ? (
            <p className="text-center py-8 text-gray-400 text-sm">
              No doctors assigned.
            </p>
          ) : (
            paginated.map((doc) => (
              <div
                key={doc._id}
                onClick={() => navigate(`/doctors/${doc._id}/overview`)}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer
                           transition active:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Dr. {doc.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.clinic || "—"}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full
                                   whitespace-nowrap flex-shrink-0
                    ${doc.casesInProgress > 0
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-400"
                    }`}>
                    {doc.casesInProgress} case{doc.casesInProgress !== 1 ? "s" : ""}
                  </span>
                </div>
                <MiniSteps phase={doc.latestPhase} />
              </div>
            ))
          )}
        </div>

        {/* من sm فما فوق → Table عادي */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Doctor", "Clinic / City", "Cases in progress",
                  "Latest file"].map((h) => (
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
                    No doctors assigned.
                  </td>
                </tr>
              ) : (
                paginated.map((doc) => (
                  <tr
                    key={doc._id}
                    onClick={() => navigate(`/doctors/${doc._id}/overview`)}
                    className="border-b border-gray-50 last:border-0
                               hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                      Dr. {doc.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {doc.clinic || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {doc.casesInProgress}
                    </td>
                    <td className="px-4 py-4">
                      <MiniSteps phase={doc.latestPhase} />
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