"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

// Dummy data for appointments
const dummyAppointments: EventInput[] = [
  {
    title: "Dr. Smith - John Doe",
    start: "2025-08-20T09:00:00",
    end: "2025-08-20T10:20:00",
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    textColor: "#1e40af",
  },
  {
    title: "Dr. Brown - Sarah Johnson",
    start: "2025-08-21T10:30:00",
    end: "2025-08-21T11:50:00",
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    textColor: "#1e40af",
  },
  {
    title: "Dr. Smith - Mike Wilson",
    start: "2025-08-22T12:30:00",
    end: "2025-08-22T13:50:00",
    backgroundColor: "#cceeff",
    borderColor: "#99ddff",
    textColor: "#007799",
  },
];

const providerAvailability = [
  { name: "Dr. Smith", status: "Available", color: "green" },
  { name: "Dr. Brown", status: "Available", color: "green" },
  { name: "Dr. Johnson", status: "Available", color: "green" },
];

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (arg: any) => {
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    alert(
      `Appointment Details:\nPatient: ${
        arg.event.title
      }\nTime: ${arg.event.start.toLocaleTimeString()}`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Input id="patient" placeholder="Search patient name or ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-type">Appointment Type</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapy">Therapy Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select defaultValue="45">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" placeholder="Additional notes..." />
                </div>
              </div>
              <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Schedule Appointment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-sm h-[70vh]">
              <CardContent className="p-2 md:p-4 h-full">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev",
                    center: "title",
                    right: "next",
                  }}
                  height="auto"
                  contentHeight="auto"
                  expandRows={true}
                  slotMinTime="08:00:00"
                  slotMaxTime="17:00:00"
                  allDaySlot={false}
                  hiddenDays={[0]} // Hides Sunday
                  events={dummyAppointments}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  titleFormat={{
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-base">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">0</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Provider Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {providerAvailability.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{p.name}</span>
                    <Badge
                      className={`capitalize ${
                        p.color === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .fc {
          border: none;
        }
        .fc-header-toolbar {
          padding-bottom: 1rem;
          font-size: 1rem;
        }
        .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .fc .fc-button {
          background-color: transparent;
          border: 1px solid #e5e7eb;
          color: #4b5563;
        }
        .fc .fc-button:hover {
          background-color: #f3f4f6;
        }
        .fc .fc-col-header-cell {
          background-color: #f9fafb;
          border: none;
          padding: 1rem 0;
          font-weight: 500;
          color: #4b5563;
        }
        .fc .fc-daygrid-day-number,
        .fc .fc-timegrid-slot-label {
          color: #6b7280;
        }
        .fc .fc-timegrid-slot-lane {
          border-color: #f3f4f6;
        }
        .fc .fc-timegrid-col.fc-day-today {
          background-color: #eff6ff;
        }
        .fc-event {
          border-radius: 6px;
          padding: 4px 6px;
          font-size: 12px;
          cursor: pointer;
        }
        .fc-v-event .fc-event-main {
          color: inherit;
        }

        /* FIX white space on right */
        .fc-scroller {
          overflow-x: hidden !important;
        }
        .fc-scrollgrid {
          margin-right: 0 !important;
        }
      `}</style>
    </MainLayout>
  );
}
