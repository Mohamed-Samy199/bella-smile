import { useState }                    from "react";
import { Plus, Trash2, Save }          from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../../api/patient.api";
import { QUERY_KEYS }                  from "../../../constants/queryKeys";

const SPESSORE_OPTIONS = ["soft05", "05 light", "75 medium", "1 strong", "1.5 Xstrong"];
const TAGLIO_OPTIONS   = ["normal", "straight"];
const VAL_OPTIONS      = ["bruxist", "check"];

// ── Single Row ────────────────────────────────────────────────
function LavRow({ item, onUpdate, onDelete }) {
  const [local, setLocal] = useState({ ...item });
  const isDirty = JSON.stringify(local) !== JSON.stringify(item);

  const set = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition">

      {/* Number */}
      <td className="px-3 py-2 text-sm text-gray-600 text-center font-medium">
        {item.number}
      </td>

      {/* Checked */}
      <td className="px-3 py-2 text-center">
        <input
          type="checkbox"
          checked={local.checked}
          onChange={(e) => set("checked", e.target.checked)}
          className="accent-primary-500 w-4 h-4"
        />
      </td>

      {/* Spessore */}
      <td className="px-3 py-2">
        <select
          value={local.spessore || ""}
          onChange={(e) => set("spessore", e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1.5
                     text-xs text-gray-700 bg-white focus:outline-none
                     focus:ring-1 focus:ring-primary-500 w-full"
        >
          <option value="">—</option>
          {SPESSORE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </td>

      {/* Taglio */}
      <td className="px-3 py-2">
        <select
          value={local.taglio || ""}
          onChange={(e) => set("taglio", e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1.5
                     text-xs text-gray-700 bg-white focus:outline-none
                     focus:ring-1 focus:ring-primary-500 w-full"
        >
          <option value="">—</option>
          {TAGLIO_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </td>

      {/* Val */}
      <td className="px-3 py-2">
        <select
          value={local.val || ""}
          onChange={(e) => set("val", e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1.5
                     text-xs text-gray-700 bg-white focus:outline-none
                     focus:ring-1 focus:ring-primary-500 w-full"
        >
          <option value="">—</option>
          {VAL_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </td>

      {/* Bottoni */}
      <td className="px-3 py-2">
        <textarea
          value={local.bottoni || ""}
          onChange={(e) => set("bottoni", e.target.value)}
          rows={1}
          className="border border-gray-200 rounded-lg px-2 py-1.5
                     text-xs text-gray-700 focus:outline-none
                     focus:ring-1 focus:ring-primary-500 w-full
                     resize-none min-w-[80px]"
        />
      </td>

      {/* Date */}
      <td className="px-3 py-2">
        <input
          type="date"
          value={local.data
            ? new Date(local.data).toISOString().split("T")[0]
            : ""}
          onChange={(e) => set("data", e.target.value || null)}
          className="border border-gray-200 rounded-lg px-2 py-1.5
                     text-xs text-gray-700 focus:outline-none
                     focus:ring-1 focus:ring-primary-500"
        />
      </td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-1.5 justify-center">
          {isDirty && (
            <button
              onClick={() => onUpdate(item._id, local)}
              className="text-mainColor hover:text-mainColor/80
                         transition p-1 rounded"
              title="Save"
            >
              <Save size={14} />
            </button>
          )}
          <button
            onClick={() => {
              if (!window.confirm("Delete this row?")) return;
              onDelete(item._id);
            }}
            className="text-gray-300 hover:text-red-500 transition
                       p-1 rounded"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>

    </tr>
  );
}

// ── Add Row Modal ─────────────────────────────────────────────
function AddRowModal({ isOpen, onClose, onAdd, jaw }) {
  const [form, setForm] = useState({
    number: "", checked: false, spessore: "",
    taglio: "", val: "", bottoni: "", data: "",
  });

  if (!isOpen) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center
                    justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6
                      space-y-4">
        <h3 className="font-semibold text-gray-800">
          Add {jaw === "superiore" ? "Upper" : "Lower"} Row
        </h3>

        {/* Number */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Number *</label>
          <input type="number" value={form.number}
            onChange={(e) => set("number", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-3 py-2
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500" />
        </div>

        {/* Spessore + Taglio + Val */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "spessore", label: "Spessore", opts: SPESSORE_OPTIONS },
            { key: "taglio",   label: "Taglio",   opts: TAGLIO_OPTIONS   },
            { key: "val",      label: "Val",      opts: VAL_OPTIONS      },
          ].map(({ key, label, opts }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <select value={form[key]} onChange={(e) => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-2 py-2
                           text-xs bg-white focus:outline-none
                           focus:ring-2 focus:ring-primary-500">
                <option value="">—</option>
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Bottoni */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Notes</label>
          <textarea value={form.bottoni}
            onChange={(e) => set("bottoni", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-xl px-3 py-2
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500 resize-none" />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Date</label>
          <input type="date" value={form.data}
            onChange={(e) => set("data", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500" />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600
                       py-2.5 rounded-xl text-sm font-medium
                       hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.number) { alert("Number is required."); return; }
              onAdd({ ...form, jaw });
              setForm({ number: "", checked: false, spessore: "",
                        taglio: "", val: "", bottoni: "", data: "" });
              onClose();
            }}
            className="flex-1 bg-mainColor hover:bg-mainColor/80
                       text-white py-2.5 rounded-xl text-sm font-semibold
                       transition active:scale-95">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section (Superiore / Inferiore) ───────────────────────────
function JawSection({ title, jaw, rows, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-gray-500 uppercase
                       tracking-widest">
          {title}
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-mainColor
                     hover:bg-mainColor/80 text-white text-xs font-medium
                     px-3 py-1.5 rounded-lg transition active:scale-95"
        >
          <Plus size={13} /> Add Row
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">
          No rows yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["n.", "Ck", "Spessore", "Taglio", "Val.", "Notes", "Date", ""].map((h) => (
                  <th key={h}
                      className="px-3 py-2.5 text-xs font-semibold
                                 text-primary-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <LavRow
                  key={row._id}
                  item={row}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddRowModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={onAdd}
        jaw={jaw}
      />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ProcessingTab({ patient }) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT(patient._id) });

  const { mutate: addRow }    = useMutation({
    mutationFn: (data) => patientApi.addLavorazione(patient._id, data),
    onSuccess:  () => { invalidate(); toast.success("Row added."); },
    onError:    (e) => toast.error(e.message || "Failed."),
  });

  const { mutate: updateRow } = useMutation({
    mutationFn: ({ lavId, data }) =>
      patientApi.updateLavorazione(patient._id, lavId, data),
    onSuccess:  () => { invalidate(); toast.success("Row saved."); },
    onError:    (e) => toast.error(e.message || "Failed."),
  });

  const { mutate: deleteRow } = useMutation({
    mutationFn: (lavId) => patientApi.deleteLavorazione(patient._id, lavId),
    onSuccess:  () => { invalidate(); toast.success("Row deleted."); },
    onError:    (e) => toast.error(e.message || "Failed."),
  });

  const lav       = patient.lavorazioni || [];
  const upper = lav.filter((r) => r.jaw === "upper");
  const lower = lav.filter((r) => r.jaw === "lower");

  return (
    <div className="space-y-8">

      {/* Patient Header */}
      <div className="text-sm text-gray-500 space-y-0.5">
        <p>
          <span className="text-gray-400">Patient: </span>
          <span className="font-medium text-gray-700">
            {patient.firstName} {patient.lastName}
          </span>
        </p>
        <p>
          <span className="text-gray-400">Doctor: </span>
          <span className="font-medium text-gray-700">
            {patient.doctor?.firstName} {patient.doctor?.lastName}
          </span>
        </p>
      </div>

      {/* Upper Arch */}
      <JawSection
        title="Upper"
        jaw="upper"
        rows={upper}
        onAdd={(data) => addRow(data)}
        onUpdate={(lavId, data) => updateRow({ lavId, data })}
        onDelete={(lavId) => deleteRow(lavId)}
      />

      <hr className="border-gray-100" />

      {/* Lower Arch */}
      <JawSection
        title="Lower"
        jaw="lower"
        rows={lower}
        onAdd={(data) => addRow(data)}
        onUpdate={(lavId, data) => updateRow({ lavId, data })}
        onDelete={(lavId) => deleteRow(lavId)}
      />

    </div>
  );
}