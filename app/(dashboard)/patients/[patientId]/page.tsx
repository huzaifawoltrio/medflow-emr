"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  DollarSign,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Expanded static data for a richer detail page
const patientData = {
  id: "P001",
  name: "John Doe",
  avatar: "/avatars/01.png",
  initials: "JD",
  dob: "1985-03-15",
  age: 39,
  gender: "Male",
  contact: {
    phone: "(555) 123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, Anytown, USA 12345",
  },
  primaryPhysician: "Dr. Emily Carter",
  allergies: ["Penicillin", "Peanuts"],
  currentMedications: ["Lisinopril 10mg", "Atorvastatin 20mg"],
  vitals: {
    bp: "120/80 mmHg",
    hr: "72 bpm",
    temp: "98.6°F",
    resp: "16 rpm",
    spo2: "98%",
  },
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
    {
      id: 2,
      service: "New Patient Visit (99204)",
      date: "2025-07-20",
      amount: "$250.00",
      status: "Paid",
    },
  ],
};

const tabs = ["Overview", "Appointments", "Clinical Notes", "Billing"];

export default function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  // Tab Content Components
  const OverviewTab = () => (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Vitals</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">BP</p>
            <p className="font-bold text-blue-900">{patientData.vitals.bp}</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700">Heart Rate</p>
            <p className="font-bold text-red-900">{patientData.vitals.hr}</p>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-700">Temp</p>
            <p className="font-bold text-orange-900">
              {patientData.vitals.temp}
            </p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">Resp.</p>
            <p className="font-bold text-green-900">
              {patientData.vitals.resp}
            </p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">SpO2</p>
            <p className="font-bold text-purple-900">
              {patientData.vitals.spo2}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patientData.upcomingAppointments.map((appt, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">
                    {appt.type} with {appt.with}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appt.date} at {appt.time}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const AppointmentsTab = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Appointment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patientData.appointmentsHistory.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-sm">
                  {appt.type} with {appt.with}
                </p>
                <p className="text-xs text-gray-500">{appt.date}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 self-start sm:self-center">
              {appt.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const ClinicalNotesTab = () => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Clinical Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {patientData.clinicalNotes.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{note.title}</p>
                <p className="text-xs text-gray-500">
                  By {note.author} on {note.date}
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Note
              </Button>
            </div>
            <p className="text-sm text-gray-700 truncate">{note.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
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

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header and Back Button */}
        <div>
          <Link href="/patients" className="inline-block">
            <Button
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Patients
            </Button>
          </Link>
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={patientData.avatar} />
                  <AvatarFallback>{patientData.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {patientData.name}
                  </h1>
                  <p className="text-gray-500">
                    {patientData.gender}, {patientData.age} years old • ID:{" "}
                    {patientData.id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                  <Plus className="mr-2 h-4 w-4" /> New Note
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" /> Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Patient Info */}
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
                  <span>{patientData.contact.phone}</span>
                </div>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>{patientData.contact.email}</span>
                </div>
                <div className="flex">
                  <Home className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>{patientData.contact.address}</span>
                </div>
                <div className="flex">
                  <Briefcase className="h-4 w-4 mr-3 text-gray-400 shrink-0 mt-0.5" />
                  <span>Primary: {patientData.primaryPhysician}</span>
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
                  {patientData.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Tabbed Content */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-6">
              {activeTab === "Overview" && <OverviewTab />}
              {activeTab === "Appointments" && <AppointmentsTab />}
              {activeTab === "Clinical Notes" && <ClinicalNotesTab />}
              {activeTab === "Billing" && <BillingTab />}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
