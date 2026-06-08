export default function Spinner({ size = "md", color = "primary" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    primary: "border-primary-500 border-t-transparent",
    white:   "border-white border-t-transparent",
    gray:    "border-gray-300 border-t-gray-600",
  };

  return (
    <div className={`${sizes[size]} ${colors[color]}
                     rounded-full animate-spin`} />
  );
}