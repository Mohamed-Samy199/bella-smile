
export default function Row({ label, value, highlight }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-center justify-between py-2 border-b
                    border-gray-50 last:border-0">
            <span className="text-sm text-gray-800">{label}</span>
            <span className={`text-sm font-semibold
        ${highlight === "green" ? "text-green-600" :
                    highlight === "red" ? "text-red-500" :
                        highlight === "blue" ? "text-mainColor" :
                            "text-gray-700"}`}>
                {value}
            </span>
        </div>
    );
}
