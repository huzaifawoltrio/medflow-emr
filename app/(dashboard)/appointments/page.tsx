"use client";

import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
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
} from "@/app/redux/features/appointments/appointmentActions";
import { Input } from "@/components/ui/input";

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

const AppointmentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // This modal remains static for now as per the request
  const [selectedDate, setSelectedDate] = useState<number | null>(18);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
    "10:30 AM"
  );
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025

  const timeSlots = [
    "8:30 AM",
    "10:30 AM",
    "12:30 PM",
    "3:30 PM",
    "6:30 PM",
    "8:30 PM",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = Array(startingDayOfWeek).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "Select a date";
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate
    );
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(
      new Date(
        currentMonth.setMonth(
          currentMonth.getMonth() + (direction === "next" ? 1 : -1)
        )
      )
    );
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const days = getDaysInMonth(currentMonth);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Left Side - Form */}
          <div className="flex-1 p-4 md:p-6 md:border-r border-gray-200 overflow-y-auto">
            {/* Header with logo */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                <span className="text-lg md:text-xl font-bold text-blue-800">
                  Daisy
                </span>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-1 hover:bg-gray-100 rounded touch-manipulation"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
              Add New
            </h2>

            {/* Upload Image */}
            <div className="mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
              <p className="text-xs md:text-sm text-gray-500">
                Upload Image here
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <Label className="text-xs md:text-sm text-gray-600 mb-1 block">
                  Name*
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter name"
                    className="pl-8 md:pl-10 border-gray-300 h-10 md:h-auto"
                  />
                  <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs md:text-sm text-gray-600 mb-1 block">
                  Role*
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Role"
                    className="pl-8 md:pl-10 border-gray-300 h-10 md:h-auto"
                  />
                  <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Display */}
            <div className="mb-3 md:mb-4">
              <p className="font-medium text-sm md:text-base text-gray-900">
                {formatSelectedDate()}
              </p>
            </div>

            {/* Time Slots */}
            <div className="space-y-2 max-h-48 md:max-h-none overflow-y-auto">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "default" : "outline"}
                  className={`w-full justify-start text-left h-10 md:h-auto touch-manipulation ${
                    selectedTimeSlot === time
                      ? "bg-blue-800 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTimeSlot(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Side - Calendar */}
          <div className="flex-1 p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200 overflow-y-auto">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-sm md:text-base text-gray-900">
                {monthName}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded touch-manipulation"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4 md:mb-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs md:text-sm text-gray-500 py-1 md:py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    disabled={!day}
                    className={`
                      h-8 md:h-10 text-xs md:text-sm rounded-lg transition-colors touch-manipulation
                      ${!day ? "invisible" : ""}
                      ${
                        selectedDate === day
                          ? "bg-blue-800 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }
                      ${
                        [14, 15, 16, 25, 26, 27, 28, 29, 30].includes(
                          day || 0
                        ) && selectedDate !== day
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Button */}
            <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white h-10 md:h-auto touch-manipulation">
              <Plus className="w-4 h-4 mr-2" />
              Add new
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CustomWeekCalendar = ({
  appointments,
  currentWeek,
  setCurrentWeek,
  onAddNewClick,
  loading,
}: {
  appointments: FormattedAppointment[];
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  onAddNewClick: () => void;
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
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = (startHour - 9) * 60 + startMin;
    const endMinutes = (endHour - 9) * 60 + endMin;
    const top = (startMinutes / 60) * 60;
    const height = ((endMinutes - startMinutes) / 60) * 60;
    return { top: `${top}px`, height: `${Math.max(height, 48)}px` };
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
    <div className="bg-white rounded-2xl border border-blue-200 p-3 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="bg-blue-800 hover:bg-blue-700"
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
                className="flex items-start pt-2 md:pt-3 text-xs text-gray-400 bg-white"
                style={{ height: "60px" }}
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
                style={{ height: "60px" }}
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
                      style={{ top: `${hourIndex * 60}px`, height: "1px" }}
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
                            className={`absolute left-2 right-2 ${appointment.color} ${appointment.borderColor} border-l-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 z-20 flex flex-col justify-start p-2 overflow-hidden`}
                            style={{
                              top: position.top,
                              height: position.height,
                              minHeight: "48px",
                            }}
                          >
                            <div className="text-xs text-gray-700 mb-1 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-current inline-block" />
                              <span className="font-semibold leading-tight">
                                {appointment.timeDisplay}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 leading-snug break-words overflow-hidden text-ellipsis line-clamp-2">
                              {appointment.title}
                            </div>
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

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 p-4 md:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {error && <p className="text-red-500">Error: {error}</p>}
            <CustomWeekCalendar
              appointments={formattedAppointments}
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              onAddNewClick={() => setIsModalOpen(true)}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Today's Summary Card */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg lg:text-xl font-semibold">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 text-sm">
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
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg lg:text-xl font-semibold">
                  Provider Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 text-sm">
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
      </div>
    </MainLayout>
  );
}
