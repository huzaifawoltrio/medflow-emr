"use client";

import { useState, useRef, useEffect } from "react";
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
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarTitle, setCalendarTitle] = useState("");

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

  const goToNext = () => {
    calendarRef.current?.getApi().next();
  };

  const goToPrev = () => {
    calendarRef.current?.getApi().prev();
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Appointment Scheduling
            </h1>
            <p className="text-gray-500 mt-1" id="calendar-title">
              {calendarTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
                  {/* Form fields from your design */}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Schedule Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-sm h-[70vh]">
              <CardContent className="p-2 md:p-4 h-full">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={false}
                  height="100%"
                  slotMinTime="08:00:00"
                  slotMaxTime="19:00:00"
                  events={dummyAppointments}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  datesSet={(arg) => {
                    setCalendarTitle(arg.view.title);
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
        .fc .fc-toolbar {
          display: none;
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
      `}</style>
    </MainLayout>
  );
}
