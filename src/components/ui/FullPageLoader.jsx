import Spinner from "./Spinner";

export default function FullPageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col
                    items-center justify-center z-50 gap-4">
      <Spinner size="xl" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}