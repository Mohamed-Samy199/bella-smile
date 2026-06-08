export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  // بناء الـ pages array مع ...
  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (page > 3)            pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-4">

      {/* Previous */}
      <PaginationBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        label="« Previous"
      />

      {/* Pages */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <PaginationBtn
            key={p}
            onClick={() => onPageChange(p)}
            active={p === page}
            label={p}
          />
        )
      )}

      {/* Next */}
      <PaginationBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        label="Next »"
      />

    </div>
  );
}

function PaginationBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
        ${active
          ? "bg-mainColor text-white"
          : disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}