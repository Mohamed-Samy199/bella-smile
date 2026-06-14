// src/components/patients/StlTransferModal.jsx
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Modal from "../ui/Modal";

export default function StlTransferModal({ isOpen, onClose, patient }) {
  const [copied, setCopied] = useState({});

  const doctor = patient?.doctor;

  const fields = [
    {
      id:    "email",
      label: "Recipient Email",
      value: doctor?.email || "—",
    },
    {
      id:    "subject",
      label: "Transfer Title",
      value: `STL Files - ${patient?.firstName} ${patient?.lastName}`,
    },
    {
      id:    "message",
      label: "Message",
      value:
`Dear Dr. ${doctor?.firstName} ${doctor?.lastName},

Please find the STL files for the following patient:

Patient: ${patient?.firstName} ${patient?.lastName}

Kind regards,
Bella Smile Team`,
    },
  ];

  const copyField = (id, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [id]: true }));
    setTimeout(
      () => setCopied((prev) => ({ ...prev, [id]: false })),
      2000
    );
  };

  const copyAll = () => {
    const text = fields.map((f) => `${f.label}:\n${f.value}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied({ all: true });
    setTimeout(() => setCopied({}), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}
           title="Send STL via WeTransfer" size="md">
      <div className="space-y-4">

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">
            {patient?.firstName} {patient?.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Doctor: {doctor?.firstName} {doctor?.lastName}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl
                        px-4 py-3 text-xs text-blue-700 space-y-1">
          <p className="font-semibold">📋 Steps:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Copy each field below</li>
            <li>Open WeTransfer</li>
            <li>Upload the STL files</li>
            <li>Paste the email and message</li>
            <li>Send</li>
          </ol>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-500
                                  uppercase tracking-wide">
                  {field.label}
                </label>
                <button
                  onClick={() => copyField(field.id, field.value)}
                  className={`flex items-center gap-1 text-xs px-2 py-1
                              rounded-lg transition
                              ${copied[field.id]
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                >
                  {copied[field.id]
                    ? <><Check size={11} /> Copied</>
                    : <><Copy size={11} /> Copy</>
                  }
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl
                              px-3 py-2 text-sm text-gray-700 whitespace-pre-wrap
                              font-mono text-xs leading-relaxed select-all">
                {field.value}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={copyAll}
            className={`flex-1 flex items-center justify-center gap-2
                        border py-2.5 rounded-xl text-sm font-medium
                        transition
                        ${copied.all
                          ? "border-green-300 bg-green-50 text-green-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
          >
            {copied.all
              ? <><Check size={14} /> All Copied</>
              : <><Copy size={14} /> Copy All</>
            }
          </button>

          
           <a href="https://wetransfer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2
                       bg-mainColor hover:bg-mainColor/80 text-white
                       py-2.5 rounded-xl text-sm font-semibold transition
                       active:scale-95"
          >
            <ExternalLink size={14} />
            Open WeTransfer
          </a>
        </div>

      </div>
    </Modal>
  );
}