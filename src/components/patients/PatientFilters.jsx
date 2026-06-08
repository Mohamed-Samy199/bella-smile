import { PHASES } from "../../constants/phases";

export default function PatientFilters({ filters, onChange }) {

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* Status / Phase */}
      <select
        value={filters.phase || ""}
        onChange={(e) => handleChange("phase", e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm
                   text-gray-600 bg-white focus:outline-none
                   focus:ring-2 focus:ring-primary-500 min-w-[180px]"
      >
        <option value="">-- Patient Status --</option>
        {PHASES.map((phase) => (
          <option key={phase} value={phase}>
            {phase}
          </option>
        ))}
      </select>

      {/* Nationality */}
      <select
        value={filters.nationality || ""}
        onChange={(e) => handleChange("nationality", e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm
                   text-gray-600 bg-white focus:outline-none
                   focus:ring-2 focus:ring-primary-500"
      >
        <option value="">-- Nationality --</option>
        <option value="IT">IT</option>
        <option value="FR">FR</option>
        <option value="EN">EN</option>
        <option value="DE">DE</option>
      </select>

      {/* Data Pronto */}
      <div className="relative">
        <input
          type="date"
          value={filters.dataPronte || ""}
          onChange={(e) => handleChange("dataPronte", e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm
                     text-gray-500 bg-white focus:outline-none
                     focus:ring-2 focus:ring-primary-500"
        />
        {/* {!filters.dataPronte && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 text-sm pointer-events-none">
            Ready Date
          </span>
        )} */}
      </div>

      {/* Data Accettazione */}
      <div className="relative">
        <input
          type="date"
          value={filters.dataAccettazione || ""}
          onChange={(e) => handleChange("dataAccettazione", e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm
                     text-gray-500 bg-white focus:outline-none
                     focus:ring-2 focus:ring-primary-500"
        />
        {/* {!filters.dataAccettazione && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 text-sm pointer-events-none">
            Acceptance Date
          </span>
        )} */}
      </div>

      {/* Search */}
      <div className="flex items-center border border-gray-200 rounded-xl
                      overflow-hidden bg-white flex-1 min-w-[180px]">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-gray-700
                     focus:outline-none"
        />
        <button className="px-3 text-gray-400 hover:text-primary-500 transition">
          🔍
        </button>
      </div>

      {/* Page Size */}
      <div className="flex items-center border border-gray-200 rounded-xl
                      overflow-hidden bg-white">
        <input
          type="number"
          min={10}
          max={100}
          step={10}
          value={filters.size || 30}
          onChange={(e) => handleChange("size", Number(e.target.value))}
          className="w-14 px-2 py-2 text-sm text-center text-gray-700
                     focus:outline-none"
        />
        <span className="px-2 text-gray-400 text-sm border-l border-gray-200">
          ⊞
        </span>
      </div>

    </div>
  );
}