"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Plus,
  Stethoscope,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchAppointments,
  Appointment,
  createAppointment,
} from "@/app/redux/features/appointments/appointmentActions";
import { fetchPatients } from "@/app/redux/features/patients/patientActions";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogPortal } from "@radix-ui/react-dialog";

// --- Helper Functions & Types ---

interface FormattedAppointment {
  id: number;
  title: string;
  date: Date; // Full date object instead of just day
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  timeDisplay: string; // "HH:mm - HH:mm"
  color: string;
  borderColor: string;
  textColor: string;
}

// This function transforms the raw API data into the format the calendar component needs
const formatAppointmentsForCalendar = (
  appointments: Appointment[] = []
): FormattedAppointment[] => {
  return appointments.map((appt) => {
    const startDate = new Date(appt.appointment_datetime);
    const endDate = new Date(startDate.getTime() + appt.duration * 60000);

    const formatTime = (date: Date) => date.toTimeString().substring(0, 5);

    return {
      id: appt.id,
      title: appt.services.join(", "),
      date: startDate, // Store the full date
      startTime: formatTime(startDate),
      endTime: formatTime(endDate),
      timeDisplay: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      // Dynamic coloring based on status (can be customized)
      color: appt.status === "Scheduled" ? "bg-blue-100" : "bg-gray-100",
      borderColor:
        appt.status === "Scheduled" ? "border-l-blue-400" : "border-l-gray-400",
      textColor:
        appt.status === "Scheduled" ? "text-blue-700" : "text-gray-700",
    };
  });
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Static data for sidebar cards
const providerAvailability = [
  { name: "Dr. Smith", status: "Available", color: "green" },
  { name: "Dr. Brown", status: "Available", color: "green" },
  { name: "Dr. Johnson", status: "Available", color: "green" },
];

// --- Components ---

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: FormattedAppointment | null;
}) => {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${appointment.color.replace(
                  "bg-",
                  "bg-"
                )}`}
              />
              <h2 className="text-xl font-semibold text-gray-900">
                Appointment Details
              </h2>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${appointment.color.replace(
                    "bg-",
                    "bg-"
                  )}`}
                />
                <span className="text-sm font-medium text-gray-600">
                  Service
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    Time
                  </span>
                </div>
                <p className="font-semibold text-gray-900">
                  {appointment.timeDisplay}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    Date
                  </span>
                </div>
                <p className="font-semibold text-gray-900">
                  {appointment.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {appointment.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Description
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {appointment.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AppointmentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patient);
  const [formData, setFormData] = useState<
    Omit<NewAppointmentData, "appointment_datetime">
  >({
    patient_id: 0,
    duration: 50,
    location: "Telehealth",
    services: ["Psychotherapy Session"],
    appointment_fee: 250.0,
    billing_type: "insurance",
    repeat: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [time, setTime] = useState({ hour: "02", minute: "00", period: "PM" });

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(fetchPatients());
    }
  }, [dispatch, patients.length]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (
    part: "hour" | "minute" | "period",
    value: string
  ) => {
    setTime((prev) => ({ ...prev, [part]: value }));
  };

  const handleSubmit = () => {
    if (!selectedDate || !formData.patient_id) {
      alert("Please select a patient and a date.");
      return;
    }

    let hour = parseInt(time.hour, 10);
    if (time.period === "PM" && hour < 12) hour += 12;
    if (time.period === "AM" && hour === 12) hour = 0;

    const appointment_datetime = new Date(selectedDate);
    appointment_datetime.setHours(hour, parseInt(time.minute, 10), 0, 0);

    const submissionData: NewAppointmentData = {
      ...formData,
      appointment_datetime: appointment_datetime.toISOString(),
    };

    dispatch(createAppointment(submissionData));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="w-full max-w-7xl max-h-[90vh] overflow-y-auto  bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            New Appointment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4 flex flex-col">
              <div>
                <Label
                  htmlFor="patient_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Patient
                </Label>
                <Select
                  onValueChange={(val) =>
                    handleInputChange("patient_id", parseInt(val))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.user_id} value={String(p.user_id)}>
                        {p.first_name} {p.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Time
                </Label>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Input
                    value={time.hour}
                    onChange={(e) => handleTimeChange("hour", e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                    placeholder="HH"
                  />
                  <span className="font-bold">:</span>
                  <Input
                    value={time.minute}
                    onChange={(e) => handleTimeChange("minute", e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                    placeholder="MM"
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      onClick={() => handleTimeChange("period", "AM")}
                      className={`w-12 ${
                        time.period === "AM"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      disabled={time.period === "AM"}
                    >
                      AM
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleTimeChange("period", "PM")}
                      className={`w-12 ${
                        time.period === "PM"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      disabled={time.period === "PM"}
                    >
                      PM
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700"
                >
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="services"
                  className="text-sm font-medium text-gray-700"
                >
                  Services (comma-separated)
                </Label>
                <Input
                  id="services"
                  value={formData.services.join(", ")}
                  onChange={(e) =>
                    handleInputChange(
                      "services",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="appointment_fee"
                  className="text-sm font-medium text-gray-700"
                >
                  Fee
                </Label>
                <Input
                  id="appointment_fee"
                  type="number"
                  value={formData.appointment_fee}
                  onChange={(e) =>
                    handleInputChange(
                      "appointment_fee",
                      parseFloat(e.target.value)
                    )
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="billing_type"
                  className="text-sm font-medium text-gray-700"
                >
                  Billing Type
                </Label>
                <Select
                  value={formData.billing_type}
                  onValueChange={(val) =>
                    handleInputChange("billing_type", val)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="self-pay">Self-Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="repeat"
                  checked={formData.repeat}
                  onCheckedChange={(checked) =>
                    handleInputChange("repeat", !!checked)
                  }
                />
                <Label htmlFor="repeat">Repeat Appointment</Label>
              </div>
            </div>

            <div className="w-full">
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-5xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-800 hover:bg-blue-700 text-white"
            >
              Create Appointment
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const CustomWeekCalendar = ({
  appointments,
  currentWeek,
  setCurrentWeek,
  onAddNewClick,
  onAppointmentClick,
  loading,
}: {
  appointments: FormattedAppointment[];
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  onAddNewClick: () => void;
  onAppointmentClick: (appointment: FormattedAppointment) => void;
  loading: boolean;
}) => {
  const getWeekDays = (startDate: Date) => {
    const days = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  // Reduced time range from 9 AM to 5 PM (8 hours instead of 10)
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = (startHour - 9) * 60 + startMin;
    const endMinutes = (endHour - 9) * 60 + endMin;
    // Increased height multiplier from 60 to 80 for taller hour rows
    const top = (startMinutes / 60) * 80;
    const height = ((endMinutes - startMinutes) / 60) * 80;
    return {
      top: `${top}px`,
      height: `${Math.max(height, 80)}px`, // Increased minimum height to match row height
    };
  };

  const formatWeekRange = (startDate: Date) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const monthName = start.toLocaleDateString("en-US", { month: "long" });
    return `${monthName} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-3 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
            className="hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-center w-48">
            {formatWeekRange(currentWeek)}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
            className="hover:bg-blue-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="bg-blue-800 hover:bg-blue-700 shadow-md transition-all duration-200"
          onClick={onAddNewClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>

      <div className="relative overflow-x-auto">
        <div className="grid grid-cols-8 border-b border-gray-200 pb-2 md:pb-4 mb-2 md:mb-4 min-w-[600px] md:min-w-0">
          <div className="text-xs md:text-sm text-gray-500 font-medium px-1">
            Time
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center px-1">
              <div className="text-xs md:text-sm font-medium text-gray-900">
                {day.getDate()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
            </div>
          ))}
        </div>

        <div className="relative min-w-[600px] md:min-w-0">
          <div className="absolute left-0 top-0 w-16 md:w-20 z-10">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="flex items-start pt-3 md:pt-4 text-xs text-gray-400 bg-white"
                style={{ height: "80px" }} // Increased from 60px to 80px
              >
                {time}
              </div>
            ))}
          </div>

          <div className="ml-16 md:ml-20 relative">
            {/* Background lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-200"
                style={{ height: "80px" }} // Increased from 60px to 80px
              />
            ))}

            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative bg-white border-r border-gray-100 last:border-r-0"
                >
                  {/* Vertical hour lines */}
                  {timeSlots.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${hourIndex * 80}px`, height: "1px" }} // Updated spacing
                    />
                  ))}

                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                    </div>
                  ) : (
                    appointments
                      .filter((apt) => isSameDay(apt.date, day))
                      .map((appointment) => {
                        const position = getAppointmentPosition(
                          appointment.startTime,
                          appointment.endTime
                        );
                        return (
                          <div
                            key={appointment.id}
                            onClick={() => onAppointmentClick(appointment)}
                            className={`
                              absolute left-1 right-1 
                              ${appointment.color} ${appointment.borderColor} 
                              border-l-4 rounded-xl shadow-sm hover:shadow-lg 
                              cursor-pointer transition-all duration-300 ease-in-out 
                              hover:scale-[1.02] hover:-translate-y-0.5 
                              z-20 flex flex-col justify-start 
                              p-3 overflow-hidden
                              backdrop-blur-sm border border-white/20
                              transform-gpu
                              active:scale-[0.98] select-none
                            `}
                            style={{
                              top: position.top,
                              height: position.height,
                              minHeight: "80px", // Updated minimum height
                            }}
                          >
                            {/* Time Header */}
                            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-current opacity-80 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-700 leading-none">
                                {appointment.timeDisplay}
                              </span>
                            </div>

                            {/* Appointment Title */}
                            <div className="flex-1 flex flex-col justify-start">
                              <div className="text-sm font-medium text-gray-900 leading-tight mb-1 break-words">
                                {appointment.title}
                              </div>

                              {/* Optional: Add description or patient name if available */}
                              {appointment.description && (
                                <div className="text-xs text-gray-600 leading-tight opacity-90 line-clamp-2">
                                  {appointment.description}
                                </div>
                              )}
                            </div>

                            {/* Removed status indicator section */}

                            {/* Hover overlay effect */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                          </div>
                        );
                      })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<FormattedAppointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const dispatch = useAppDispatch();
  const {
    appointments: rawAppointments,
    loading,
    error,
  } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    dispatch(
      fetchAppointments({
        startDate: formatDate(start),
        endDate: formatDate(end),
      })
    );
  }, [dispatch, currentWeek]);

  const formattedAppointments = useMemo(
    () => formatAppointmentsForCalendar(rawAppointments),
    [rawAppointments]
  );

  // Calculate today's summary from appointments
  const today = new Date();
  const todaysAppointments = formattedAppointments.filter((appt) =>
    isSameDay(appt.date, today)
  );

  const confirmedAppointments = todaysAppointments.filter(
    (appt) => appt.textColor === "text-blue-700" // Assuming blue means confirmed
  ).length;

  const pendingAppointments = todaysAppointments.length - confirmedAppointments;

  const handleAppointmentClick = (appointment: FormattedAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-3 md:space-y-4 p-4 md:p-0 max-h-screen overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-120px)]">
          <div className="lg:col-span-3">
            {error && <p className="text-red-500">Error: {error}</p>}
            <CustomWeekCalendar
              appointments={formattedAppointments}
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              onAddNewClick={() => setIsModalOpen(true)}
              onAppointmentClick={handleAppointmentClick}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-1 space-y-3 md:space-y-4 overflow-y-auto">
            {/* Today's Summary Card */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg font-semibold">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-base">
                    {todaysAppointments.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">
                    {confirmedAppointments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {pendingAppointments}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Provider Availability Card */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg font-semibold">
                  Provider Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {providerAvailability.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{p.name}</span>
                    <Badge
                      className={`capitalize text-xs ${
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

        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      </div>
    </MainLayout>
  );
}
