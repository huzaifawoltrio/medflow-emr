"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  UserCheck,
  Mail,
  CalendarDays,
  ExternalLink,
  LogOut,
  User,
  Phone,
  FileText,
  Chrome,
} from "lucide-react";

// Dummy Google user data
const dummyGoogleUser = {
  id: "123456789",
  name: "Dr. Sarah Johnson",
  email: "dr.sarah@mediclinic.com",
  picture:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  isConnected: true,
};

// Dummy upcoming sessions with Google Meet links
const upcomingSessions = [
  {
    id: 1,
    patient: "Mike Wilson",
    patientEmail: "mike.wilson@email.com",
    date: "2025-09-02",
    time: "14:00",
    type: "Follow-up Consultation",
    duration: "30 min",
    status: "scheduled",
    meetLink: "https://meet.google.com/abc-defg-hij",
    calendarEventId: "event_123",
  },
  {
    id: 2,
    patient: "Emma Davis",
    patientEmail: "emma.davis@email.com",
    date: "2025-09-02",
    time: "15:30",
    type: "Initial Consultation",
    duration: "45 min",
    status: "scheduled",
    meetLink: "https://meet.google.com/klm-nopq-rst",
    calendarEventId: "event_124",
  },
];

const recentSessions = [
  {
    id: 1,
    patient: "Mike Wilson",
    date: "2025-08-30",
    type: "Initial Consultation",
    duration: "45 min",
    status: "completed",
    meetLink: "https://meet.google.com/xyz-abcd-efg",
    notes: "Patient responded well to treatment plan",
  },
];

export default function GoogleTelemedicine() {
  const [systemStatus, setSystemStatus] = useState({});
  const [isGoogleConnected, setIsGoogleConnected] = useState(
    dummyGoogleUser.isConnected
  );
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    patientName: "",
    patientEmail: "",
    date: "",
    time: "",
    duration: "30",
    type: "consultation",
    notes: "",
  });

  useEffect(() => {
    const checkSystems = async () => {
      const checks = {};
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        checks["Camera Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Camera Access"] = "denied";
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        checks["Microphone Access"] = "ready";
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        checks["Microphone Access"] = "denied";
      }
      checks["Internet Connection"] = "excellent";
      checks["Browser Compatibility"] = "supported";
      checks["Google Calendar API"] = isGoogleConnected
        ? "connected"
        : "disconnected";
      checks["Google Meet Integration"] = isGoogleConnected
        ? "active"
        : "inactive";
      setSystemStatus(checks);
    };
    checkSystems();
  }, [isGoogleConnected]);

  const handleGoogleConnect = () => {
    // Dummy Google OAuth flow
    console.log("Initiating Google OAuth...");
    setTimeout(() => {
      setIsGoogleConnected(true);
      alert("Successfully connected to Google Account!");
    }, 1000);
  };

  const handleGoogleDisconnect = () => {
    setIsGoogleConnected(false);
    alert("Disconnected from Google Account");
  };

  const handleScheduleSession = (e) => {
    e.preventDefault();
    console.log("Scheduling session with Google Calendar:", scheduleForm);

    // Dummy API call simulation
    setTimeout(() => {
      alert(`Session scheduled successfully! 
      
Patient: ${scheduleForm.patientName}
Date: ${scheduleForm.date} at ${scheduleForm.time}
Google Meet link will be sent to: ${scheduleForm.patientEmail}
Calendar event created in your Google Calendar`);

      setShowScheduleForm(false);
      setScheduleForm({
        patientName: "",
        patientEmail: "",
        date: "",
        time: "",
        duration: "30",
        type: "consultation",
        notes: "",
      });
    }, 1500);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
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

  const getStatusIcon = (status) => {
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

  return (
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
            {!showScheduleForm && (
              <Button
                onClick={() => setShowScheduleForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
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
                  {isGoogleConnected ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                        src={dummyGoogleUser.picture}
                        alt="Profile"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        {dummyGoogleUser.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({dummyGoogleUser.email})
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
                {getStatusBadge(
                  isGoogleConnected ? "connected" : "disconnected"
                )}
                {isGoogleConnected ? (
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
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="patientName"
                        className="pl-10"
                        value={scheduleForm.patientName}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            patientName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="patientEmail">Patient Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="patientEmail"
                        type="email"
                        className="pl-10"
                        value={scheduleForm.patientEmail}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            patientEmail: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduleForm.date}
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
                    <Label htmlFor="time">Time</Label>
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
                    <select
                      id="duration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleForm.duration}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          duration: e.target.value,
                        })
                      }
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="type">Session Type</Label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleForm.type}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="consultation">Initial Consultation</option>
                      <option value="followup">Follow-up</option>
                      <option value="therapy">Therapy Session</option>
                      <option value="checkup">Regular Checkup</option>
                    </select>
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
                    disabled={!isGoogleConnected}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isGoogleConnected
                      ? "Create Google Meet Session"
                      : "Connect Google First"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Today's Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.patient}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.time} • {session.type} • {session.duration}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.patientEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(session.status)}
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Join Google Meet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sessions scheduled for today</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowScheduleForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Schedule New Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced System Check */}
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

          {/* Enhanced Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowScheduleForm(true)}
                disabled={!isGoogleConnected}
              >
                <Plus className="mr-3 h-4 w-4" />
                Schedule Google Meet Session
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-3 h-4 w-4" />
                View Google Calendar
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-3 h-4 w-4" />
                Join Waiting Room
              </Button>

              <Button variant="outline" className="w-full justify-start">
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

        {/* Recent Sessions with Meet Links */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.patient}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.date} • {session.type} • {session.duration}
                        </p>
                        {session.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(session.status)}
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Summary
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
      </div>
    </div>
  );
}
