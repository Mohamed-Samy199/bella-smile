import BoolRow from "../ui/BoolRow";
import Row from "../ui/Row";
import SectionCard from "../ui/SectionCard";

export default function PatientSummary({ patient }) {
  const mgmt = patient.management || {};
  const lavs = patient.lavorazioni || [];

  return (
    <div className="space-y-3">
      {/* ── Printable Content ──────────────────────────────── */}
      <div id="patient-summary-print">

        {/* ── 2. Management ──────────────────────────────────── */}
        {(mgmt.trattamento || mgmt.arcataSuperiore || mgmt.arcataInferiore ||
          mgmt.mesi || mgmt.noteValutazione) && (
            <SectionCard title="Management" icon="🦷" defaultOpen={true}>
              <Row label="Treatment Type" value={mgmt.trattamento} />
              <Row label="Months" value={mgmt.mesi} />
              <Row label="Care Plan" value={mgmt.pianoCura} />
              <Row label="Upper Arch" value={mgmt.arcataSuperiore || null} />
              <Row label="Lower Arch" value={mgmt.arcataInferiore || null} />
              <Row label="Total Aligners"
                value={
                  (mgmt.arcataSuperiore || mgmt.arcataInferiore)
                    ? (mgmt.arcataSuperiore || 0) + (mgmt.arcataInferiore || 0)
                    : null
                }
                highlight="blue"
              />

              {/* Boolean flags */}
              {(mgmt.bruxismo || mgmt.preview || mgmt.attachment ||
                mgmt.stripping || mgmt.estrazioni) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <BoolRow label="Bruxism" value={mgmt.bruxismo} />
                    <BoolRow label="Preview" value={mgmt.preview} />
                    <BoolRow label="Attachment" value={mgmt.attachment} />
                    <BoolRow label="Stripping" value={mgmt.stripping} />
                    <BoolRow label="Extractions" value={mgmt.estrazioni} />
                  </div>
                )}

              {/* Case Price */}
              {patient.casePrice?.amount && (
                <Row
                  label="Case Price"
                  value={`${patient.casePrice.currency?.toUpperCase()} ${patient.casePrice.amount}`}
                  highlight="blue"
                />
              )}

              {/* {mgmt.noteValutazione && (
              <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-500 mb-0.5 font-medium">
                  Evaluation Notes
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {mgmt.noteValutazione}
                </p>
              </div>
            )} */}
            </SectionCard>
          )}


        {/* ── 4. Processing Summary ─────────────────────────── */}
        {lavs.length > 0 && (
          <SectionCard title={`Processing (${lavs.length} rows)`}
            icon="⚙️" defaultOpen={true}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs mt-1">
                <thead>
                  <tr className="bg-gray-50">
                    {["#", "Jaw", "Spessore", "Taglio", "Val",
                      "Bottoni", "Date", "✓"].map((h) => (
                        <th key={h}
                          className="text-left px-2 py-1.5 text-gray-500
                                     font-medium border-b border-gray-100">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {lavs.map((lav, i) => (
                    <tr key={lav._id || i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-2 py-1.5 text-gray-700 font-medium">
                        {lav.number}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600 capitalize">
                        {lav.jaw}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600">
                        {lav.spessore || "—"}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600">
                        {lav.taglio || "—"}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600">
                        {lav.val || "—"}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600">
                        {lav.bottoni || "—"}
                      </td>
                      <td className="px-2 py-1.5 text-gray-400">
                        {lav.data
                          ? new Date(lav.data).toLocaleDateString("en-GB")
                          : "—"
                        }
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        {lav.checked
                          ? <span className="text-green-500">✓</span>
                          : <span className="text-gray-300">○</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}


        {/* ── 3. Care Plan ──────────────────────────────────── */}
        {(mgmt.arcataSuperiore || mgmt.arcataInferiore ||
          mgmt.trattamento) && (
            <SectionCard title="Care Plan" icon="📋" defaultOpen={true}>
              {mgmt.attachmentTeeth?.length > 0 && (
                <div className="mt-2">
                  <p className="text-base text-gray-800 mb-1">Attachment Teeth</p>
                  <div className="flex flex-wrap gap-1">
                    {mgmt.attachmentTeeth.map((t) => (
                      <span key={t}
                        className="bg-mainColor/10 border-mainColor text-mainColor text-xs
                        border-2 transition active:scale-95
                                     font-bold w-9 h-9 rounded-full flex items-center justify-center">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* {mgmt.note && (
                <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-xs text-gray-500 mb-0.5 font-medium">Notes</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {mgmt.note}
                  </p>
                </div>
              )} */}
            </SectionCard>
          )}

      </div>
    </div>
  );
}