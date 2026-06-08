// src/components/shared/ListPage.jsx
import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import Pagination from "../ui/Pagination";

export default function ListPage({
  title,
  columns,
  data,
  pagination,
  isLoading,
  onPageChange,
  onSearch,
  onAdd,
  onDelete,
  renderRow,
  addLabel = "Create",
}) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="space-y-5">

      {/* Add Button */}
      {onAdd && (
        <div className="flex justify-center md:justify-end">
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-mainColor hover:bg-mainColor/80
                       text-white font-semibold px-5 py-2.5 rounded-xl
                       transition active:scale-95 text-sm"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-light text-center text-gray-500
                     border-b border-gray-200 pb-3">
        {title}
      </h2>

      {/* Search + Pagination */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center border border-gray-200 rounded-xl
                        overflow-hidden bg-white w-64">
          <input
            type="text"
            placeholder="search..."
            value={search}
            onChange={handleSearch}
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <span className="px-3 text-gray-400">
            <Search size={16} />
          </span>
        </div>

        <Pagination pagination={pagination} onPageChange={onPageChange} />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton cols={columns.length} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-primary-500 w-12">
                  #
                </th>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold
                                           text-primary-500 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
                {onDelete && <th className="w-12" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!data?.length ? (
                <tr>
                  <td colSpan={columns.length + 2}
                      className="text-center py-12 text-gray-400 text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr key={item._id}
                      className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {i + 1}
                    </td>
                    {renderRow(item)}
                    {onDelete && (
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => onDelete(item._id)}
                          className="text-gray-300 hover:text-red-500 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}

function TableSkeleton({ cols }) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-50 h-10" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 border-t border-gray-50 bg-white
                                px-4 flex items-center gap-6">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-gray-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}