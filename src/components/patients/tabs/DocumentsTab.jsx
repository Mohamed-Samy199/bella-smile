import { useRef, useState, useEffect } from "react";
import {
  Upload, X, ZoomIn, FileText,
  Link, ExternalLink, Save, Image
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { patientApi } from "../../../api/patient.api";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import Spinner from "../../ui/Spinner";

export default function DocumentsTab({ patient }) {
  const [preview, setPreview] = useState(null);
  const [localDocs, setLocalDocs] = useState(patient.documents || []);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [previewLink, setPreviewLink] = useState(patient.previewLink || "");
  const [linkEditing, setLinkEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("photos"); // photos | pdfs
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // sync لما الـ patient يتحدث
  useEffect(() => {
    setLocalDocs(patient.documents || []);
    setPreviewLink(patient.previewLink || "");
  }, [patient._id]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT(patient._id) });

  // ── Upload ─────────────────────────────────────────────────
  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: (formData) => patientApi.uploadDocuments(patient._id, formData),

    onMutate: async (formData) => {
      const files = Array.from(formData.getAll("files"));
      const tempDocs = files.map((file, i) => ({
        _id: `temp_${Date.now()}_${i}`,
        url: file.type === "application/pdf"
          ? null
          : URL.createObjectURL(file),
        fileName: file.originalname || file.name,
        mimeType: file.type,
        isTemp: true,
      }));
      setLocalDocs((prev) => [...prev, ...tempDocs]);
      return { tempDocs };
    },

    onSuccess: (res, _, context) => {
      const uploaded = res.data.documents || [];
      setLocalDocs((prev) => {
        const withoutTemp = prev.filter((d) => !d.isTemp);
        return [...withoutTemp, ...uploaded];
      });
      context?.tempDocs?.forEach((d) => {
        if (d.url) URL.revokeObjectURL(d.url);
      });
      toast.success(`${uploaded.length} file(s) uploaded!`);
      invalidate();
    },

    onError: (err, _, context) => {
      setLocalDocs((prev) => prev.filter((d) => !d.isTemp));
      context?.tempDocs?.forEach((d) => {
        if (d.url) URL.revokeObjectURL(d.url);
      });
      toast.error(err.message || "Upload failed.");
    },
  });

  // ── Delete ─────────────────────────────────────────────────
  const { mutate: deleteDoc } = useMutation({
    mutationFn: (docId) => patientApi.deleteDocument(patient._id, docId),

    onMutate: async (docId) => {
      const snapshot = [...localDocs];
      setDeletingIds((prev) => new Set([...prev, docId]));
      setLocalDocs((prev) => prev.filter((d) => d._id !== docId));
      return { snapshot, docId };
    },

    onSuccess: (_, docId) => {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
      toast.success("File deleted.");
      invalidate();
    },

    onError: (err, docId, context) => {
      setLocalDocs(context.snapshot);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
      toast.error(err.message || "Delete failed.");
    },
  });

  // ── Preview Link ───────────────────────────────────────────
  const { mutate: saveLink, isPending: savingLink } = useMutation({
    mutationFn: (link) => patientApi.updatePreviewLink(patient._id, link),
    onSuccess: () => {
      setLinkEditing(false);
      invalidate();
      toast.success("Preview link saved.");
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  // ── Helpers ────────────────────────────────────────────────
  const handleFiles = (files) => {
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    upload(formData);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [dragging, setDragging] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isPdf = (doc) => doc.mimeType === "application/pdf"
    || doc.fileName?.toLowerCase().endsWith(".pdf");
  const isImage = (doc) => !isPdf(doc);

  const photos = localDocs.filter(isImage);
  const pdfs = localDocs.filter(isPdf);

  const EMPTY_SLOTS = Math.max(0, 6 - photos.length);

  return (
    <div className="space-y-5">

      {/* ── Preview Link ──────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link size={15} className="text-primary-500" />
          <p className="text-sm font-semibold text-gray-700">Preview Link</p>
        </div>

        {linkEditing ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={previewLink}
              onChange={(e) => setPreviewLink(e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-300 transition"
            />
            <button
              onClick={() => saveLink(previewLink)}
              disabled={savingLink}
              className="flex items-center gap-1.5 bg-mainColor
                         hover:bg-mainColor/80 text-white text-sm
                         font-medium px-3 py-2 rounded-xl transition
                         disabled:opacity-60"
            >
              {savingLink
                ? <Spinner size="sm" color="white" />
                : <Save size={14} />
              }
              Save
            </button>
            <button
              onClick={() => {
                setPreviewLink(patient.previewLink || "");
                setLinkEditing(false);
              }}
              className="border border-gray-200 text-gray-500 text-sm
                         px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        ) : patient.previewLink ? (
          <div className="flex items-center gap-2">

            <a href={patient.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary-600
                         hover:underline text-sm font-medium flex-1 truncate"
            >
              <ExternalLink size={13} />
              {patient.previewLink}
            </a>
            <button
              onClick={() => setLinkEditing(true)}
              className="text-xs bg-mainColor text-white hover:text-mainColor/80
                         border border-mainColor px-2 py-1 rounded-lg
                         transition shrink-0"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLinkEditing(true)}
            className="text-sm text-primary-500 hover:text-primary-700
                       flex items-center gap-1.5 transition"
          >
            <Link size={13} />
            Add preview link...
          </button>
        )}
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100">
        {[
          {
            id: "photos", label: (
              <div className="flex items-center gap-1">
                <Image size={13} />
                <span>Patient Photos ({photos.length})</span>
              </div>
            )
          },
          {
            id: "pdfs",
            label: (
              <div className="flex items-center gap-1">
                <FileText size={13} />
                <span>Treatment Plan ({pdfs.length})</span>
              </div>
            )
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px
                        transition
              ${activeTab === tab.id
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Upload Zone ───────────────────────────────────── */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl py-5 flex
                    flex-col items-center justify-center gap-2 cursor-pointer
                    transition-all bg-mainColor/5
                    ${dragging
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
          }
                    ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading
          ? <Spinner size="md" />
          : <Upload size={22} className={dragging
            ? "text-primary-500" : "text-gray-400"} />
        }
        <p className={`text-sm font-medium
          ${dragging ? "text-primary-500" : "text-gray-500"}`}>
          {uploading ? "Uploading..." : "Drop files here or click to browse"}
        </p>
        <p className="text-xs text-gray-400">
          PNG, JPG, WEBP, PDF — Max 100MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* ── Photos Grid ───────────────────────────────────── */}
      {activeTab === "photos" && (
        <>
          {photos.length === 0 && !uploading ? (
            <p className="text-center text-gray-400 text-sm py-6">
              No photos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((doc) => (
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
                  {doc.isTemp && (
                    <div className="absolute inset-0 flex items-center
                                    justify-center">
                      <Spinner size="sm" />
                    </div>
                  )}
                  {!doc.isTemp && (
                    <div className="absolute inset-0 bg-black/40 opacity-0
                                    group-hover:opacity-100 transition flex
                                    items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreview(doc.url); }}
                        className="bg-white/20 hover:bg-white/30 text-white
                                   p-1.5 rounded-lg transition"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!window.confirm("Delete this image?")) return;
                          deleteDoc(doc._id);
                        }}
                        disabled={deletingIds.has(doc._id)}
                        className="bg-red-500 hover:bg-red-600 text-white
                                   p-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
          {photos.filter((d) => !d.isTemp).length > 0 && (
            <p className="text-xs text-gray-400 text-right">
              {photos.filter((d) => !d.isTemp).length} photo(s)
            </p>
          )}
        </>
      )}

      {/* ── PDFs List ─────────────────────────────────────── */}
      {activeTab === "pdfs" && (
        <>
          {pdfs.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">
              No PDFs uploaded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {pdfs.map((doc) => (
                <div
                  key={doc._id}
                  className={`flex items-center gap-3 bg-gray-50 border
                              border-gray-100 rounded-xl px-4 py-3 transition
                              ${doc.isTemp ? "opacity-60 animate-pulse" : ""}
                              ${deletingIds.has(doc._id)
                      ? "opacity-30" : ""}`}
                >
                  <FileText size={20} className="text-red-400 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {doc.fileName || "document.pdf"}
                    </p>
                    {doc.size && (
                      <p className="text-xs text-gray-400">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>

                  {!doc.isTemp && (
                    <div className="flex items-center gap-2 shrink-0">

                      <a href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-700
                                   p-1.5 rounded-lg hover:bg-primary-50
                                   transition"
                        title="Open PDF"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        onClick={() => {
                          if (!window.confirm("Delete this PDF?")) return;
                          deleteDoc(doc._id);
                        }}
                        disabled={deletingIds.has(doc._id)}
                        className="text-gray-300 hover:text-red-500 p-1.5
                                   rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        <X size={15} className="text-red-400 shrink-0" />
                      </button>
                    </div>
                  )}

                  {doc.isTemp && (
                    <Spinner size="sm" />
                  )}
                </div>
              ))}
            </div>
          )}
          {pdfs.filter((d) => !d.isTemp).length > 0 && (
            <p className="text-xs text-gray-400 text-right">
              {pdfs.filter((d) => !d.isTemp).length} PDF(s)
            </p>
          )}
        </>
      )}

      {/* ── Photo Preview Modal ────────────────────────────── */}
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
