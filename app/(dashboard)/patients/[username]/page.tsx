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
import { PatientInfoTab } from "@/components/patient-detail/tabs/PatientInfoTab";
import { MedicationsTab } from "@/components/patient-detail/tabs/MedicationsTab";
import { LabsTab } from "@/components/patient-detail/tabs/LabsTab";
import { ClinicalNotesTab } from "@/components/patient-detail/tabs/ClinicalNotesTab";
import { BillingTab } from "@/components/patient-detail/tabs/BillingTab";
import { CareTeamTab } from "../../../../components/patient-detail/tabs/CareTeamTab";
import { ClinicalNotesDialog } from "@/components/patient-detail/dialogs/ClinicalNotesDialog";
import { OrderMedicationDialog } from "@/components/patient-detail/dialogs/OrderMedicationDialog";
import { OrderLabDialog } from "@/components/patient-detail/dialogs/OrderLabDialog";
import {
  Loader2,
  LayoutDashboard,
  User,
  Pill,
  FlaskConical,
  FileText,
  CreditCard,
  Users,
} from "lucide-react";
import { patientData } from "./data";

// Updated tabs with new order and icons
const clinicalTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "labs", label: "Results Review", icon: FlaskConical },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "care-team", label: "Provider Relationships", icon: Users },
  { id: "patient-info", label: "Patient Information", icon: User },
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

  // Clinical notes Redux state
  const clinicalNotesState = useSelector(
    (state: RootState) => state.clinicalNotes
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isOrderMedOpen, setIsOrderMedOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);

  // Dialog states remain dynamic for backward compatibility
  const [newNote, setNewNote] = useState({
    patientName: "", // Will be populated from selected patient
    patientId: "", // Will be populated from selected patient
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
    if (username) {
      console.log("Fetching patient data for username:", username);
      dispatch(fetchPatientByUsername(username));
    }
  }, [dispatch, username]);

  // Update newNote when patient data is loaded
  useEffect(() => {
    if (selectedPatient) {
      console.log("Patient data loaded:", selectedPatient);
      const patientName = `${selectedPatient.first_name} ${selectedPatient.last_name}`;
      const patientId =
        selectedPatient.user_id?.toString() ||
        selectedPatient.id?.toString() ||
        "";

      setNewNote((prev) => ({
        ...prev,
        patientName,
        patientId,
      }));

      console.log("Updated newNote with patient info:", {
        patientName,
        patientId,
      });
    }
  }, [selectedPatient]);

  // Log clinical notes state changes
  useEffect(() => {
    console.log("Clinical notes state updated:", {
      notesCount: clinicalNotesState.notes.length,
      templatesCount: clinicalNotesState.templates.length,
      loading: clinicalNotesState.notesLoading,
      creating: clinicalNotesState.creating,
      errors: {
        notesError: clinicalNotesState.notesError,
        templatesError: clinicalNotesState.templatesError,
      },
    });
  }, [clinicalNotesState]);

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
    console.error("Error loading patient:", error);
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600">
          <h2 className="text-xl font-bold">Error Fetching Patient</h2>
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!selectedPatient) {
    console.log("No patient data found for username:", username);
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
    // Create a unified patient data object for the tabs
    const unifiedPatientData = {
      ...selectedPatient,
      ...patientData, // Include static data for sections that need it
      // Add additional mappings for consistency
      personalInfo: {
        id: selectedPatient.user_id || selectedPatient.id,
        firstName: selectedPatient.first_name,
        lastName: selectedPatient.last_name,
        ...selectedPatient,
      },
    };

    console.log(
      "Rendering tab:",
      activeTab,
      "with unified patient data:",
      unifiedPatientData
    );

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            patientData={unifiedPatientData}
            setIsOrderMedOpen={setIsOrderMedOpen}
            setIsOrderLabOpen={setIsOrderLabOpen}
            setIsNewNoteOpen={setIsNewNoteOpen}
          />
        );
      case "notes":
        return (
          <ClinicalNotesTab
            patientData={unifiedPatientData}
            setIsNewNoteOpen={setIsNewNoteOpen}
          />
        );
      case "medications":
        return (
          <MedicationsTab
            patientData={unifiedPatientData}
            setIsOrderMedOpen={setIsOrderMedOpen}
          />
        );
      case "labs":
        return (
          <LabsTab
            patientData={unifiedPatientData}
            setIsOrderLabOpen={setIsOrderLabOpen}
          />
        );
      case "billing":
        return <BillingTab patientData={unifiedPatientData} />;
      case "care-team":
        return <CareTeamTab patientData={unifiedPatientData} />;
      case "patient-info":
        return <PatientInfoTab patientData={unifiedPatientData} />;
      default:
        return null;
    }
  };

  // Create banner data from selected patient
  const bannerData = {
    name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
    avatar: "", // No avatar in the provided data
    initials: `${selectedPatient.first_name?.[0] || ""}${
      selectedPatient.last_name?.[0] || ""
    }`,
    gender: selectedPatient.gender,
    age: calculateAge(selectedPatient.date_of_birth),
    mrn:
      selectedPatient.user_id?.toString() ||
      selectedPatient.id?.toString() ||
      "",
    location: `${selectedPatient.city}, ${selectedPatient.state}`,
    contact: {
      phone: selectedPatient.phone_number,
      email: selectedPatient.email,
      address: selectedPatient.address,
    },
    dob: selectedPatient.date_of_birth,
    admitDate: "2023-10-26", // Placeholder as this is not in the data
    primaryPhysician: selectedPatient.primary_care_physician,
    dischargeDate: null, // Assuming patient is active
  };

  console.log("Banner data created:", bannerData);

  const handleCreateNote = () => {
    console.log("Creating note:", newNote);
    // The actual note creation is now handled by the ClinicalNotesModal component
    // This is just for backward compatibility with the old dialog
  };

  const handleOrderMedication = () => {
    console.log("Ordering medication:", newMedication);
    // TODO: Implement medication ordering functionality
  };

  const handleOrderLab = () => {
    console.log("Ordering lab:", newLabOrder);
    // TODO: Implement lab ordering functionality
  };

  return (
    <MainLayout>
      <PatientBanner patientData={bannerData} />

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

      {/* Backward compatibility dialogs - these will be replaced by the new modal system */}
      <ClinicalNotesDialog
        isOpen={isNewNoteOpen}
        onOpenChange={setIsNewNoteOpen}
        newNote={newNote}
        setNewNote={setNewNote}
        handleCreateNote={handleCreateNote}
      />

      <OrderMedicationDialog
        isOpen={isOrderMedOpen}
        onOpenChange={setIsOrderMedOpen}
        newMedication={newMedication}
        setNewMedication={setNewMedication}
        handleOrderMedication={handleOrderMedication}
      />

      <OrderLabDialog
        isOpen={isOrderLabOpen}
        onOpenChange={setIsOrderLabOpen}
        newLabOrder={newLabOrder}
        setNewLabOrder={setNewLabOrder}
        handleOrderLab={handleOrderLab}
      />
    </MainLayout>
  );
}
