import { useState }                    from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast                           from "react-hot-toast";
import { patientApi }                  from "../../../api/patient.api";
import { QUERY_KEYS }                  from "../../../constants/queryKeys";
import SubmitButton                    from "../../ui/SubmitButton";
import { LOWER_TEETH, MESI_OPTIONS, TRATTAMENTO_OPTIONS, UPPER_TEETH } from "../../../constants/treatment";




function ToothDiagram({ title, teeth, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase
                    tracking-wide mb-3 text-center">
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {teeth.map((tooth) => {
          const isSelected = selected.includes(tooth);
          return (
            <button
              key={tooth}
              type="button"
              onClick={() => onToggle(tooth)}
              className={`w-9 h-9 rounded-full text-xs font-semibold
                          border-2 transition active:scale-95
                          ${isSelected
                            ? "bg-mainColor/10 border-mainColor text-mainColor"
                            : "bg-white border-gray-300 text-gray-500 hover:border-primary-400"
                          }`}
            >
              {tooth}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Radio Group ───────────────────────────────────────────────
function RadioGroup({ label, name, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <div className="flex gap-4">
        {["Yes", "No"].map((opt) => (
          <label key={opt}
                 className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === (opt === "Yes")}
              onChange={() => onChange(opt === "Yes")}
              className="accent-primary-500 w-4 h-4"
            />
            <span className="text-sm text-gray-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CarePlanTab({ patient }) {
  const queryClient = useQueryClient();
  const mgmt = patient.management || {};
  const [form, setForm] = useState({
    arcataSuperiore: mgmt.arcataSuperiore  || 0,
    arcataInferiore: mgmt.arcataInferiore  || 0,
    trattamento:     mgmt.trattamento      || "",
    mesi:            mgmt.mesi             || "",
    attachment:      mgmt.attachment       || false,
    estrazioni:      mgmt.estrazioni       || false,
    stripping:       mgmt.stripping        || false,
    attachmentTeeth: mgmt.attachmentTeeth  || [],
    note:            mgmt.noteValutazione  || "",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const totale = Number(form.arcataSuperiore) + Number(form.arcataInferiore);

  // Toggle tooth selection
  const toggleTooth = (tooth) => {
    set("attachmentTeeth",
      form.attachmentTeeth.includes(tooth)
        ? form.attachmentTeeth.filter((t) => t !== tooth)
        : [...form.attachmentTeeth, tooth]
    );
  };

  const { mutate: update, isPending } = useMutation({
    // ✅ بعث لـ updateManagement مش updateCarePlan
    mutationFn: (data) => patientApi.updateManagement(patient._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT(patient._id) });
      toast.success("Care plan saved.");
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    update({
      arcataSuperiore: form.arcataSuperiore,
      arcataInferiore: form.arcataInferiore,
      trattamento:     form.trattamento,
      mesi:            form.mesi,
      attachment:      form.attachment,
      estrazioni:      form.estrazioni,
      stripping:       form.stripping,
      attachmentTeeth: form.attachmentTeeth,
      noteValutazione: form.note,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Arcata + Total */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Upper Arch
          </label>
          <select
            value={form.arcataSuperiore}
            onChange={(e) => set("arcataSuperiore", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Lower Arch
          </label>
          <select
            value={form.arcataInferiore}
            onChange={(e) => set("arcataInferiore", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <div className="w-full bg-primary-50 rounded-xl px-3 py-2.5
                          text-center">
            <p className="text-xs text-gray-400">Total Aligners</p>
            <p className="text-2xl font-bold text-primary-600">{totale}</p>
          </div>
        </div>
      </div>

      {/* Trattamento + Mesi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Treatment
          </label>
          <select
            value={form.trattamento}
            onChange={(e) => set("trattamento", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Select --</option>
            {TRATTAMENTO_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Months</label>
          <select
            value={form.mesi}
            onChange={(e) => set("mesi", Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Select --</option>
            {MESI_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Radio Groups */}
      <div className="grid grid-cols-3 gap-6">
        <RadioGroup
          label="Attachment"
          name="attachment"
          value={form.attachment}
          onChange={(v) => set("attachment", v)}
        />
        <RadioGroup
          label="Extractions"
          name="estrazioni"
          value={form.estrazioni}
          onChange={(v) => set("estrazioni", v)}
        />
        <RadioGroup
          label="Stripping"
          name="stripping"
          value={form.stripping}
          onChange={(v) => set("stripping", v)}
        />
      </div>

      {/* Tooth Diagram */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-600">
          Indicate Attachment Teeth
        </p>
        <p className="text-xs text-gray-400">
          Click on teeth to select/deselect attachment positions.
          Selected: {form.attachmentTeeth.length} teeth
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 space-y-6">
          <ToothDiagram
            title="Upper Arch"
            teeth={UPPER_TEETH}
            selected={form.attachmentTeeth}
            onToggle={toggleTooth}
          />
          <ToothDiagram
            title="Lower Arch"
            teeth={LOWER_TEETH}
            selected={form.attachmentTeeth}
            onToggle={toggleTooth}
          />
        </div>

        {/* Selected teeth summary */}
        {form.attachmentTeeth.length > 0 && (
          <div className="bg-primary-50 rounded-xl px-4 py-2">
            <p className="text-xs text-primary-600">
              <span className="font-semibold">Selected: </span>
              {[...form.attachmentTeeth].sort((a,b) => a-b).join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Notes (indicate stripping)
        </label>
        <textarea
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          rows={4}
          placeholder="Indicate stripping..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                     text-sm text-gray-700 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-primary-500
                     resize-none"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <SubmitButton
          isPending={isPending}
          label="Save Care Plan"
          pendingLabel="Saving..."
        />
      </div>

    </form>
  );
}