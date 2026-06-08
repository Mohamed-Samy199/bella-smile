import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientApi } from "../../../api/patient.api";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination"; 

export default function HistoryTab({ patient }) {
  const [page, setPage] = useState(1);
  const SIZE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["activity-log", patient._id, page],
    queryFn: () => patientApi.getActivityLog(patient._id, { page, size: SIZE }),
    select: (res) => res.data,
  });

  const log = data?.result || [];
  const pagination = data ? {
    page: data.currentPage,
    totalPages: data.pages,
  } : null;

  if (isLoading) return (
    <div className="flex justify-center py-10">
      <Spinner size="lg" />
    </div>
  );

  if (!log.length) return (
    <p className="text-center text-gray-400 text-sm py-10">
      No activity recorded yet.
    </p>
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Date", "User", "Action"].map((col) => (
                <th key={col}
                  className="px-4 py-3 text-xs font-semibold
                               text-primary-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {log.map((entry, i) => (
              <tr key={i} className="odd:bg-mainColor/15  hover:bg-primary-50 transition">
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(entry.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {entry.userName || "System"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {entry.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}