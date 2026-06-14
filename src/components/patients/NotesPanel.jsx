import { useState }                    from "react";
import { useQuery, useMutation,
         useQueryClient }              from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { Copy, Lock }                  from "lucide-react";
import { patientApi }                  from "../../api/patient.api";
import useAuthStore                    from "../../store/auth.store";
import Spinner                         from "../ui/Spinner";

export default function NotesPanel({ patient }) {
  const [sharedMsg,   setSharedMsg]   = useState("");
  const [internalMsg, setInternalMsg] = useState("");
  const queryClient                   = useQueryClient();
  const user                          = useAuthStore((s) => s.user);
  const isAdmin                       = user?.role === "admin";

  const QK = ["notes", patient._id];

  const { data: notes = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn:  () => patientApi.getNotes(patient._id),
    select:   (res) => res.data.notes,
  });

  // ── Send Shared Note (Admin ↔ Doctor) ─────────────────────
  const { mutate: sendShared, isPending: sendingShared } = useMutation({
    mutationFn: () => patientApi.addNote(
      patient._id,
      sharedMsg.trim(),
      false   // isInternal = false
    ),
    onSuccess: () => {
      setSharedMsg("");
      queryClient.invalidateQueries({ queryKey: QK });
      toast.success("Note sent.");
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  // ── Send Internal Note (Admin only) ──────────────────────
  const { mutate: sendInternal, isPending: sendingInternal } = useMutation({
    mutationFn: () => patientApi.addNote(
      patient._id,
      internalMsg.trim(),
      true    // isInternal = true
    ),
    onSuccess: () => {
      setInternalMsg("");
      queryClient.invalidateQueries({ queryKey: QK });
      toast.success("Internal note sent.");
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  // ── Split Notes ───────────────────────────────────────────
  const sharedNotes   = notes.filter((n) => !n.isInternal);
  const internalNotes = notes.filter((n) =>  n.isInternal);

  // للـ Doctor — بيشوف بس الـ shared
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100
                      shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Notes</h3>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Doctor textarea */}
            <textarea
              placeholder="Write a note to admin..."
              rows={3}
              value={sharedMsg}
              onChange={(e) => setSharedMsg(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2
                         text-sm text-gray-700 resize-none focus:outline-none
                         focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => sharedMsg.trim() && sendShared()}
              disabled={sendingShared || !sharedMsg.trim()}
              className="text-xs bg-mainColor hover:bg-mainColor/80 text-white
                         px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {sendingShared ? "Sending..." : "Send"}
            </button>

            {/* Shared notes list */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {sharedNotes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No notes yet.
                </p>
              ) : (
                sharedNotes.map((note, i) => (
                  <NoteItem key={i} note={note} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Admin View — كولومنين ──────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100
                    shadow-sm p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Notes</h3>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">

          {/* ── Column 1: Shared (Admin ↔ Doctor) ──────────── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wide">
              Note gestione
              <span className="ml-1 text-gray-300 font-normal normal-case">
                (visible to doctor)
              </span>
            </p>

            <textarea
              placeholder="Write to doctor..."
              rows={3}
              value={sharedMsg}
              onChange={(e) => setSharedMsg(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2
                         text-sm text-gray-700 resize-none focus:outline-none
                         focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => sharedMsg.trim() && sendShared()}
              disabled={sendingShared || !sharedMsg.trim()}
              className="text-xs bg-mainColor hover:bg-mainColor/80 text-white
                         px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {sendingShared ? "Sending..." : "Send"}
            </button>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {sharedNotes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  No shared notes.
                </p>
              ) : (
                sharedNotes.map((note, i) => (
                  <NoteItem key={i} note={note} />
                ))
              )}
            </div>
          </div>

          {/* ── Column 2: Internal (Admin only) ────────────── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wide flex items-center gap-1">
              <Lock size={11} className="text-amber-500" />
              Note interne
              <span className="ml-1 text-gray-300 font-normal normal-case">
                (admin only)
              </span>
            </p>

            <textarea
              placeholder="Internal admin note..."
              rows={3}
              value={internalMsg}
              onChange={(e) => setInternalMsg(e.target.value)}
              className="w-full border border-amber-100 bg-amber-50/30
                         rounded-xl px-3 py-2 text-sm text-gray-700
                         resize-none focus:outline-none
                         focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={() => internalMsg.trim() && sendInternal()}
              disabled={sendingInternal || !internalMsg.trim()}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white
                         px-3 py-1.5 rounded-lg transition disabled:opacity-50
                         flex items-center gap-1"
            >
              <Lock size={10} />
              {sendingInternal ? "Saving..." : "Save Internal"}
            </button>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {internalNotes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  No internal notes.
                </p>
              ) : (
                internalNotes.map((note, i) => (
                  <NoteItem key={i} note={note} isInternal />
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Single Note Item ──────────────────────────────────────────
function NoteItem({ note, isInternal }) {
  const copy = () => navigator.clipboard.writeText(note.message);

  return (
    <div className="group">
      <div className="flex items-start justify-between gap-2">
        <p>
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

      <div className={`text-gray-600 mt-1.5 rounded-lg px-3 py-2 text-sm
                       border
        ${isInternal
          ? "bg-amber-50/50 border-amber-100"
          : "bg-gray-50 border-gray-100"
        }`}>
        {note.message}
      </div>
    </div>
  );
}
