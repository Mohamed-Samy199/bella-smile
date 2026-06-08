import { useState }                    from "react";
import { useQuery, useMutation,
         useQueryClient }              from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { Copy }                        from "lucide-react";
import { patientApi }                  from "../../api/patient.api";
import useAuthStore                    from "../../store/auth.store";
import Spinner                         from "../ui/Spinner";

export default function NotesPanel({ patient }) {
  const [message, setMessage] = useState("");
  const queryClient           = useQueryClient();
  const user                  = useAuthStore((s) => s.user);

  const QK = ["notes", patient._id];

  const { data: notes = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn:  () => patientApi.getNotes(patient._id),
    select:   (res) => res.data.notes,
  });

  const { mutate: send, isPending } = useMutation({
    mutationFn: () => patientApi.addNote(patient._id, message.trim()),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: QK });
      toast.success("Note sent.");
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    send();
  };

  // ── Notes split: left = admin, right = doctor ──────────
  // الأدمن شمال، الدكتور يمين — زي الصورة
  const isAdmin = user?.role === "admin";

  const adminNotes  = notes.filter((n) => n.sentByRole === "admin");
  const doctorNotes = notes.filter((n) => n.sentByRole === "doctor");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-700">Notes</h3>

      {/* Notes Grid — شمال: admin | يمين: doctor */}
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="md" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4">

          {/* Admin Notes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wide mb-1">
              Note gestione
            </p>
            <textarea
              placeholder="Write a note..."
              rows={3}
              value={isAdmin ? message : ""}
              onChange={(e) => isAdmin && setMessage(e.target.value)}
              readOnly={!isAdmin}
              className={`w-full border border-gray-200 rounded-xl px-3 py-2
                          text-sm text-gray-700 resize-none focus:outline-none
                          focus:ring-2 focus:ring-primary-500
                          ${!isAdmin ? "bg-gray-50 cursor-default" : ""}`}
            />
            {isAdmin && (
              <button
                onClick={handleSend}
                disabled={isPending || !message.trim()}
                className="text-xs bg-mainColor hover:bg-mainColor/80
                           text-white px-3 py-1.5 rounded-lg transition
                           disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Send"}
              </button>
            )}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {adminNotes.map((note, i) => (
                <NoteItem key={i} note={note} />
              ))}
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wide mb-1">
              Note interne
            </p>
            <textarea
              placeholder="Write a note..."
              rows={3}
              value={!isAdmin ? message : ""}
              onChange={(e) => !isAdmin && setMessage(e.target.value)}
              readOnly={isAdmin}
              className={`w-full border border-gray-200 rounded-xl px-3 py-2
                          text-sm text-gray-700 resize-none focus:outline-none
                          focus:ring-2 focus:ring-primary-500
                          ${isAdmin ? "bg-gray-50 cursor-default" : ""}`}
            />
            {!isAdmin && (
              <button
                onClick={handleSend}
                disabled={isPending || !message.trim()}
                className="text-xs bg-mainColor hover:bg-mainColor/80
                           text-white px-3 py-1.5 rounded-lg transition
                           disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Send"}
              </button>
            )}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {doctorNotes.map((note, i) => (
                <NoteItem key={i} note={note} />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Single Note ───────────────────────────────────────────────
function NoteItem({ note }) {
  const copy = () => {
    navigator.clipboard.writeText(note.message);
  };

  return (
    <div className="group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm">
          <span className="font-semibold text-gray-500 text-xs">
            {note.sentByName}
          </span>

          <span className="text-gray-400 text-xs font-normal ml-1">
            ({new Date(note.createdAt).toLocaleDateString("en-GB")})
          </span>
        </p>

        <button
          onClick={copy}
          className="opacity-0 group-hover:opacity-100 transition
                     text-gray-400 hover:text-primary-500 shrink-0"
        >
          <Copy size={13} />
        </button>
      </div>

      <div
        className="text-gray-600 mt-2 bg-gray-50
                   border border-gray-100
                   rounded-lg px-3 py-2"
      >
        {note.message}
      </div>
    </div>
  );
}