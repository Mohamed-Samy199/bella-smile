export default function Input({ error, touched, className = "", ...props }) {
  const hasError = touched && error;
  return (
    <input
      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition
                  ${hasError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-primary-500"
                  }
                  ${className}`}
      {...props}
    />
  );
}