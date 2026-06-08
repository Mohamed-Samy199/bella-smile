import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Stethoscope, Loader } from "lucide-react";
import toast                           from "react-hot-toast";
import { authApi }                     from "../../api/auth.api";

export default function ChangeRoleButton({ userId, currentRole, userName }) {
  const queryClient = useQueryClient();
  const newRole     = currentRole === "doctor" ? "admin" : "doctor";

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.changeRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success(`${userName} is now ${newRole}.`);
    },
    onError: (e) => toast.error(e.message || "Failed to change role."),
  });

  const handleClick = () => {
    if (!window.confirm(
      `Change "${userName}" role from ${currentRole} → ${newRole}?\n\nThis will affect their access immediately.`
    )) return;
    mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={`Make ${newRole}`}
      className={`flex items-center gap-1.5 text-xs font-medium
                  px-2.5 py-1.5 rounded-lg transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${currentRole === "doctor"
                    ? "bg-mainColor text-white hover:bg-mainColor/80"
                    : "bg-darkColor text-white hover:bg-darkColor/80"
                  }`}
    >
      {isPending ? (
        <Loader size={12} className="animate-spin" />
      ) : currentRole === "doctor" ? (
        <ShieldCheck size={12} />
      ) : (
        <Stethoscope size={12} />
      )}
      {isPending ? "..." : `→ ${newRole}`}
    </button>
  );
}