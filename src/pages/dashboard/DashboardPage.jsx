import { useDashboardStats } from "../../hooks/dashboard/useDashboardStats";
import { DASHBOARD_CARDS }   from "../../constants/dashboard";
import StatCard              from "../../components/dashboard/StatCard";

// ── Skeleton ──────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100 mb-4" />
      <div className="h-8 w-16 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-32 bg-gray-100 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  // بناء map من الـ phases للـ counts
  const countMap = {};
  data?.phases?.forEach(({ phase, count }) => {
    countMap[phase] = count;
  });

  return (
    <div className="space-y-6">
      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600
                        rounded-xl px-4 py-3 text-sm">
          Failed to load dashboard stats. Please try again.
        </div>
      )}
      

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : DASHBOARD_CARDS.map((card) => (
              <StatCard
                key={card.phase}
                card={card}
                count={countMap[card.phase] ?? 0}
              />
            ))}
      </div>

      {/* Total */}
      {!isLoading && data && (
        <p className="text-sm text-gray-400 text-right">
          Total patients: <span className="font-semibold text-gray-600">{data.total}</span>
        </p>
      )}

    </div>
  );
}