import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { patientApi } from "../../../api/patient.api";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import FormField from "../../ui/FormField";
import SubmitButton from "../../ui/SubmitButton";
import { MESI_OPTIONS, TRATTAMENTO_OPTIONS } from "../../../constants/treatment";


const PIANO_CURA_OPTIONS = ["SmileFlex", "SmilePlus"];

export default function ManagementTab({ patient }) {
  const queryClient = useQueryClient();
  const mgmt        = patient.management || {};

  const { mutate: update, isPending } = useMutation({
    mutationFn: (data) => patientApi.updateManagement(patient._id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PATIENT(patient._id),
      });

      const result = res.data.management;

      // لو اتحول لـ Not Suitable → toast مختلف
      if (result?.eligibility === "Not Suitable") {
        toast.success("Management saved — patient moved to Not Suitable.");
      } else {
        toast.success("Management updated.");
      }
    },
    onError: (e) => toast.error(e.message || "Failed."),
  });

  const formik = useFormik({
    initialValues: {
      trattamento:     mgmt.trattamento     || "",
      mesi:            mgmt.mesi            || 0,
      arcataSuperiore: mgmt.arcataSuperiore || 0,
      arcataInferiore: mgmt.arcataInferiore || 0,
      bruxismo:        mgmt.bruxismo        || false,
      preview:         mgmt.preview         || false,
      attachment:      mgmt.attachment      || false,
      stripping:       mgmt.stripping       || false,
      estrazioni:      mgmt.estrazioni      || false,
      noteValutazione: mgmt.noteValutazione || "",
      pianoCura:       mgmt.pianoCura       || "",
      eligibility:     mgmt.eligibility     || patient.eligibility || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // تحذير لو بيحول لـ Not Suitable
      if (
        values.eligibility === "Not Suitable" &&
        patient.eligibility !== "Not Suitable"
      ) {
        const confirmed = window.confirm(
          "Setting eligibility to Not Suitable will move the patient to the Not Suitable phase. Continue?"
        );
        if (!confirmed) return;
      }
      update(values);
    },
  });

  const totalAligners =
    Number(formik.values.arcataSuperiore) +
    Number(formik.values.arcataInferiore);

  const isNotSuitable = formik.values.eligibility === "Not Suitable";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">

      {/* Not Suitable Warning */}
      {isNotSuitable && patient.eligibility !== "Not Suitable" && (
        <div className="bg-red-50 border border-red-200 rounded-xl
                        px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <span className="text-base">⚠️</span>
          <p>
            Saving with <strong>Not Suitable</strong> will automatically
            move this patient to the <strong>Not Suitable</strong> phase.
          </p>
        </div>
      )}

      {/* Treatment + Months + Care Plan + Eligibility */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Treatment">
          <select name="trattamento" value={formik.values.trattamento}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500">
            <option value="">-- Select --</option>
            {TRATTAMENTO_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Months">
          <select name="mesi" value={formik.values.mesi}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500">
            <option value="">-- Select --</option>
            {MESI_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Care Plan">
          <select name="pianoCura" value={formik.values.pianoCura}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500">
            <option value="">-- Select --</option>
            {PIANO_CURA_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FormField>

        {/* Eligibility */}
        {
          patient.currentPhase === "Completed" ? 
          <FormField label="Eligibility">
          <input
            value={formik.values.eligibility || "—"}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-xl
                       px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
          />
        </FormField> 
        :
        <FormField label="Eligibility">
          <select
            name="eligibility"
            value={formik.values.eligibility}
            onChange={formik.handleChange}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm
                        bg-white focus:outline-none focus:ring-2 transition
                        ${isNotSuitable
                          ? "border-red-300 text-red-600 focus:ring-red-200"
                          : "border-gray-300 text-gray-700 focus:ring-primary-500"
                        }`}
          >
            <option value="">-- Select --</option>
            <option value="Suitable">✅ Suitable</option>
            <option value="Not Suitable">❌ Not Suitable</option>
          </select>
        </FormField>

        }
      </div>

      {/* Upper + Lower + Total */}
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Upper Arch">
          <select name="arcataSuperiore" value={formik.values.arcataSuperiore}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500">
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Lower Arch">
          <select name="arcataInferiore" value={formik.values.arcataInferiore}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                       text-sm text-gray-700 bg-white focus:outline-none
                       focus:ring-2 focus:ring-primary-500">
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </FormField>

        <div className="flex items-end">
          <div className="w-full bg-primary-50 rounded-xl px-3 py-2.5
                          text-center border border-primary-100">
            <p className="text-xs text-gray-400 mb-0.5">Total Aligners</p>
            <p className="text-2xl font-bold text-primary-600">
              {totalAligners}
            </p>
            <p className="text-xs text-gray-400">
              = {formik.values.arcataSuperiore} + {formik.values.arcataInferiore}
            </p>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "bruxismo",   label: "Bruxism"    },
          { name: "preview",    label: "Preview"    },
          { name: "attachment", label: "Attachment" },
          { name: "stripping",  label: "Stripping"  },
          { name: "estrazioni", label: "Extractions"},
        ].map(({ name, label }) => (
          <label key={name}
            className="flex items-center gap-3 bg-gray-50 rounded-xl
                       px-4 py-3 cursor-pointer">
            <input type="checkbox" name={name}
              checked={formik.values[name]}
              onChange={formik.handleChange}
              className="accent-primary-500 w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Notes */}
      <FormField label="Evaluation Notes">
        <textarea name="noteValutazione"
          value={formik.values.noteValutazione}
          onChange={formik.handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5
                     text-sm text-gray-700 focus:outline-none
                     focus:ring-2 focus:ring-primary-500 resize-none" />
      </FormField>

      <SubmitButton
        isPending={isPending}
        label={isNotSuitable && patient.eligibility !== "Not Suitable"
          ? "Save & Move to Not Suitable"
          : "Save Management"
        }
        pendingLabel="Saving..."
        className={isNotSuitable && patient.eligibility !== "Not Suitable"
          ? "bg-red-500 hover:bg-red-600"
          : ""
        }
      />

    </form>
  );
}