import { useState } from "react";
import { Trash2, CircleArrowRight, Pencil, RefreshCw, CircleArrowLeft, CreditCard, Mail } from "lucide-react";
import useAuthStore from "../../store/auth.store";
import WorkflowModal from "./WorkflowModal";
import EditPatientModal from "./EditPatientModal";
import ChangePhaseModal from "./ChangePhaseModal";
import { WORKFLOW_CONFIG } from "../../constants/workflow";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../payments/PaymentModal";
import { useSetAcceptanceDecision } from "../../hooks/patients/useSetAcceptanceDecision";
import { openStlEmail } from "../../utils/gmail.utils";
import SetCasePriceModal from "../patients/SetCasePriceModal";
import RetreatmentRequestModal from "./RetreatmentRequestModal";
import StlTransferModal from "./StlTransferModal";


const ROW_COLORS = {
  pink: "bg-pink-50",
  yellow: "bg-yellow-50",
  purple: "bg-purple-50",
  white: "bg-white",
};

const CURRENCY_SYMBOLS = { eur: "€", usd: "$", gbp: "£" };



export default function PatientRow({ patient, onDelete }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { mutate: setAcceptanceDecision } = useSetAcceptanceDecision();

  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePhase, setShowChangePhase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSetPrice, setShowSetPrice] = useState(false);
  const [showRetreatment, setShowRetreatment] = useState(false);
  const [showStlTransfer, setShowStlTransfer] = useState(false);

  const rowBg = ROW_COLORS[patient.rowColor] || "bg-white";
  const doctorLabel = patient.doctor
    ? `${patient.doctor.firstName} ${patient.doctor.lastName}`
    : "—";
  const date = patient.updatedAt
    ? new Date(patient.updatedAt).toLocaleDateString("en-GB")
    : "—";

  const hasWorkflow = !!WORKFLOW_CONFIG[patient.currentPhase];
  const symbol = CURRENCY_SYMBOLS[patient.casePrice?.currency?.toLowerCase()] || "$";

  const showSetPriceBtn =
    user?.role === "admin" &&
    patient.currentPhase === "Photographic Evaluation Verification";

  const showCasePriceForDoctor =
    user?.role === "doctor" &&
    patient.currentPhase === "Photographic Evaluation Verification" &&
    patient.casePrice?.amount;

  // Doctor في Pick Up → يظهر زرار الدفع
  const showPayBtn =
    user?.role === "doctor" &&
    patient.currentPhase === "Pick Up" &&
    !patient?.doctor?.paymentExempt;

  const showRetreatmentBtn =
    user?.role === "doctor" &&
    patient.currentPhase === "Completed" &&
    patient.retreatmentRequest?.status !== "pending";

  const mgmt = patient.management || {};
  const total = (mgmt.arcataSuperiore || mgmt.arcataInferiore)
    ? (mgmt.arcataSuperiore || 0) + (mgmt.arcataInferiore || 0)
    : null



  return (
    <>
      <tr className={`${rowBg} border-b border-gray-100 hover:brightness-95 transition`}>

        {/* Flags */}
        <td className="px-2 py-3 text-center">
          <span className={`text-sm font-bold ${patient.flagUrgent ? "text-red-500" : "text-gray-200"}`}>!</span>
        </td>
        <td className="px-2 py-3 text-center">
          <span className={`text-sm ${patient.flagQuestion ? "text-blue-400" : "text-gray-200"}`}>?</span>
        </td>
        <td className="px-2 py-3 text-center">
          <span className={`text-sm ${patient.flagStar ? "text-red-500" : "text-gray-200"}`}>★</span>
        </td>

        {/* Priority + Sconto */}
        <td className="px-2 py-3 text-center">
          <input type="checkbox" checked={patient.priority || false}
            readOnly className="accent-primary-500" />
        </td>
        <td className="px-2 py-3 text-center">
          <input type="checkbox" checked={patient.sconto || false}
            readOnly className="accent-primary-500" />
        </td>

        {/* Name */}
        <td className="px-4 py-3">
          <button
            onClick={() => navigate(`/patients/${patient._id}`)}
            className="text-primary-600 font-medium text-sm
               hover:underline text-left"
          >
            {patient.firstName} {patient.lastName}
          </button>
        </td>

        {/* Doctor */}
        <td className="px-4 py-3 text-sm text-gray-600">{doctorLabel}</td>

        {/* Aligners */}
        <td className="px-3 py-3 text-sm text-center text-gray-600">
          {total ?? 0}
        </td>

        {/* Treatment */}
        {/* <td className="px-3 py-3 text-sm text-center text-gray-600">
          {patient.treatment || "—"}
        </td> */}

        {/* Phase */}
        {
          patient.currentPhase === "Completed" ? (
            <td className="px-4 py-3 text-sm text-red-600 font-medium">
              {patient.currentPhase}
            </td>
          ) : (
            // <td className="px-4 py-3 text-sm text-gray-700">{patient.currentPhase}</td>
            <td className="px-4 py-3 text-sm text-gray-700">
              <div className="flex flex-col gap-1">
                <span>{patient.currentPhase}</span>

                {patient.acceptanceDecision === "stl" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 w-fit">
                    STL Requested
                  </span>
                )}

                {patient.acceptanceDecision === "manufacturing" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 w-fit">
                    Manufacturing
                  </span>
                )}
              </div>
            </td>
          )
        }

        {/* Date */}
        <td className="px-4 py-3 text-sm text-gray-500">{date}</td>

        <td className="px-4 py-3 text-center">
          {showCasePriceForDoctor && (
            <div
              className="
      inline-flex items-center gap-1
      md:whitespace-nowrap
      bg-blue-100 text-blue-700
      px-3 py-1.5
      rounded-lg
      text-sm font-semibold
    "
            >
              <span>Price:</span>
              <span>{symbol}{patient.casePrice.amount}</span>
            </div>
          )}


          {showSetPriceBtn && (
            <button
              onClick={() => setShowSetPrice(true)}
              className={`flex items-center gap-1 text-sm font-semibold md:whitespace-nowrap
                px-3 py-1.5 rounded-lg transition
                ${patient.casePrice?.amount
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              title="Set case price"
            >
              {patient.casePrice?.amount
                ? `Price: ${symbol}${patient.casePrice.amount}`
                : "Set Price"
              }
            </button>
          )}


          {
            (patient.currentPhase !== "Photographic Evaluation Verification") && (
              {
                stl: (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    STL
                  </span>
                ),
                manufacturing: (
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    MNF
                  </span>
                ),
                pending: (
                  <span className="text-gray-400">
                    —
                  </span>
                ),
              }[patient.acceptanceDecision]
            )
          }


        </td>

        {/* Actions */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-1.5 justify-center">
            {/* STL Request Button — يظهر في Waiting for Acceptance */}
            {/* STL Request Button */}
            {patient.currentPhase === "Waiting for Acceptance" &&
              // user?.role === "doctor" &&
               (
                <>
                  {patient.acceptanceDecision === "pending" && (
                    <>
                      <button
                        onClick={() => setAcceptanceDecision({
                          patientId: patient._id,
                          decision: "stl",
                        })}
                        className="bg-blue-500 hover:bg-blue-600 text-white
                     text-xs px-2.5 py-1.5 rounded-lg transition"
                      >
                        STL
                      </button>
                      <button
                        onClick={() => setAcceptanceDecision({
                          patientId: patient._id,
                          decision: "manufacturing",
                        })}
                        className="bg-green-500 hover:bg-green-600 text-white
                     text-xs px-2.5 py-1.5 rounded-lg transition"
                      >
                        Manufacturing
                      </button>
                    </>
                  )}

                  {/* لو اختار بالفعل → زرار Cancel بس */}
                  {(patient.acceptanceDecision === "stl" ||
                    patient.acceptanceDecision === "manufacturing") && (
                      <button
                        onClick={() => setAcceptanceDecision({
                          patientId: patient._id,
                          decision: "pending",
                        })}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs
                   px-2.5 py-1.5 rounded-lg transition"
                        title="Cancel Decision"
                      >
                        Cancel
                      </button>
                    )}
                </>
              )}

            {/* Send Mail Button */}
            {/* {
              user?.role === "admin" && (
                patient.currentPhase === "STL" &&
                patient.acceptanceDecision === "stl" &&
                patient.doctor?.email && (
                  <button
                    onClick={() => openStlEmail(patient)}
                    className="bg-mainColor hover:bg-mainColor/80 text-white rounded px-2 py-1"
                    title="Send STL Files"
                  >
                    <Mail size={14} />
                  </button>
                )
              )
            } */}
            {user?.role === "admin" &&
              patient.currentPhase === "STL" &&
              patient.doctor?.email && (
                <button
                  onClick={() => setShowStlTransfer(true)}
                  className="bg-mainColor hover:bg-mainColor/80 text-white
               rounded px-2 py-1"
                  title="Send STL via WeTransfer"
                >
                  <Mail size={14} />
                </button>
              )}


            {/* Pay Button — Doctor في Pick Up */}
            {showPayBtn && (
              <button
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-1 bg-green-500
                           hover:bg-green-600 text-white text-xs
                           font-medium px-2.5 py-1.5 rounded-lg
                           transition active:scale-95"
                title="Pay to proceed"
              >
                <CreditCard size={13} />
                Pay
              </button>
            )}



            {/* Workflow → next phase */}
            {hasWorkflow && patient.currentPhase !== "Waiting for Acceptance" && (
              <button onClick={() => setShowWorkflow(true)}
                className="text-darkColor hover:text-darkColor/70 transition"
                title="Advance Phase">
                {/* <ChevronRight size={16} /> */}
                <CircleArrowRight size={28} strokeWidth={2.2} />
              </button>
            )}
            {/* لو فيه طلب pending → بيظهر badge */}
            {user?.role === "doctor" &&
              patient.retreatmentRequest?.status === "pending" && (
                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5
                   rounded-full font-medium">
                  Pending
                </span>
              )}

            {/*Retreatment Request*/}
            {showRetreatmentBtn && (
              <button
                onClick={() => setShowRetreatment(true)}
                className="text-darkColor hover:text-text-darkColor/80 transition"
                title="Request Re-treatment"
              >
                <CircleArrowLeft size={28} strokeWidth={2.2} />
              </button>
            )}

            {/* Edit */}
            <button onClick={() => setShowEdit(true)}
              className="text-darkColor hover:text-green-500 transition"
              title="Edit">
              <Pencil size={20} strokeWidth={2.2} />
            </button>

            {/* Manual Phase Change — Admin only */}
            {user?.role === "admin" && (
              <button onClick={() => setShowChangePhase(true)}
                className="text-darkColor hover:text-amber-500 transition"
                title="Change Phase Manually">
                <RefreshCw size={20} strokeWidth={2.2} />
              </button>
            )}

            {/* Delete — Admin only */}
            {user?.role === "admin" && (
              <button onClick={() => onDelete(patient._id)}
                className="text-gray-300 hover:text-red-500 transition"
                title="Delete">
                <Trash2 size={20} strokeWidth={2.2} />
              </button>
            )}

          </div>
        </td>

      </tr>

      {/* Modals */}
      <WorkflowModal
        isOpen={showWorkflow}
        onClose={() => setShowWorkflow(false)}
        patient={patient}
      />

      <RetreatmentRequestModal
        isOpen={showRetreatment}
        onClose={() => setShowRetreatment(false)}
        patient={patient}
      />

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

      <SetCasePriceModal
        isOpen={showSetPrice}
        onClose={() => setShowSetPrice(false)}
        patient={patient}
      />

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        patient={patient}
      />

      <StlTransferModal
        isOpen={showStlTransfer}
        onClose={() => setShowStlTransfer(false)}
        patient={patient}
      />
    </>
  );
}