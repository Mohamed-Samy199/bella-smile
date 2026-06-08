import { useRef, useState }              from "react";
import { Upload, X, ZoomIn }             from "lucide-react";
import { useMutation, useQueryClient }   from "@tanstack/react-query";
import toast                             from "react-hot-toast";
import { patientApi }                    from "../../../api/patient.api";
import { QUERY_KEYS }                    from "../../../constants/queryKeys";
import Spinner                           from "../../ui/Spinner";

export default function DocumentsTab({ patient }) {
  const [preview,      setPreview]      = useState(null);
  const [localDocs,    setLocalDocs]    = useState(patient.documents || []);
  const [deletingIds,  setDeletingIds]  = useState(new Set());
  const fileInputRef                    = useRef(null);
  const queryClient                     = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT(patient._id) });

  // ── Upload ─────────────────────────────────────────────────
  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: (formData) => patientApi.uploadDocuments(patient._id, formData),

    // Optimistic — أضيف الصور فوراً قبل الـ response
    onMutate: async (formData) => {
      const files = Array.from(formData.getAll("files"));

      const tempDocs = files.map((file, i) => ({
        _id:      `temp_${Date.now()}_${i}`,
        url:      URL.createObjectURL(file),
        isTemp:   true,
      }));

      setLocalDocs((prev) => [...prev, ...tempDocs]);
      return { tempDocs };
    },

    onSuccess: (res, _, context) => {
      // شيل الـ temp docs واستبدلهم بالـ real docs من السيرفر
      const uploaded = res.data.documents || [];

      setLocalDocs((prev) => {
        const withoutTemp = prev.filter((d) => !d.isTemp);
        return [...withoutTemp, ...uploaded];
      });

      // Cleanup الـ object URLs
      context?.tempDocs?.forEach((d) => URL.revokeObjectURL(d.url));

      toast.success(`${uploaded.length} image(s) uploaded!`);
      invalidate();
    },

    onError: (err, _, context) => {
      // لو فشل → شيل الـ temp docs
      setLocalDocs((prev) => prev.filter((d) => !d.isTemp));
      context?.tempDocs?.forEach((d) => URL.revokeObjectURL(d.url));
      toast.error(err.message || "Upload failed.");
    },
  });

  // ── Delete ─────────────────────────────────────────────────
  const { mutate: deleteDoc } = useMutation({
    mutationFn: (docId) => patientApi.deleteDocument(patient._id, docId),

    // Optimistic — أخفي الصورة فوراً
    onMutate: async (docId) => {
      const snapshot = [...localDocs];

      // أضيف الـ id للـ deleting set عشان أعرض loading
      setDeletingIds((prev) => new Set([...prev, docId]));

      // شيل الصورة من الـ UI فوراً
      setLocalDocs((prev) => prev.filter((d) => d._id !== docId));

      return { snapshot, docId };
    },

    onSuccess: (_, docId) => {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
      toast.success("Image deleted.");
      invalidate();
    },

    onError: (err, docId, context) => {
      // لو فشل → رجّع الصورة
      setLocalDocs(context.snapshot);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
      toast.error(err.message || "Delete failed.");
    },
  });

  // ── Handle Files ───────────────────────────────────────────
  const handleFiles = (files) => {
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    upload(formData);
    // reset الـ input عشان تقدر ترفع نفس الملف تاني
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Drag & Drop ────────────────────────────────────────────
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const EMPTY_SLOTS = Math.max(0, 6 - localDocs.length);

  return (
    <div className="space-y-5">

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl py-6
                    flex flex-col items-center justify-center gap-2
                    cursor-pointer transition-all bg-mainColor/10
                    ${dragging
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
                    }
                    ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading
          ? <Spinner size="md" />
          : <Upload size={24} className={dragging
              ? "text-primary-500" : "text-gray-400"} />
        }
        <p className={`text-sm font-medium
          ${dragging ? "text-primary-500" : "text-gray-500"}`}>
          {uploading
            ? "Uploading..."
            : "Drop images here or click to browse"}
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Grid */}
      {localDocs.length === 0 && !uploading ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">

          {/* Real + Temp Docs */}
          {localDocs.map((doc) => (
            <div
              key={doc._id}
              className={`relative group rounded-xl overflow-hidden
                          aspect-square bg-gray-100 transition-all
                          ${doc.isTemp ? "opacity-60 animate-pulse" : ""}
                          ${deletingIds.has(doc._id)
                            ? "opacity-30 scale-95" : ""}`}
            >
              <img
                src={doc.url}
                alt="Document"
                className="w-full h-full object-cover"
              />

              {/* Temp Badge */}
              {doc.isTemp && (
                <div className="absolute inset-0 flex items-center
                                justify-center">
                  <Spinner size="sm" />
                </div>
              )}

              {/* Hover Overlay — بس للـ real docs */}
              {!doc.isTemp && (
                <div className="absolute inset-0 bg-black/40 opacity-0
                                group-hover:opacity-100 transition
                                flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(doc.url);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white
                               p-1.5 rounded-lg transition"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(doc);
console.log(doc._id);
                      if (!window.confirm("Delete this image?")) return;
                      deleteDoc(doc._id);
                    }}
                    disabled={deletingIds.has(doc._id)}
                    className="bg-red-500 hover:bg-red-600 text-white
                               p-1.5 rounded-lg transition
                               disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: EMPTY_SLOTS }).map((_, i) => (
            <div
              key={`empty-${i}`}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-50 rounded-xl border-2
                          border-dashed border-gray-200 flex items-center
                          justify-center cursor-pointer
                          hover:border-primary-400 hover:bg-primary-50
                          transition"
            >
              <span className="text-gray-300 text-3xl">🖼</span>
            </div>
          ))}

        </div>
      )}

      {/* Count */}
      {localDocs.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {localDocs.filter((d) => !d.isTemp).length} image(s) uploaded
        </p>
      )}

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center
                     justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30
                       text-white p-2 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>
      )}

    </div>
  );
}