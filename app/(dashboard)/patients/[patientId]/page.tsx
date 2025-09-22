// app/patients/[username]/page.tsx
"use client";

import { useEffect, useState } from "react";

import { MainLayout } from "@/components/layout/main-layout";
import { PatientBanner } from "../../../../components/patient-detail/patientBanner";
import { ClinicalTabs } from "@/components/patient-detail/tabs/ClinicalTabs";
import { OverviewTab } from "@/components/patient-detail/tabs/OverviewTab";
import { PatientInfoTab } from "../../../../components/patient-detail/tabs/PatientInfoTab";
import { MedicationsTab } from "@/components/patient-detail/tabs/MedicationsTab";
import { LabsTab } from "@/components/patient-detail/tabs/LabsTab";
import { ClinicalNotesTab } from "@/components/patient-detail/tabs/ClinicalNotesTab";
import { BillingTab } from "@/components/patient-detail/tabs/BillingTab";
import { CareTeamTab } from "@/components/patient-detail/tabs/CareTeamTab";
import { ClinicalNotesDialog } from "@/components/patient-detail/dialogs/ClinicalNotesDialog";
import { OrderMedicationDialog } from "../../../../components/patient-detail/dialogs/OrderMedicationDialog";
import { OrderLabDialog } from "@/components/patient-detail/dialogs/OrderLabDialog";
import { Loader2 } from "lucide-react";
import { patientData } from "./data";

// Updated tabs with icons removed
const clinicalTabs = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Clinical Notes" },
  { id: "medications", label: "Medications" },
  { id: "labs", label: "Results Review" },
  { id: "billing", label: "Billing" },
  { id: "care-team", label: "Provider Relationships" },
  { id: "patient-info", label: "Patient Information" },
];

/**
 * Calculates age based on a date of birth string.
 * @param dobString - The date of birth string (e.g., "YYYY-MM-DD").
 * @returns The calculated age in years.
 */
const calculateAge = (dobString: string | undefined): number => {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function PatientDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isOrderMedOpen, setIsOrderMedOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);

  // Dialog states remain dynamic
  const [newNote, setNewNote] = useState({
    patientName: "John Smith", // Pre-populate with static name
    patientId: "3", // Pre-populate with static ID
    type: "",
    content: "",
    billingCodes: "",
    status: "draft",
  });

  const [newMedication, setNewMedication] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    priority: "routine",
  });

  const [newLabOrder, setNewLabOrder] = useState({
    labType: "",
    priority: "routine",
    instructions: "",
    indication: "",
  });

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            patientData={patientData}
            setIsOrderMedOpen={setIsOrderMedOpen}
            setIsOrderLabOpen={setIsOrderLabOpen}
            setIsNewNoteOpen={setIsNewNoteOpen}
          />
        );
      case "notes":
        return (
          <ClinicalNotesTab
            patientData={patientData}
            setIsNewNoteOpen={setIsNewNoteOpen}
          />
        );
      case "medications":
        return (
          <MedicationsTab
            patientData={patientData}
            setIsOrderMedOpen={setIsOrderMedOpen}
          />
        );
      case "labs":
        return (
          <LabsTab
            patientData={patientData}
            setIsOrderLabOpen={setIsOrderLabOpen}
          />
        );
      case "billing":
        return <BillingTab patientData={patientData} />;
      case "care-team":
        return <CareTeamTab patientData={patientData} />;
      case "patient-info":
        return <PatientInfoTab patientData={patientData} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <PatientBanner patientData={patientData} />

      <div className="space-y-6 md:space-y-8 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-1">
          <div className="lg:col-span-4">
            <ClinicalTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              clinicalTabs={clinicalTabs}
            />

            <div className="mt-6">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      <ClinicalNotesDialog
        isOpen={isNewNoteOpen}
        onOpenChange={setIsNewNoteOpen}
        newNote={newNote}
        setNewNote={setNewNote}
        handleCreateNote={() => console.log("Creating note:", newNote)}
      />

      <OrderMedicationDialog
        isOpen={isOrderMedOpen}
        onOpenChange={setIsOrderMedOpen}
        newMedication={newMedication}
        setNewMedication={setNewMedication}
        handleOrderMedication={() =>
          console.log("Ordering medication:", newMedication)
        }
      />

      <OrderLabDialog
        isOpen={isOrderLabOpen}
        onOpenChange={setIsOrderLabOpen}
        newLabOrder={newLabOrder}
        setNewLabOrder={setNewLabOrder}
        handleOrderLab={() => console.log("Ordering lab:", newLabOrder)}
      />
    </MainLayout>
  );
}
