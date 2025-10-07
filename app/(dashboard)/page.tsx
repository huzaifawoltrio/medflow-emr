"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getUserDetails } from "../redux/features/auth/authActions";
import { fetchTodaysAppointments } from "../../app/redux/features/appointments/appointmentActions";
import { fetchPriorityMessages } from "../redux/features/chat/chatActions";
import {
  fetchPatients,
  fetchPatientsWithoutNotes,
} from "../redux/features/patients/patientActions";
import { Patient } from "../redux/features/patients/patientActions";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AssignPatientDialog } from "@/components/dashboard/AssignPatientDialog";
import { PendingNoteItem } from "@/components/dashboard/PendingNoteItem";
import {
  Calendar,
  MessageSquare,
  Pill,
  DollarSign,
  Search,
  Link as LinkIcon,
  CheckCircle2,
  CalendarCheck,
  ScanLine,
  FileText,
  Loader2,
  Clock,
  MapPin,
  User,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import type { ComponentType } from "react";
import Link from "next/link";

// A helper component for Quick Action items
const QuickActionButton = ({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
}) => (
  <div className="flex flex-col items-center justify-center p-3 space-y-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer text-center">
    <div className={`p-2 rounded-full bg-${colorClass}-100`}>
      <Icon className={`h-5 w-5 text-${colorClass}-600`} />
    </div>
    <span className="text-xs sm:text-sm font-medium text-gray-700">
      {label}
    </span>
  </div>
);

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Helper function to determine if appointment is next
const getNextAppointment = (appointments: any[]) => {
  if (!appointments.length) return null;

  const now = new Date();
  const todayAppointments = appointments
    .filter((apt) => {
      const aptTime = new Date(apt.appointment_datetime);
      return aptTime >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_datetime).getTime() -
        new Date(b.appointment_datetime).getTime()
    );

  return todayAppointments[0] || null;
};

// Helper function to truncate message content
const truncateMessage = (content: string, maxLength: number = 50) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    dailyAppointments,
    totalDailyAppointments,
    dailyLoading,
    error: appointmentError,
  } = useSelector((state: RootState) => state.appointment);
  const {
    priorityMessages,
    loading: { priorityMessages: priorityLoading },
    error: { priorityMessages: priorityError },
  } = useSelector((state: RootState) => state.chat);
  const {
    patients,
    patientsWithoutNotes,
    patientsWithoutNotesSummary,
    loadingWithoutNotes,
    error: withoutNotesError,
  } = useSelector((state: RootState) => state.patient);

  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientForDialog, setSelectedPatientForDialog] =
    useState<Patient | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Filter pending notes based on search query
  const filteredPendingNotes = useMemo(() => {
    if (!patientsWithoutNotes) return [];

    return patientsWithoutNotes.filter((patient) => {
      const fullName =
        `${patient.first_name} ${patient.last_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [patientsWithoutNotes, searchQuery]);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails());
    }
    dispatch(fetchTodaysAppointments());
    dispatch(
      fetchPriorityMessages({ page: 1, perPage: 3, includeRead: false })
    );
    dispatch(fetchPatients());
    dispatch(fetchPatientsWithoutNotes());
  }, [dispatch, user]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatientForDialog(patient);
    setIsAssignDialogOpen(true);
    setPatientSearch("");
  };

  const filteredPatients = useMemo(() => {
    if (!patientSearch || !user?.id) {
      return [];
    }
    return patients
      .filter((p: any) => {
        const isAlreadyAssigned = p.doctors?.some(
          (doctor: any) => doctor.user_id === user.id
        );

        if (isAlreadyAssigned) {
          return false;
        }

        return (
          `${p.first_name} ${p.last_name}`
            .toLowerCase()
            .includes(patientSearch.toLowerCase()) ||
          p.username.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.email.toLowerCase().includes(patientSearch.toLowerCase())
        );
      })
      .slice(0, 5);
  }, [patients, patientSearch, user]);

  const doctorName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "Doctor";
  const nextAppointment = getNextAppointment(dailyAppointments);
  const priorityMessageCount = priorityMessages?.length || 0;
  const pendingNotesCount =
    patientsWithoutNotesSummary?.patients_without_notes || 0;

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {authLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                `Good morning, Dr. ${doctorName}`
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your practice today.
            </p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search & assign patients..."
                className="pl-10 bg-white border-gray-200 w-full max-w-xs"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
              {filteredPatients.length > 0 && patientSearch && (
                <Card className="absolute top-full mt-2 w-full max-w-xs z-10">
                  <CardContent className="p-2">
                    <ul>
                      {filteredPatients.map((patient) => (
                        <li
                          key={patient.user_id}
                          onClick={() => handlePatientSelect(patient)}
                          className="p-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                        >
                          {patient.first_name} {patient.last_name} (@
                          {patient.username})
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <Card className="bg-blue-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-blue-800">
                  Today's Appointments
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
                  {dailyLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    totalDailyAppointments
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-800 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-red-800">
                  Priority Messages
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-red-900 mt-2">
                  {priorityLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    priorityMessageCount
                  )}
                </div>
              </div>
              <div className="p-3 bg-red-600 rounded-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-purple-800">
                  Pending Rx
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-purple-900 mt-2">
                  3
                </div>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-orange-800">
                  Outstanding Bills
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-orange-900 mt-2">
                  $2.8k
                </div>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-amber-800">
                  Pending Notes
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-amber-900 mt-2">
                  {loadingWithoutNotes ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    pendingNotesCount
                  )}
                </div>
              </div>
              <div className="p-3 bg-amber-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link href="/appointments">
                    <QuickActionButton
                      icon={Calendar}
                      label="Schedule"
                      colorClass="blue"
                    />
                  </Link>
                  <Link href="/clinical-notes">
                    <QuickActionButton
                      icon={FileText}
                      label="New Note"
                      colorClass="green"
                    />
                  </Link>
                  <Link href="/e-prescription">
                    <QuickActionButton
                      icon={LinkIcon}
                      label="Prescribe"
                      colorClass="purple"
                    />
                  </Link>
                  <Link href="/ocr-workflow">
                    <QuickActionButton
                      icon={ScanLine}
                      label="Scan Doc"
                      colorClass="orange"
                    />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg md:text-xl font-semibold flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  Pending Notes ({filteredPendingNotes.length})
                </CardTitle>
                {loadingWithoutNotes && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {withoutNotesError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      Error loading pending notes: {withoutNotesError}
                    </p>
                  </div>
                ) : filteredPendingNotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No pending clinical notes.</p>
                  </div>
                ) : (
                  filteredPendingNotes
                    .slice(0, 3)
                    .map((patient) => (
                      <PendingNoteItem
                        key={patient.user_id}
                        patient={patient}
                      />
                    ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Lab results reviewed</p>
                    <p className="text-xs text-gray-500">
                      John Doe • CBC panel normal
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    2m ago
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <CalendarCheck className="h-5 w-5 text-blue-800 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Appointment confirmed</p>
                    <p className="text-xs text-gray-500">
                      S. Johnson • Today 10:30 AM
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    15m ago
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Pill className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Prescription sent</p>
                    <p className="text-xs text-gray-500">
                      Mike Wilson • Fluoxetine 20mg
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    1h ago
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:space-y-8">
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Today's Schedule
                </CardTitle>
                {dailyLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {appointmentError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      Error loading appointments: {appointmentError}
                    </p>
                  </div>
                ) : dailyAppointments.length === 0 ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600 text-center">
                      No appointments scheduled for today
                    </p>
                  </div>
                ) : (
                  dailyAppointments.slice(0, 4).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-3 rounded-md border-l-4 ${
                        appointment.id === nextAppointment?.id
                          ? "bg-blue-50 border-blue-800"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <p className="font-semibold text-sm">
                              {appointment.patient_name}
                            </p>
                            {appointment.id === nextAppointment?.id && (
                              <Badge className="bg-blue-800 hover:bg-blue-700 text-xs">
                                Next
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatTime(appointment.appointment_datetime)}
                              </span>
                            </div>
                            {appointment.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{appointment.location}</span>
                              </div>
                            )}
                          </div>
                          {appointment.services &&
                            appointment.services.length > 0 && (
                              <p className="text-xs text-gray-600 mt-1">
                                {appointment.services.join(", ")}
                              </p>
                            )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Link href="/appointments">
                  <Button variant="outline" className="w-full bg-white">
                    View Full Schedule
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg md:text-xl font-semibold flex items-center space-x-2">
                  <span>Priority Messages</span>
                  {priorityMessageCount > 0 && (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      {priorityMessageCount}
                    </Badge>
                  )}
                </CardTitle>
                {priorityLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {priorityError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      Error loading priority messages: {priorityError}
                    </p>
                  </div>
                ) : priorityMessages.length === 0 ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600 text-center">
                      No priority messages at this time
                    </p>
                  </div>
                ) : (
                  priorityMessages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border ${
                        !message.is_read
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-700 border-red-200 text-xs"
                        >
                          Priority
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {message.sender_info?.full_name ||
                            message.sender_info?.username}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {truncateMessage(message.content, 60)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 capitalize">
                            {message.sender_info?.role || "Patient"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Link href="/messaging">
                  <Button variant="outline" className="w-full bg-white">
                    View All Messages
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <AssignPatientDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        patient={selectedPatientForDialog}
      />
    </MainLayout>
  );
}
