// app/patient/[patientId]/data.ts
import {
  FileText,
  Calendar,
  Pill,
  FlaskConical,
  Heart,
  Camera,
  Receipt,
  ClipboardList,
} from "lucide-react";

export const patientData = {
  id: "P001",
  name: "John Doe",
  avatar: "/avatars/01.png",
  initials: "JD",
  dob: "1985-03-15",
  age: 39,
  gender: "Male",
  mrn: "MRN-2024-001234",
  admitDate: "2025-08-26",
  dischargeDate: null,
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

export const clinicalTabs = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "labs", label: "Labs & Diagnostics", icon: FlaskConical },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "vitals", label: "Vitals & Monitoring", icon: Heart },
  { id: "imaging", label: "Imaging", icon: Camera },
  { id: "billing", label: "Billing", icon: Receipt },
];
