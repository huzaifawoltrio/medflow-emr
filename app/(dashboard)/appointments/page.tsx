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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Search, Plus, Users, User } from "lucide-react";

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const providers = [
  { id: "all", name: "All Providers" },
  { id: "smith", name: "Dr. Smith" },
  { id: "brown", name: "Dr. Brown" },
  { id: "johnson", name: "Dr. Johnson" },
];

const providerAvailability = [
  { name: "Dr. Smith", status: "Available", color: "green" },
  { name: "Dr. Brown", status: "Available", color: "green" },
  { name: "Dr. Johnson", status: "Available", color: "green" },
];

type Appointment = {
  id: number;
  patientName: string;
  provider: string;
  appointmentType: string;
  duration: string;
  notes: string;
  time: string;
  date: Date;
  status: "confirmed" | "pending";
};

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [newAppointment, setNewAppointment] = useState<
    Omit<Appointment, "id" | "time" | "date" | "status">
  >({
    patientName: "",
    provider: "",
    appointmentType: "",
    duration: "30",
    notes: "",
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleScheduleAppointment = () => {
    if (
      selectedTimeSlot &&
      newAppointment.patientName &&
      newAppointment.provider
    ) {
      const appointment: Appointment = {
        id: Date.now(),
        ...newAppointment,
        time: selectedTimeSlot,
        date: selectedDate,
        status: "confirmed",
      };
      setAppointments([...appointments, appointment]);
      setIsNewAppointmentOpen(false);
      setSelectedTimeSlot("");
      setNewAppointment({
        patientName: "",
        provider: "",
        appointmentType: "",
        duration: "30",
        notes: "",
      });
    }
  };

  const getAppointmentForSlot = (time: string) => {
    return appointments.find(
      (apt) =>
        apt.time === time &&
        apt.date.toDateString() === selectedDate.toDateString()
    );
  };

  const todaysAppointments = appointments.filter(
    (apt) => apt.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Appointment Scheduling
          </h1>
          <Dialog
            open={isNewAppointmentOpen}
            onOpenChange={setIsNewAppointmentOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Fill in details for {formatDate(selectedDate)}{" "}
                  {selectedTimeSlot && `at ${selectedTimeSlot}`}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={newAppointment.patientName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={newAppointment.provider}
                    onValueChange={(value) =>
                      setNewAppointment({ ...newAppointment, provider: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                      <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                      <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select
                    value={newAppointment.appointmentType}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        appointmentType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={newAppointment.duration}
                    onValueChange={(value) =>
                      setNewAppointment({ ...newAppointment, duration: value })
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewAppointmentOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleScheduleAppointment}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <Input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="border-gray-200 rounded-md flex-1"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Users className="h-5 w-5 text-gray-500" />
            <Select>
              <SelectTrigger className="w-full sm:w-48 border-gray-200 rounded-md">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search Patient"
              className="border-gray-200 rounded-md flex-1"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Schedule for {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const appointment = getAppointmentForSlot(time);
                    return (
                      <div
                        key={time}
                        className={`w-full p-3 rounded-lg border transition-colors cursor-pointer ${
                          appointment
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          if (!appointment) {
                            setSelectedTimeSlot(time);
                            setIsNewAppointmentOpen(true);
                          }
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-700 w-16">
                              {time}
                            </span>
                            {appointment ? (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-blue-600 hidden sm:block" />
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {appointment.appointmentType} •{" "}
                                    {appointment.provider}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Available
                              </span>
                            )}
                          </div>
                          {appointment && (
                            <Badge
                              variant="secondary"
                              className="capitalize mt-2 sm:mt-0"
                            >
                              {appointment.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-base">
                    {todaysAppointments.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">
                    {
                      todaysAppointments.filter((a) => a.status === "confirmed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {
                      todaysAppointments.filter((a) => a.status === "pending")
                        .length
                    }
                  </span>
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
    </MainLayout>
  );
}
