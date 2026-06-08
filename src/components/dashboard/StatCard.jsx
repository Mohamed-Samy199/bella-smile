import { useNavigate } from "react-router-dom";

export default function StatCard({ card, count }) {
  const navigate = useNavigate();
  const Icon     = card.icon;

  return (
    <button
      onClick={() => navigate(card.route)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100
                 hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200 text-left w-full
                 active:scale-95"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
        <Icon size={22} className={card.color} />
      </div>

      {/* Count */}
      <p className={`text-3xl font-bold mb-1 ${count > 0 ? "text-primary-500" : "text-gray-400"}`}>
        {count}
      </p>

      {/* Label */}
      <p className="text-sm text-gray-500 font-medium leading-snug">
        {card.label}
      </p>
    </button>
  );
}