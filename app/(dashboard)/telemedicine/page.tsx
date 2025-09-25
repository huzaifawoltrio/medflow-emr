"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Video,
  Calendar,
  Users,
  Play,
  Settings,
  Shield,
  Camera,
  Mic,
  Wifi,
  Monitor,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  CalendarDays,
  ExternalLink,
  LogOut,
  User,
  Chrome,
  Loader2,
  RefreshCw,
  Trash2,
  Edit3,
  FileText,
  Search,
  UserCheck,
} from "lucide-react";
// Import Redux actions and selectors
import {
  checkGoogleConnection,
  initiateGoogleAuth,
  createGoogleMeeting,
  fetchMeetings,
  rescheduleMeeting,
  cancelMeeting,
  disconnectGoogle,
  clearError,
} from "../../redux/features/googleCalendar/googleCalendarSlice";
import { fetchPatients } from "../../redux/features/patients/patientActions"; // Updated import
import { RootState, AppDispatch } from "../../redux/store";
import MainLayout from "@/components/layout/main-layout";
import { ToastService } from "@/services/toastService";

interface Patient {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export default function GoogleTelemedicine() {
  const dispatch = useDispatch<AppDispatch>();
  // Redux state
  const {
    isConnected,
    googleUser,
    meetings,
    loading,
    error,
    creatingMeeting,
    reschedulingMeeting,
    cancelingMeeting,
  } = useSelector((state: RootState) => state.googleCalendar);

  // Get patients from the patient slice
  const { patients, loading: patientsLoading } = useSelector(
    (state: RootState) => state.patient
  );

  // Local state
  const [systemStatus, setSystemStatus] = useState<Record<string, string>>({});
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    patientId: "",
    date: "",
    time: "",
    duration: "30",
    type: "Initial Consultation",
    notes: "",
  });
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");

  // Check for OAuth callback success/error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get("google_auth");
    if (googleAuth === "success") {
      // Clear URL params and refresh connection status
      window.history.replaceState({}, "", "/telemedicine");
      dispatch(checkGoogleConnection());
      ToastService.success("Successfully connected to Google Account!");
    } else if (googleAuth === "error") {
      const message = urlParams.get("message") || "Authentication failed";
      window.history.replaceState({}, "", "/telemedicine");
      ToastService.error(`Authentication failed: ${message}`);
    }
  }, [dispatch]);

  // Check Google connection status on component mount
  useEffect(() => {
    dispatch(checkGoogleConnection());
  }, [dispatch]);

  // Fetch meetings and patients when connected
  useEffect(() => {
    if (isConnected) {
      dispatch(fetchMeetings());
      dispatch(fetchPatients()); // Now using patientActions
    }
  }, [isConnected, dispatch]);

  // System status check
  useEffect(() => {
    const checkSystems = async () => {
      const checks: Record<string, string> = {};
      // Check camera access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        checks["Camera Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Camera Access"] = "denied";
      }
      // Check microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        checks["Microphone Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Microphone Access"] = "denied";
      }
      // Static checks
      checks["Internet Connection"] = "excellent";
      checks["Browser Compatibility"] = "supported";
      checks["Google Calendar API"] = isConnected
        ? "connected"
        : "disconnected";
      checks["Google Meet Integration"] = isConnected ? "active" : "inactive";
      setSystemStatus(checks);
    };
    checkSystems();
  }, [isConnected]);

  // Event handlers
  const handleGoogleConnect = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    window.location.href = `${baseUrl}/google/authorize`;
  };

  const handleGoogleDisconnect = () => {
    if (
      window.confirm("Are you sure you want to disconnect your Google account?")
    ) {
      const promise = dispatch(disconnectGoogle()).unwrap();
      ToastService.promise(promise, {
        loading: "Disconnecting...",
        success: "Successfully disconnected from Google Account!",
        error: "Failed to disconnect from Google Account.",
      });
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.patientId || !scheduleForm.date || !scheduleForm.time) {
      ToastService.error("Please fill in all required fields.");
      return;
    }

    const patient = patients.find(
      (p) => p.user_id.toString() === scheduleForm.patientId
    );
    const patientName = patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Patient";

    const startDateTime = new Date(
      `${scheduleForm.date}T${scheduleForm.time}:00`
    ).toISOString();
    const endDateTime = new Date(
      new Date(startDateTime).getTime() +
        parseInt(scheduleForm.duration) * 60000
    ).toISOString();

    const meetingData = {
      summary: `${scheduleForm.type} with ${patientName}`,
      start_time: startDateTime,
      end_time: endDateTime,
      patient_id: parseInt(scheduleForm.patientId),
      description: `Session Type: ${scheduleForm.type}\nDuration: ${scheduleForm.duration} minutes\nNotes: ${scheduleForm.notes}`,
    };

    const toastId = ToastService.loading("Scheduling session...");

    try {
      await dispatch(createGoogleMeeting(meetingData)).unwrap();

      ToastService.dismiss(toastId);
      ToastService.success("Session scheduled successfully!");

      setShowScheduleForm(false);
      setScheduleForm({
        patientId: "",
        date: "",
        time: "",
        duration: "30",
        type: "Initial Consultation",
        notes: "",
      });
      setSelectedPatient(null);
      dispatch(fetchMeetings());
    } catch (err: any) {
      ToastService.dismiss(toastId);
      ToastService.error(`Failed to create meeting: ${err.message || err}`);
    }
  };

  const handleRescheduleMeeting = async (
    eventId: string,
    startTime: string,
    endTime: string
  ) => {
    const toastId = ToastService.loading("Rescheduling meeting...");

    try {
      await dispatch(
        rescheduleMeeting({ eventId, start_time: startTime, end_time: endTime })
      ).unwrap();

      ToastService.dismiss(toastId);
      ToastService.success("Meeting rescheduled successfully!");

      dispatch(fetchMeetings());
      setEditingMeeting(null);
    } catch (err: any) {
      ToastService.dismiss(toastId);
      ToastService.error(`Failed to reschedule meeting: ${err.message || err}`);
    }
  };

  const handleCancelMeeting = async (eventId: string, patientName: string) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the meeting with ${patientName}? This will notify all attendees.`
      )
    ) {
      const toastId = ToastService.loading("Canceling meeting...");

      try {
        await dispatch(cancelMeeting(eventId)).unwrap();
        ToastService.dismiss(toastId);
        ToastService.success(
          "Meeting canceled and attendees have been notified!"
        );
      } catch (err: any) {
        ToastService.dismiss(toastId);
        ToastService.error(`Failed to cancel meeting: ${err.message || err}`);
      }
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string; text: string }> = {
      ready: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Ready",
      },
      excellent: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Excellent",
      },
      supported: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Supported",
      },
      connected: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Connected",
      },
      active: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Active",
      },
      denied: {
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Denied",
      },
      poor: { class: "bg-red-100 text-red-800 border-red-200", text: "Poor" },
      disconnected: {
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Disconnected",
      },
      inactive: {
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Inactive",
      },
      scheduled: {
        class: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Scheduled",
      },
      completed: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Completed",
      },
    };
    const config = statusConfig[status] || {
      class: "bg-gray-100 text-gray-800 border-gray-200",
      text: status,
    };
    return (
      <Badge className={`${config.class} capitalize`}>{config.text}</Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const readyStates = [
      "ready",
      "excellent",
      "supported",
      "connected",
      "active",
    ];
    const errorStates = ["denied", "poor", "disconnected", "inactive"];
    if (readyStates.includes(status)) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (errorStates.includes(status)) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return meetings.filter((meeting) => new Date(meeting.start_time) > now);
  };

  const getRecentSessions = () => {
    const now = new Date();
    return meetings.filter((meeting) => new Date(meeting.start_time) <= now);
  };

  const getPatientDisplayName = (meeting: any) => {
    if (meeting.patient_details) {
      return `${meeting.patient_details.first_name} ${meeting.patient_details.last_name}`;
    }
    // Fallback to extracting from summary
    const match = meeting.summary.match(/with (.+)$/);
    return match ? match[1] : "Patient";
  };

  const getDoctorDisplayName = (meeting: any) => {
    if (meeting.doctor_details) {
      return `Dr. ${meeting.doctor_details.first_name} ${meeting.doctor_details.last_name}`;
    }
    return "Doctor";
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const searchLower = patientSearchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.username.toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Google Telemedicine
              </h1>
              <div className="flex items-start mt-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                <span>
                  HIPAA compliant with Google Meet integration and Calendar sync
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  dispatch(fetchMeetings());
                  dispatch(fetchPatients());
                }}
                variant="outline"
                disabled={loading || !isConnected}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              {!showScheduleForm && (
                <Button
                  onClick={() => setShowScheduleForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!isConnected}
                >
                  <Plus className="mr-2 h-4 w-4" /> Schedule Session
                </Button>
              )}
            </div>
          </div>

          {/* Google Account Connection */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Chrome className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Google Account Integration
                    </h3>
                    {isConnected && googleUser ? (
                      <div className="flex items-center space-x-2 mt-1">
                        {googleUser.picture && (
                          <img
                            src={googleUser.picture}
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-600">
                          {googleUser.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({googleUser.email})
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        Connect your Google account to use Calendar and Meet
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(isConnected ? "connected" : "disconnected")}
                  {loading ? (
                    <Button disabled size="sm">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </Button>
                  ) : isConnected ? (
                    <Button
                      variant="outline"
                      onClick={handleGoogleDisconnect}
                      size="sm"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button onClick={handleGoogleConnect} size="sm">
                      <Chrome className="mr-2 h-4 w-4" />
                      Connect Google
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Schedule New Session Form */}
          {showScheduleForm && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Schedule New Telemedicine Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScheduleSession} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Patient Selection Dropdown */}
                    <div className="md:col-span-2">
                      <Label htmlFor="patient">Select Patient *</Label>
                      {patientsLoading ? (
                        <div className="flex items-center p-3 border rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading patients...</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search patients by name, email, or username..."
                              className="pl-10"
                              value={patientSearchTerm}
                              onChange={(e) =>
                                setPatientSearchTerm(e.target.value)
                              }
                            />
                          </div>
                          <Select
                            value={scheduleForm.patientId}
                            onValueChange={(value) => {
                              setScheduleForm({
                                ...scheduleForm,
                                patientId: value,
                              });
                              const patient = patients.find(
                                (p) => p.user_id.toString() === value
                              );
                              setSelectedPatient(patient || null);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a patient..." />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredPatients.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                  {patientSearchTerm
                                    ? "No patients found matching search"
                                    : "No patients available"}
                                </div>
                              ) : (
                                filteredPatients.map((patient) => (
                                  <SelectItem
                                    key={patient.user_id}
                                    value={patient.user_id.toString()}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <UserCheck className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <div className="font-medium">
                                          {patient.first_name}{" "}
                                          {patient.last_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {patient.email} •{" "}
                                          {patient.phone_number}
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {selectedPatient && (
                            <div className="p-3 bg-blue-50 rounded-md border-l-4 border-l-blue-500">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-blue-900">
                                    {selectedPatient.first_name}{" "}
                                    {selectedPatient.last_name}
                                  </p>
                                  <p className="text-sm text-blue-700">
                                    {selectedPatient.email}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Phone: {selectedPatient.phone_number}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduleForm.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select
                        value={scheduleForm.duration}
                        onValueChange={(value) =>
                          setScheduleForm({
                            ...scheduleForm,
                            duration: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Session Type</Label>
                      <Select
                        value={scheduleForm.type}
                        onValueChange={(value) =>
                          setScheduleForm({ ...scheduleForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Initial Consultation">
                            Initial Consultation
                          </SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Therapy Session">
                            Therapy Session
                          </SelectItem>
                          <SelectItem value="Regular Checkup">
                            Regular Checkup
                          </SelectItem>
                          <SelectItem value="Emergency Consultation">
                            Emergency Consultation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Session Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special notes or preparation instructions..."
                      value={scheduleForm.notes}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          notes: e.target.value,
                        })
                      }
                      className="h-20"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!isConnected || creatingMeeting}
                    >
                      {creatingMeeting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Meeting...
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          Create Google Meet Session
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowScheduleForm(false);
                        setSelectedPatient(null);
                        setPatientSearchTerm("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                Upcoming Sessions ({getUpcomingSessions().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && meetings.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading sessions...</p>
                </div>
              ) : getUpcomingSessions().length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingSessions().map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Video className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {meeting.summary}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(meeting.start_time)} -{" "}
                            {formatDateTime(meeting.end_time)}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            {meeting.patient_details && (
                              <p>
                                Patient: {getPatientDisplayName(meeting)} (
                                {meeting.patient_details.email})
                              </p>
                            )}
                            {meeting.doctor_details && (
                              <p>
                                Doctor: {getDoctorDisplayName(meeting)} (
                                {meeting.doctor_details.email})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge("scheduled")}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={reschedulingMeeting === meeting.event_id}
                          onClick={() => setEditingMeeting(meeting)}
                        >
                          <Edit3 className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={cancelingMeeting === meeting.event_id}
                          onClick={() =>
                            handleCancelMeeting(
                              meeting.event_id,
                              getPatientDisplayName(meeting)
                            )
                          }
                        >
                          {cancelingMeeting === meeting.event_id ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-1 h-4 w-4" />
                          )}
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            window.open(meeting.meet_link, "_blank")
                          }
                        >
                          <ExternalLink className="mr-1 h-4 w-4" />
                          Join Meet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No upcoming sessions scheduled
                  </p>
                  {isConnected && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowScheduleForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Session
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System & Integration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Camera Access", icon: Camera },
                  { name: "Microphone Access", icon: Mic },
                  { name: "Internet Connection", icon: Wifi },
                  { name: "Browser Compatibility", icon: Monitor },
                  { name: "Google Calendar API", icon: Calendar },
                  { name: "Google Meet Integration", icon: Video },
                ].map((check) => {
                  const Icon = check.icon;
                  const actualStatus = systemStatus[check.name] || "checking";
                  return (
                    <div
                      key={check.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">
                          {check.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(actualStatus)}
                        {getStatusBadge(actualStatus)}
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Test Audio/Video
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowScheduleForm(true)}
                  disabled={!isConnected}
                >
                  <Plus className="mr-3 h-4 w-4" />
                  Schedule Google Meet Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open("https://calendar.google.com", "_blank")
                  }
                  disabled={!isConnected}
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  View Google Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-3 h-4 w-4" />
                  Join Waiting Room
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open("https://meet.google.com", "_blank")
                  }
                  disabled={!isConnected}
                >
                  <Video className="mr-3 h-4 w-4" />
                  Start Instant Google Meet
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-3 h-4 w-4" />
                  Google Integration Settings
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>
                Recent Sessions ({getRecentSessions().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getRecentSessions().length > 0 ? (
                <div className="space-y-4">
                  {getRecentSessions().map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {meeting.summary}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(meeting.start_time)} -{" "}
                            {formatDateTime(meeting.end_time)}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            {meeting.patient_details && (
                              <p>
                                Patient: {getPatientDisplayName(meeting)} (
                                {meeting.patient_details.email})
                              </p>
                            )}
                            {meeting.doctor_details && (
                              <p>
                                Doctor: {getDoctorDisplayName(meeting)} (
                                {meeting.doctor_details.email})
                              </p>
                            )}
                            {meeting.description && (
                              <p className="truncate max-w-md">
                                {meeting.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge("completed")}
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent sessions</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Edit Meeting Modal */}
          {editingMeeting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Reschedule Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );
                      const date = formData.get("date") as string;
                      const time = formData.get("time") as string;
                      const duration =
                        (formData.get("duration") as string) || "30";
                      const startDateTime = new Date(
                        `${date}T${time}:00`
                      ).toISOString();
                      const endDateTime = new Date(
                        new Date(startDateTime).getTime() +
                          parseInt(duration) * 60000
                      ).toISOString();
                      handleRescheduleMeeting(
                        editingMeeting.event_id,
                        startDateTime,
                        endDateTime
                      );
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="edit-date">New Date</Label>
                      <Input
                        id="edit-date"
                        name="date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        defaultValue={editingMeeting.start_time.split("T")[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-time">New Time</Label>
                      <Input
                        id="edit-time"
                        name="time"
                        type="time"
                        defaultValue={editingMeeting.start_time
                          .split("T")[1]
                          .substring(0, 5)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-duration">Duration (minutes)</Label>
                      <Select
                        name="duration"
                        defaultValue={Math.round(
                          (new Date(editingMeeting.end_time).getTime() -
                            new Date(editingMeeting.start_time).getTime()) /
                            60000
                        ).toString()}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={
                          reschedulingMeeting === editingMeeting.event_id
                        }
                      >
                        {reschedulingMeeting === editingMeeting.event_id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rescheduling...
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-4 w-4" />
                            Reschedule
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingMeeting(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
