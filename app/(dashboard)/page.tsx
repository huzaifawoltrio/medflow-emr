"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  Pill,
  DollarSign,
  Search,
  ExternalLink,
  CheckCircle2,
  CalendarCheck,
  ScanLine,
  FileText,
  Clock,
  Plus,
  AlertTriangle,
} from "lucide-react";
import type { ComponentType } from "react";
import Link from "next/link";

// Mock data for pending notes
const initialPendingNotes = [
  {
    id: 1,
    patientName: "John Doe",
    encounterId: "ENC001",
    encounterDate: "2024-09-08",
    encounterTime: "09:00 AM",
    status: "No note created",
    encounterType: "Follow-up",
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    encounterId: "ENC002",
    encounterDate: "2024-09-07",
    encounterTime: "02:30 PM",
    status: "Draft saved",
    encounterType: "Initial Consult",
  },
  {
    id: 3,
    patientName: "Emma Davis",
    encounterId: "ENC003",
    encounterDate: "2024-09-06",
    encounterTime: "11:15 AM",
    status: "No note created",
    encounterType: "Therapy Session",
  },
];

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

// Component for individual pending note items
const PendingNoteItem = ({
  note,
  onCreateNote,
  onRemoveNote,
}: {
  note: any;
  onCreateNote: (note: any) => void;
  onRemoveNote: (id: number) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "Draft saved") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
          Draft saved
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
        No note created
      </Badge>
    );
  };

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {note.patientName}
            </p>
            {getStatusBadge(note.status)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDate(note.encounterDate)} • {note.encounterTime}
            </span>
          </div>
          <p className="text-xs text-gray-600">{note.encounterType}</p>
        </div>
        <div className="flex flex-col space-y-1">
          <Button
            size="sm"
            onClick={() => onCreateNote(note)}
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-7"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create Note
          </Button>
          {note.status === "Draft saved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveNote(note.id)}
              className="text-xs px-2 py-1 h-6"
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [pendingNotes, setPendingNotes] = useState(initialPendingNotes);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulate automatic note creation tracking
  useEffect(() => {
    // This would typically connect to your EMR system to track new encounters
    const checkForNewEncounters = () => {
      // Mock logic for demonstration
      console.log("Checking for new encounters without notes...");
      // In a real implementation, this would:
      // 1. Query your EMR database for recent encounters
      // 2. Check if clinical notes exist for each encounter
      // 3. Add missing notes to the pending list
      // 4. Update the state with new pending notes
    };

    const interval = setInterval(checkForNewEncounters, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCreateNote = (note: any) => {
    console.log("Creating note for:", note);

    // Update status to "Draft saved" when user starts creating a note
    setPendingNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, status: "Draft saved" } : n))
    );

    // In a real implementation, this would:
    // 1. Navigate to the clinical notes page
    // 2. Pre-populate the form with encounter data
    // 3. Set the encounter ID for the note
    alert(
      `Opening clinical note for ${note.patientName} - ${note.encounterType} on ${note.encounterDate}`
    );

    // Example navigation (uncomment and modify for your routing):
    // router.push(`/clinical-notes/new?encounterId=${note.encounterId}&patientName=${note.patientName}`);
  };

  const handleRemoveNote = (noteId: number) => {
    // Remove completed note from pending list
    setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));

    // In a real implementation, this would also:
    // 1. Update the encounter status in the database
    // 2. Mark the clinical note as completed
    // 3. Trigger any completion workflows
    console.log("Marking note as complete:", noteId);
  };

  const handleViewAllPending = () => {
    console.log("Opening full pending notes view");
    // In a real implementation, navigate to dedicated pending notes page:
    // router.push('/pending-notes');
  };

  const filteredPendingNotes = pendingNotes.filter((note) =>
    note.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Good morning, Dr. Johnson
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your practice today.
            </p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 w-full"
              />
            </div>
          </div>
        </div>

        {/* Stat Cards Grid - Updated to include Pending Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <Card className="bg-blue-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-blue-800">
                  Appointments
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
                  12
                </div>
              </div>
              <div className="p-3 bg-blue-800 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-green-800">
                  Active Messages
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-green-900 mt-2">
                  7
                </div>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
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

          {/* New Pending Notes Card */}
          <Card className="bg-amber-50 border-none rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-medium text-amber-800">
                  Pending Notes
                </CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-amber-900 mt-2">
                  {pendingNotes.length}
                </div>
              </div>
              <div className="p-3 bg-amber-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Quick Actions */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Responsive grid for actions */}
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
                      icon={ExternalLink}
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

            {/* NEW: Pending Notes Section */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg md:text-xl font-semibold flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  Pending Notes ({filteredPendingNotes.length})
                </CardTitle>
                {pendingNotes.length > 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAllPending}
                  >
                    View All
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredPendingNotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm">No pending clinical notes.</p>
                  </div>
                ) : (
                  filteredPendingNotes
                    .slice(0, 3)
                    .map((note) => (
                      <PendingNoteItem
                        key={note.id}
                        note={note}
                        onCreateNote={handleCreateNote}
                        onRemoveNote={handleRemoveNote}
                      />
                    ))
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
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
            {/* Today's Schedule */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-800 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-gray-500">Follow-up • 9:00 AM</p>
                  </div>
                  <Badge className="bg-blue-800 hover:bg-blue-700 text-xs">
                    Next
                  </Badge>
                </div>
                <div className="p-3 bg-white border-l-4 border-gray-200 rounded-md">
                  <p className="font-semibold text-sm">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">
                    Initial Consult • 10:30 AM
                  </p>
                </div>
                <div className="p-3 bg-white border-l-4 border-gray-200 rounded-md">
                  <p className="font-semibold text-sm">Mike Wilson</p>
                  <p className="text-xs text-gray-500">
                    Therapy Session • 2:00 PM
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Button variant="outline" className="w-full bg-white">
                  View Full Schedule
                </Button>
              </div>
            </Card>

            {/* Priority Messages */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Priority Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      Urgent
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Patient Portal
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">
                    Mike Wilson
                  </p>
                  <p className="text-xs text-gray-600">
                    Experiencing severe side effects...
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      Follow-up
                    </Badge>
                    <span className="text-xs text-gray-500">Staff Message</span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">
                    Nurse Janet
                  </p>
                  <p className="text-xs text-gray-600">
                    Lab results ready for J. Doe's review
                  </p>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-100">
                <Button variant="outline" className="w-full bg-white">
                  View All Messages
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
