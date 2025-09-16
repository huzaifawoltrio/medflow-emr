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
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

  // Clinical notes Redux state for debugging
  const clinicalNotesState = useSelector(
    (state: RootState) => state.clinicalNotes
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [isOrderMedOpen, setIsOrderMedOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Dialog states for medication and lab orders
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
  }, [dispatch, username, retryCount]);

  // Log clinical notes state changes for debugging
  useEffect(() => {
    console.log("Clinical notes state updated:", {
      notesCount: clinicalNotesState.notes.length,
      noteTypesCount: clinicalNotesState.noteTypes?.length || 0,
      templatesCount: clinicalNotesState.templates.length,
      loading: {
        notes: clinicalNotesState.notesLoading,
        noteTypes: clinicalNotesState.noteTypesLoading,
        templates: clinicalNotesState.templatesLoading,
        creating: clinicalNotesState.creating,
      },
      errors: {
        notesError: clinicalNotesState.notesError,
        noteTypesError: clinicalNotesState.noteTypesError,
        templatesError: clinicalNotesState.templatesError,
      },
      success: {
        create: clinicalNotesState.createSuccess,
        update: clinicalNotesState.updateSuccess,
        sign: clinicalNotesState.signSuccess,
        delete: clinicalNotesState.deleteSuccess,
        amend: clinicalNotesState.amendSuccess,
      },
    });
  }, [clinicalNotesState]);

  const handleRetry = () => {
    console.log("Retrying patient data fetch...");
    setRetryCount((prev) => prev + 1);
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-800 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Loading Patient Details
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch the patient information...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    console.error("Error loading patient:", error);
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Error Loading Patient</p>
                  <p className="text-sm">{error}</p>
                </div>
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We encountered an issue while loading the patient information.
              </p>
              <div className="space-x-2">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => window.history.back()} variant="ghost">
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Patient not found state
  if (!selectedPatient) {
    console.log("No patient data found for username:", username);
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Patient Not Found
              </h2>
              <p className="text-gray-600">
                The requested patient with username "{username}" could not be
                found.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleRetry} variant="outline">
                Retry Search
              </Button>
              <Button onClick={() => window.history.back()} variant="ghost">
                Go Back
              </Button>
            </div>
          </div>
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
      "with unified patient data keys:",
      Object.keys(unifiedPatientData)
    );

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            patientData={unifiedPatientData}
            setIsOrderMedOpen={setIsOrderMedOpen}
            setIsOrderLabOpen={setIsOrderLabOpen}
          />
        );
      case "notes":
        return <ClinicalNotesTab patientData={unifiedPatientData} />;
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
        return (
          <div className="text-center p-8">
            <p className="text-gray-500">Tab content not available</p>
          </div>
        );
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

  console.log("Banner data created:", {
    name: bannerData.name,
    mrn: bannerData.mrn,
    location: bannerData.location,
  });

  const handleOrderMedication = () => {
    console.log("Ordering medication:", newMedication);
    // TODO: Implement medication ordering functionality
    alert("Medication ordering functionality will be implemented soon.");
  };

  const handleOrderLab = () => {
    console.log("Ordering lab:", newLabOrder);
    // TODO: Implement lab ordering functionality
    alert("Lab ordering functionality will be implemented soon.");
  };

  return (
    <MainLayout>
      {/* Patient Banner */}
      <PatientBanner patientData={bannerData} />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Clinical Tabs Navigation */}
            <ClinicalTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              clinicalTabs={clinicalTabs}
            />

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Order Dialogs */}
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
