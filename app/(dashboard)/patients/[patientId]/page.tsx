"use client";
import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Calendar,
  Mail,
  Phone,
  Home,
  Briefcase,
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
  ChevronRight,
  Search,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Enhanced static data
const patientData = {
  id: "P001",
  name: "John Doe",
  avatar: "/avatars/01.png",
  initials: "JD",
  dob: "1985-03-15",
  age: 39,
  gender: "Male",
  mrn: "MRN-2024-001234",
  admitDate: "2025-08-26",
  dischargeDate: null, // null indicates still admitted
  location: "Room 302B - Medical Floor",
  primaryPhysician: "Dr. Emily Carter",
  contact: {
    phone: "(555) 123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, Anytown, USA 12345",
  },
  allergies: ["Penicillin", "Peanuts"],
  currentMedications: ["Lisinopril 10mg daily", "Atorvastatin 20mg daily"],
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
  upcomingAppointments: [
    {
      type: "Follow-up",
      with: "Dr. Carter",
      date: "2025-09-05",
      time: "10:00 AM",
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
  { id: "imaging", label: "Imaging", icon: Camera },
  { id: "billing", label: "Billing", icon: Receipt },
];

export default function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isOrderMedOpen, setIsOrderMedOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);

  const [newNote, setNewNote] = useState({
    patientName: patientData.name,
    patientId: patientData.id,
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

  // Enhanced Tab Components
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
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
          <Button className="bg-yellow-600 hover:bg-green-700 text-left justify-start">
            <Video className="mr-2 h-4 w-4" />
            Telemedicine
          </Button>
        </CardContent>
      </Card>
      {/* Current Vitals */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Latest Vitals
            </span>
            <span className="text-xs text-gray-500">
              {patientData.vitals.recorded}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">BP</p>
            <p className="font-bold text-blue-900">{patientData.vitals.bp}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700">HR</p>
            <p className="font-bold text-red-900">{patientData.vitals.hr}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-700">Temp</p>
            <p className="font-bold text-orange-900">
              {patientData.vitals.temp}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">Resp</p>
            <p className="font-bold text-green-900">
              {patientData.vitals.resp}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">SpO2</p>
            <p className="font-bold text-purple-900">
              {patientData.vitals.spo2}
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
      {/* Active Medications */}
      <Card className="rounded-xl shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Current Medications
            </span>
            <Button size="sm" onClick={() => setIsOrderMedOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patientData.currentMedications.map((med, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Pill className="h-4 w-4 text-blue-800" />
                <span className="font-medium">{med}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Discontinue
                </Button>
              </div>
            </div>
          ))}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Active Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientData.currentMedications.map((med, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{med.split(" ")[0]}</p>
                    <p className="text-sm text-gray-600">
                      {med.split(" ").slice(1).join(" ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Prescribed by Dr. Carter
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    Discontinue
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Medication History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Amoxicillin 500mg</p>
                    <p className="text-sm text-gray-600">
                      3x daily for 10 days
                    </p>
                    <p className="text-xs text-gray-500">Ordered: 2025-08-20</p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Labs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientData.labs.map((lab, index) => (
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
        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Complete Blood Count</p>
                    <p className="text-sm text-gray-600">
                      Ordered today - Sample collected
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Processing
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Order Medication Dialog
  const OrderMedicationDialog = () => (
    <Dialog open={isOrderMedOpen} onOpenChange={setIsOrderMedOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order New Medication</DialogTitle>
          <DialogDescription>
            Prescribe medication for {patientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Medication</Label>
              <Input
                placeholder="Search medication..."
                value={newMedication.medication}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    medication: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input
                placeholder="e.g., 10mg"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={newMedication.frequency}
                onValueChange={(value) =>
                  setNewMedication({ ...newMedication, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once-daily">Once daily</SelectItem>
                  <SelectItem value="twice-daily">Twice daily</SelectItem>
                  <SelectItem value="three-times-daily">
                    Three times daily
                  </SelectItem>
                  <SelectItem value="four-times-daily">
                    Four times daily
                  </SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g., 30 days"
                value={newMedication.duration}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    duration: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              placeholder="Take with food, etc..."
              value={newMedication.instructions}
              onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  instructions: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={newMedication.priority}
              onValueChange={(value) =>
                setNewMedication({ ...newMedication, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOrderMedOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleOrderMedication}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Order Medication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Order Lab Dialog
  const OrderLabDialog = () => (
    <Dialog open={isOrderLabOpen} onOpenChange={setIsOrderLabOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Laboratory Test</DialogTitle>
          <DialogDescription>
            Order lab work for {patientData.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Lab Test</Label>
            <Select
              value={newLabOrder.labType}
              onValueChange={(value) =>
                setNewLabOrder({ ...newLabOrder, labType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lab test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cbc">Complete Blood Count (CBC)</SelectItem>
                <SelectItem value="bmp">Basic Metabolic Panel (BMP)</SelectItem>
                <SelectItem value="cmp">
                  Comprehensive Metabolic Panel (CMP)
                </SelectItem>
                <SelectItem value="lipid">Lipid Panel</SelectItem>
                <SelectItem value="tsh">TSH</SelectItem>
                <SelectItem value="hba1c">Hemoglobin A1C</SelectItem>
                <SelectItem value="pt-ptt">PT/PTT</SelectItem>
                <SelectItem value="urinalysis">Urinalysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Clinical Indication</Label>
            <Textarea
              placeholder="Reason for ordering this test..."
              value={newLabOrder.indication}
              onChange={(e) =>
                setNewLabOrder({ ...newLabOrder, indication: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={newLabOrder.priority}
              onValueChange={(value) =>
                setNewLabOrder({ ...newLabOrder, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              placeholder="Fasting required, etc..."
              value={newLabOrder.instructions}
              onChange={(e) =>
                setNewLabOrder({ ...newLabOrder, instructions: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOrderLabOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleOrderLab}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Order Lab Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Clinical Notes Dialog (existing, kept as is)
  const ClinicalNotesDialog = () => (
    <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>
            Document patient encounter and clinical findings for{" "}
            {patientData.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" value={newNote.patientName} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" value={newNote.patientId} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Note Type</Label>
            <Select
              value={newNote.type}
              onValueChange={(value) => setNewNote({ ...newNote, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Initial Assessment">
                  Initial Assessment
                </SelectItem>
                <SelectItem value="Progress Note">Progress Note</SelectItem>
                <SelectItem value="Therapy Session">Therapy Session</SelectItem>
                <SelectItem value="Medication Review">
                  Medication Review
                </SelectItem>
                <SelectItem value="Discharge Summary">
                  Discharge Summary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Clinical Content</Label>
            <Textarea
              id="content"
              placeholder="Enter clinical notes..."
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCodes">Billing Codes</Label>
            <Input
              id="billingCodes"
              placeholder="99213, 90834 (comma separated)"
              value={newNote.billingCodes}
              onChange={(e) =>
                setNewNote({ ...newNote, billingCodes: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newNote.status}
              onValueChange={(value) =>
                setNewNote({
                  ...newNote,
                  status: value as "draft" | "completed",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => setIsNewNoteOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const VitalsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Vitals & Monitoring</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Record New Vitals
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Vitals */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Vitals</CardTitle>
            <p className="text-sm text-gray-600">
              Recorded: {patientData.vitals.recorded}
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">Blood Pressure</p>
              <p className="text-2xl font-bold text-blue-900">
                {patientData.vitals.bp}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-red-700">Heart Rate</p>
              <p className="text-2xl font-bold text-red-900">
                {patientData.vitals.hr}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-orange-700">Temperature</p>
              <p className="text-2xl font-bold text-orange-900">
                {patientData.vitals.temp}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-700">Respiratory</p>
              <p className="text-2xl font-bold text-green-900">
                {patientData.vitals.resp}
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Vitals History Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Vitals Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Vitals trend chart would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ImagingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Medical Imaging</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Order Imaging Study
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Chest X-Ray</p>
                  <p className="text-sm text-gray-600">Ordered: Aug 25, 2025</p>
                  <p className="text-sm text-green-600">Normal findings</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Images
                  </Button>
                  <Button variant="outline" size="sm">
                    Report
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">CT Scan - Abdomen</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: Aug 28, 2025
                  </p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Scheduled
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BillingTab = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patientData.billingHistory.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-sm">{item.service}</p>
              <p className="text-xs text-gray-500">Date: {item.date}</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <p className="font-semibold text-sm">{item.amount}</p>
              <Badge
                className={
                  item.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
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
            {patientData.clinicalNotes.map((note, index) => (
              <div
                key={note.id}
                className={`p-4 ${
                  index !== patientData.clinicalNotes.length - 1
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Full Note
                    </Button>
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
      {/* Modified Persistent Patient Banner - Removed sticky, moved content */}
      <div className="z-40 w-full bg-white rounded-2xl border border-slate-200">
        <div className="py-4 px-4 sm:px-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-6">
              {/* --- Main Content Row --- */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* --- Left Section: Patient Info --- */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-20 h-20 ring-4 ring-blue-100">
                      <AvatarImage
                        src={patientData.avatar}
                        alt={patientData.name}
                      />
                      <AvatarFallback className="bg-blue-800 text-white text-2xl font-semibold">
                        {patientData.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Patient Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-3">
                      <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 truncate">
                        {patientData.name}
                      </h1>
                      <Badge
                        className={
                          patientData.dischargeDate
                            ? "bg-emerald-100 text-emerald-800 border-transparent"
                            : "bg-blue-100 text-blue-800 border-transparent font-semibold"
                        }
                      >
                        {patientData.dischargeDate
                          ? "Discharged"
                          : "Active Patient"}
                      </Badge>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="block w-2 h-2 bg-blue-800 rounded-full"></span>
                        <span className="font-medium text-slate-700">
                          {patientData.gender}, {patientData.age} years
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="block w-2 h-2 bg-blue-800 rounded-full"></span>
                        <span>
                          MRN:{" "}
                          <span className="font-mono font-medium tracking-wider text-slate-700">
                            {patientData.mrn}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-800" />
                        <span className="truncate">{patientData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Right Section: Quick Info Cards & Actions --- */}
                <div className="flex flex-col gap-4 flex-shrink-0">
                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 gap-3 text-sm min-w-0">
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-800 flex-shrink-0" />
                        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                          Admitted
                        </span>
                      </div>
                      <span className="font-semibold text-slate-800 text-base block truncate">
                        {patientData.admitDate}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope className="h-4 w-4 text-blue-800 flex-shrink-0" />
                        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                          Primary MD
                        </span>
                      </div>
                      <span className="font-semibold text-slate-800 text-base block truncate">
                        {patientData.primaryPhysician}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Full-width Divider --- */}
              <div className="w-full border-t border-slate-200"></div>

              {/* --- Contact Info Section --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-600 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                  <span>{patientData.contact.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                  <span className="truncate">{patientData.contact.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                  <span>{patientData.contact.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                  <span>DOB: {patientData.dob}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 p-4">
        {/* Modified Main Content Grid - Removed dedicated left column */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-1">
          {/* Removed the lg:col-span-1 section for Contact & Demographics */}

          {/* Main Content: Clinical Workflow Tabs - Adjusted column span */}
          <div className="lg:col-span-4">
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
              {activeTab === "vitals" && <VitalsTab />}
              {activeTab === "imaging" && <ImagingTab />}
              {activeTab === "billing" && <BillingTab />}
            </div>
          </div>
        </div>
      </div>

      {/* All Dialogs - No changes needed */}
      <ClinicalNotesDialog />
      <OrderMedicationDialog />
      <OrderLabDialog />
    </MainLayout>
  );
}
