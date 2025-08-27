// app/patients/[username]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchPatientByUsername } from "../../../redux/features/patients/patientActions";
import MainLayout from "@/components/layout/main-layout";
import { PatientBanner } from "@/components/patient-detail/PatientBanner";
import { ClinicalTabs } from "@/components/patient-detail/tabs/ClinicalTabs";
import { OverviewTab } from "@/components/patient-detail/tabs/OverviewTab";
import { MedicationsTab } from "@/components/patient-detail/tabs/MedicationsTab";
import { LabsTab } from "@/components/patient-detail/tabs/LabsTab";
import { ClinicalNotesTab } from "@/components/patient-detail/tabs/ClinicalNotesTab";
import { VitalsTab } from "@/components/patient-detail/tabs/VitalsTab";
import { ImagingTab } from "@/components/patient-detail/tabs/ImagingTab";
import { BillingTab } from "@/components/patient-detail/tabs/BillingTab";
import { ClinicalNotesDialog } from "@/components/patient-detail/dialogs/ClinicalNotesDialog";
import { OrderMedicationDialog } from "@/components/patient-detail/dialogs/OrderMedicationDialog";
import { OrderLabDialog } from "@/components/patient-detail/dialogs/OrderLabDialog";
import {
  Loader2,
  LayoutDashboard,
  Pill,
  FlaskConical,
  FileText,
  HeartPulse,
  Scan,
  CreditCard,
} from "lucide-react";
import { patientData } from "./data";

// Static data for UI elements like tabs, now with icons
const clinicalTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "labs", label: "Lab Results", icon: FlaskConical },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "vitals", label: "Vitals", icon: HeartPulse },
  { id: "imaging", label: "Imaging", icon: Scan },
  { id: "billing", label: "Billing", icon: CreditCard },
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
  const params = useParams<{ username: string }>();
  const username = params.username;

  const dispatch = useDispatch<AppDispatch>();
  const { selectedPatient, loading, error } = useSelector(
    (state: RootState) => state.patient
  );

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

  useEffect(() => {
    // We still fetch the patient to ensure the component's loading/error/found states work correctly.
    // The UI will use the hardcoded data below.
    if (username) {
      dispatch(fetchPatientByUsername(username));
    }
  }, [dispatch, username]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
          <span className="ml-4 text-lg">Loading Patient Details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600">
          <h2 className="text-xl font-bold">Error Fetching Patient</h2>
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  // This check ensures we don't render until Redux confirms a patient was found,
  // even though we're about to use hardcoded data for the display.
  if (!selectedPatient) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-gray-600">
          <h2 className="text-xl font-bold">Patient Not Found</h2>
          <p>The requested patient could not be found.</p>
        </div>
      </MainLayout>
    );
  }

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
      case "notes":
        return (
          <ClinicalNotesTab
            patientData={patientData}
            setIsNewNoteOpen={setIsNewNoteOpen}
          />
        );
      case "vitals":
        return <VitalsTab patientData={patientData} />;
      case "imaging":
        return <ImagingTab patientData={patientData} />;
      case "billing":
        return <BillingTab patientData={patientData} />;
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
