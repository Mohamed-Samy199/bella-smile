export default function SubmitButton({ isPending, label, pendingLabel }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-mainColor hover:bg-mainColor/80 text-white
                 font-semibold py-2.5 rounded-xl transition
                 active:scale-95 disabled:opacity-60
                 disabled:cursor-not-allowed text-sm"
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}