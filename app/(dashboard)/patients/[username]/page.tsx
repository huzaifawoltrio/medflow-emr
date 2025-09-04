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

  // **FIX**: Moved bannerData initialization here, after the !selectedPatient check.
  const bannerData = {
    name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
    avatar: "", // No avatar in the provided data
    initials: `${selectedPatient.first_name?.[0] || ""}${
      selectedPatient.last_name?.[0] || ""
    }`,
    gender: selectedPatient.gender,
    age: calculateAge(selectedPatient.date_of_birth),
    mrn: selectedPatient.user_id.toString(),
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
