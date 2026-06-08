import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePatient } from "../../hooks/patients/usePatient";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import useAuthStore from "../../store/auth.store";

// ── Tabs ──────────────────────────────────────────────────────
import ProfileTab from "../../components/patients/tabs/ProfileTab";
import DocumentsTab from "../../components/patients/tabs/DocumentsTab";
import ManagementTab from "../../components/patients/tabs/ManagementTab";
import ProcessingTab from "../../components/patients/tabs/ProcessingTab";
import CarePlanTab from "../../components/patients/tabs/CarePlanTab";
import HistoryTab from "../../components/patients/tabs/HistoryTab";

const TABS = [
  { id: "profile", label: "Profile", roles: ["admin", "doctor"] },
  { id: "documents", label: "Documents", roles: ["admin", "doctor"] },
  { id: "management", label: "Management", roles: ["admin", "doctor"] },
  { id: "processing", label: "Processing", roles: ["admin"] },
  { id: "care-plan", label: "Care Plan", roles: ["admin"] },
  { id: "history", label: "History", roles: ["admin", "doctor"] },
];

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("profile");

  const { data: patient, isLoading, isError } = usePatient(id);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );

  if (isError || !patient) return (
    <EmptyState
      icon="⚠️"
      title="Patient not found"
      action={{ label: "Go Back", onClick: () => navigate(-1) }}
    />
  );

  const visibleTabs = TABS.filter((t) => t.roles.includes(user?.role));

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab patient={patient} />;
      case "documents": return <DocumentsTab patient={patient} />;
      case "management": return <ManagementTab patient={patient} />;
      case "processing": return <ProcessingTab patient={patient} />;
      case "care-plan": return <CarePlanTab patient={patient} />;
      case "history": return <HistoryTab patient={patient} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400
                   hover:text-gray-600 transition text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Tabs Header */}
      <div className="bg-white rounded-2xl shadow-sm border
                      border-gray-100 overflow-hidden">
        <div
          className="flex overflow-x-auto overflow-y-hidden border-b border-gray-100">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap
                          transition border-b-2 -mb-px
                          ${activeTab === tab.id
                  ? "border-primary-500 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTab()}
        </div>
      </div>

    </div>
  );
};