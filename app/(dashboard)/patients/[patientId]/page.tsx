"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Calendar,
  Mail,
  Phone,
  Home,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Pill,
  FlaskConical,
  Video,
  Heart,
  ClipboardList,
  Receipt,
  Camera,
  Stethoscope,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchPatientByUsername } from "@/app/redux/features/patients/patientActions";

// Placeholder data for sections not covered by the API
const placeholderData = {
  vitals: {
    bp: "120/80 mmHg",
    hr: "72 bpm",
    temp: "98.6°F",
    resp: "16 rpm",
    spo2: "98%",
    recorded: "2025-08-26 08:00",
  },
  labs: [
    { name: "Complete Blood Count", status: "pending", ordered: "2025-08-26" },
    {
      name: "Basic Metabolic Panel",
      status: "completed",
      ordered: "2025-08-25",
      result: "Normal",
    },
  ],
  appointmentsHistory: [
    {
      id: 1,
      type: "Follow-up",
      with: "Dr. Carter",
      date: "2025-08-12",
      status: "Completed",
    },
    {
      id: 2,
      type: "Initial Consultation",
      with: "Dr. Carter",
      date: "2025-07-20",
      status: "Completed",
    },
  ],
  clinicalNotes: [
    {
      id: 1,
      title: "Follow-up Note",
      author: "Dr. Carter",
      date: "2025-08-12",
      content:
        "Patient reports improved mood. Continue current medication regimen.",
    },
    {
      id: 2,
      title: "Initial Assessment",
      author: "Dr. Carter",
      date: "2025-07-20",
      content:
        "New patient presenting with anxiety symptoms. Comprehensive evaluation completed.",
    },
  ],
  billingHistory: [
    {
      id: 1,
      service: "Office Visit (99213)",
      date: "2025-08-12",
      amount: "$150.00",
      status: "Paid",
    },
  ],
};

const clinicalTabs = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "labs", label: "Labs & Diagnostics", icon: FlaskConical },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "vitals", label: "Vitals & Monitoring", icon: Heart },
  { id: "telemedicine", label: "Telemedicine", icon: Video },
  { id: "imaging", label: "Imaging", icon: Camera },
  { id: "billing", label: "Billing", icon: Receipt },
];

export default function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
  const dispatch = useAppDispatch();
  const {
    selectedPatient: patientData,
    loading,
    error,
  } = useAppSelector((state) => state.patient);

  const [activeTab, setActiveTab] = useState("overview");
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isOrderMedOpen, setIsOrderMedOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);
  const [isTelemedicineOpen, setIsTelemedicineOpen] = useState(false);

  const [newNote, setNewNote] = useState({
    patientName: patientData?.first_name + " " + patientData?.last_name || "",
    patientId: patientData?.username || "",
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
    if (params.patientId) {
      dispatch(fetchPatientByUsername(params.patientId as string));
    }
  }, [dispatch, params.patientId]);

  useEffect(() => {
    if (patientData) {
      setNewNote((prev) => ({
        ...prev,
        patientName: `${patientData.first_name} ${patientData.last_name}`,
        patientId: patientData.username,
      }));
    }
  }, [patientData]);

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading || !patientData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="ml-2">Loading Patient Details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </MainLayout>
    );
  }

  const handleCreateNote = () => {
    console.log("Creating new note:", newNote);
    setIsNewNoteOpen(false);
  };

  const handleOrderMedication = () => {
    console.log("Ordering medication:", newMedication);
    setIsOrderMedOpen(false);
  };

  const handleOrderLab = () => {
    console.log("Ordering lab:", newLabOrder);
    setIsOrderLabOpen(false);
  };

  // Tab Components
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setIsOrderMedOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-left justify-start"
          >
            <Pill className="mr-2 h-4 w-4" />
            Order Medication
          </Button>
          <Button
            onClick={() => setIsOrderLabOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-left justify-start"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Order Labs
          </Button>
          <Button
            onClick={() => setIsNewNoteOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-left justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Clinical Note
          </Button>
          <Button
            onClick={() => setIsTelemedicineOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-left justify-start"
          >
            <Video className="mr-2 h-4 w-4" />
            Start Call
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Latest Vitals
            </span>
            <span className="text-xs text-gray-500">
              {placeholderData.vitals.recorded}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">BP</p>
            <p className="font-bold text-blue-900">
              {placeholderData.vitals.bp}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700">HR</p>
            <p className="font-bold text-red-900">
              {placeholderData.vitals.hr}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-700">Temp</p>
            <p className="font-bold text-orange-900">
              {placeholderData.vitals.temp}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">Resp</p>
            <p className="font-bold text-green-900">
              {placeholderData.vitals.resp}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">SpO2</p>
            <p className="font-bold text-purple-900">
              {placeholderData.vitals.spo2}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Button variant="outline" size="sm" className="h-full w-full">
              <Plus className="h-3 w-3 mr-1" />
              Record
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MedicationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Medication Management</h2>
        <Button
          onClick={() => setIsOrderMedOpen(true)}
          className="bg-blue-800 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Order New Medication
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {patientData.current_medications.split(" ")[0]}
                </p>
                <p className="text-sm text-gray-600">
                  {patientData.current_medications
                    .split(" ")
                    .slice(1)
                    .join(" ")}
                </p>
                <p className="text-xs text-gray-500">
                  Prescribed by {patientData.primary_care_physician}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LabsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Laboratory & Diagnostics</h2>
        <Button
          onClick={() => setIsOrderLabOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Order Lab Test
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {placeholderData.labs.map((lab, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{lab.name}</p>
                  <p className="text-sm text-gray-600">
                    Ordered: {lab.ordered}
                  </p>
                  {lab.result && (
                    <p className="text-sm text-green-600">{lab.result}</p>
                  )}
                </div>
                <Badge
                  className={
                    lab.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {lab.status}
                </Badge>
              </div>
              {lab.status === "completed" && (
                <Button variant="outline" size="sm" className="mt-2">
                  View Results
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const ClinicalNotesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Clinical Documentation</h2>
        <Button
          onClick={() => setIsNewNoteOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Clinical Note
        </Button>
      </div>
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          <div className="space-y-0">
            {placeholderData.clinicalNotes.map((note, index) => (
              <div
                key={note.id}
                className={`p-4 ${
                  index !== placeholderData.clinicalNotes.length - 1
                    ? "border-b"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      By {note.author} on {note.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MainLayout>
      {/* Persistent Patient Banner */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 shadow-lg backdrop-blur-sm">
        <div className="px-6 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-16 h-16 ring-4 ring-blue-100 ring-offset-2">
                    <AvatarImage src={patientData.profile_picture_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-800 text-white text-lg font-semibold">
                      {patientData.first_name && patientData.last_name
                        ? `${patientData.first_name[0]}${patientData.last_name[0]}`
                        : "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900 truncate">
                      {patientData.first_name} {patientData.last_name}
                    </h1>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      Active Patient
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="font-medium">
                        {patientData.gender},{" "}
                        {calculateAge(patientData.date_of_birth)} years
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>
                        MRN:{" "}
                        <span className="font-mono font-medium">
                          {patientData.username}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">
                        {patientData.city}, {patientData.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Admitted
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Stethoscope className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Primary MD
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 truncate">
                      {patientData.primary_care_physician}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-800 hover:bg-blue-700 rounded-lg px-4 py-2 font-medium shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg px-4 py-2 font-medium border-slate-300 hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 p-4">
        {/* Back Button */}
        <div>
          <Link href="/patients" className="inline-block">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Patients
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Patient Info & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Contact & Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex">
                  <Phone className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>{patientData.phone_number}</span>
                </div>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span className="truncate">{patientData.email}</span>
                </div>
                <div className="flex">
                  <Home className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>{patientData.address}</span>
                </div>
                <div className="flex">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>DOB: {patientData.date_of_birth}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Allergies & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patientData.allergies.split(", ").map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Clinical Workflow Tabs */}
          <div className="lg:col-span-3">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-1 overflow-x-auto">
                {clinicalTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                        activeTab === tab.id
                          ? "border-blue-800 text-blue-800 bg-blue-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "medications" && <MedicationsTab />}
              {activeTab === "labs" && <LabsTab />}
              {activeTab === "notes" && <ClinicalNotesTab />}
              {/* Add other tab components here, using placeholderData */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
