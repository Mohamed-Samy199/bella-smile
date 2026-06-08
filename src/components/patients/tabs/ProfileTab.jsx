import { useState } from "react";
import { Pencil, RefreshCw, ChevronRight, ChevronDown } from "lucide-react";

import useAuthStore from "../../../store/auth.store";
import EditPatientModal from "../EditPatientModal";
import ChangePhaseModal from "../ChangePhaseModal";
import WorkflowModal from "../WorkflowModal";
import PhaseHistory from "../PhaseHistory";
import { WORKFLOW_CONFIG } from "../../../constants/workflow";
import NotesPanel from "../NotesPanel";

// ── Info Row ──────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5
                    border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── Flag Badge ────────────────────────────────────────────────
function FlagBadge({ active, label, symbol, color }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-2
                     rounded-xl border transition
      ${active
        ? color === "red"
          ? "border-red-200 bg-red-50"
          : "border-blue-200 bg-blue-50"
        : "border-mainColor bg-mainColor/40 text-gray-300"
      }`}>
      <span className={`text-lg font-bold
        ${active
          ? color === "red" ? "text-red-500" : "text-blue-500"
          : "text-darkColor"
        }`}>
        {symbol}
      </span>
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
}

export default function ProfileTab({ patient }) {
  const user = useAuthStore((s) => s.user);

  const [showEdit, setShowEdit] = useState(false);
  const [showChangePhase, setShowChangePhase] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showDoctorInfo, setShowDoctorInfo] = useState(false);


  const hasWorkflow = !!WORKFLOW_CONFIG[patient.currentPhase];
  const doctorLabel = patient.doctor
    ? `${patient.doctor.firstName} ${patient.doctor.lastName}`
    : "—";
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

  const ROW_COLOR_MAP = {
    pink: "bg-pink-300",
    yellow: "bg-yellow-300",
    purple: "bg-purple-300",
    white: "bg-white border border-gray-200",
  };

  return (
    <div className="space-y-5">

      {/* Action Buttons */}
      <div className="flex items-center gap-2 justify-end flex-wrap">

        {user?.role === "admin" && hasWorkflow && (
          <button
            onClick={() => setShowWorkflow(true)}
            className="flex items-center gap-1.5 bg-mainColor
                          hover:bg-mainColor/80 text-white text-sm
                          font-medium px-4 py-2 rounded-xl transition
                          active:scale-95"
          >
            <ChevronRight size={15} />
            Advance Phase
          </button>
        )}

        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-1.5 bg-mainColor
                        hover:bg-mainColor/80 text-white text-sm md:px-8
                        font-medium px-4 py-2 rounded-xl transition"
        >
          <Pencil size={14} />
          Edit
        </button>

        {user?.role === "admin" && (
          <button
            onClick={() => setShowChangePhase(true)}
            className="flex items-center gap-1.5 bg-mainColor
                          hover:bg-mainColor/80 text-white text-sm
                          font-medium px-4 py-2 rounded-xl transition"
          >
            <RefreshCw size={14} />
            Change Phase
          </button>
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        {/* ── Left: Patient Info ───────────────────────────── */}
        <div className="md:col-span-2 space-y-4">

          {/* Personal */}
          <div className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-sm text-gray-700 mt-0.5">
                  {patient.nationality || "N/A"}
                </p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {patient?.phone || "N/A"}
                </p>
              </div>
              {/* Row Color */}
              <div className={`w-4 h-4 rounded-full
                ${ROW_COLOR_MAP[patient.rowColor] || "bg-white"}`} />
            </div>

            {/* <InfoRow label="Doctor" value={doctorLabel} /> */}
            <div className="py-2.5 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Doctor</span>

                <button
                  type="button"
                  onClick={() => setShowDoctorInfo((prev) => !prev)}
                  className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {doctorLabel}
                  <ChevronDown
                    size={24}
                    className={`transition-transform bg-mainColor text-white rounded-sm ${showDoctorInfo ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              {showDoctorInfo && patient.doctor && (
                <div
                  className="mt-3 bg-gray-50 border border-gray-100
                 rounded-xl p-4 space-y-2"
                >
                  <div>
                    <span className="text-xs text-gray-500">Full Name</span>
                    <p className="text-sm font-medium text-gray-700">
                      {patient.doctor.firstName} {patient.doctor.lastName}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="text-sm text-gray-700">
                      {patient.doctor.email || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Phone</span>
                    <p className="text-sm text-gray-700">
                      {patient.doctor.phone || "—"}
                    </p>
                  </div>

                  

                  <div>
                    <span className="text-xs text-gray-500">City</span>
                    <p className="text-sm text-gray-700">
                      {patient.doctor.city || "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>


            <InfoRow label="Treatment" value={patient.treatment} />
            <InfoRow label="Num. Aligners" value={patient.numAligners} />
            {/* <InfoRow label="Amount"
              value={patient.amount ? `€${patient.amount}` : "—"} /> */}
            <InfoRow label="BRUX"
              value={patient.brux ? "✓ Yes" : "No"} />
            <InfoRow label="Discount"
              value={patient.sconto ? "✓ Yes" : "No"} />
            <InfoRow label="Priority"
              value={patient.priority ? "✓ Yes" : "No"} />
          </div>

          <NotesPanel patient={patient} />

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Dates
            </h3>
            <InfoRow label="Readiness Date"
              value={formatDate(patient.dataPronte)} />
            <InfoRow label="Acceptance Date"
              value={formatDate(patient.dataAccettazione)} />
          </div>

          {/* Flags */}
          <div className="bg-white rounded-2xl shadow-sm border
                           border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Flags
            </h3>
            <div className="flex gap-3">
              <FlagBadge
                active={patient.flagUrgent}
                label="Urgent"
                symbol="!"
                color="red"
              />
              <FlagBadge
                active={patient.flagQuestion}
                label="Question"
                symbol="?"
                color="blue"
              />
              <FlagBadge
                active={patient.flagStar}
                label="Star"
                symbol="★"
                color="red"
              />
            </div>
          </div>

        </div>

        {/* ── Right: Phase ─────────────────────────────────── */}
        <div className="md:col-span-2 space-y-4">

          {/* Current Phase */}
          <div className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-5">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Current Phase
            </h3>
            <span className="bg-primary-50 text-primary-600 text-md
                             font-semibold px-3 py-1.5 rounded-full">
              {patient.currentPhase}
            </span>

            {patient.eligibility && (
              <div className="mt-3">
                <span className={`text-xs font-semibold px-3 py-1
                                  rounded-full
                  ${patient.eligibility === "Suitable"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {patient.eligibility}
                </span>
              </div>
            )}
          </div>

          {/* Phase History */}
          <div className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Phase History
            </h3>
            <PhaseHistory history={patient.phaseHistory || []} />
          </div>

        </div>
      </div>

      {/* Modals */}
      <EditPatientModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        patient={patient}
      />
      <ChangePhaseModal
        isOpen={showChangePhase}
        onClose={() => setShowChangePhase(false)}
        patient={patient}
      />
      <WorkflowModal
        isOpen={showWorkflow}
        onClose={() => setShowWorkflow(false)}
        patient={patient}
      />

    </div>
  );
}