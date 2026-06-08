export default function EmptyState({
  icon      = "🦷",
  title     = "No data found",
  message   = "There's nothing here yet.",
  action    = null,   // { label, onClick }
}) {
  return (
    <div className="flex flex-col items-center justify-center
                    py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-5">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary-500 hover:bg-primary-600 text-white
                     text-sm font-medium px-5 py-2.5 rounded-xl
                     transition active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}