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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Stethoscope, X, ChevronLeft, ChevronRight } from "lucide-react";

const dummyAppointments = [
  {
    id: 1,
    title: "Doctor/Staff Schedule",
    day: 0, // Sunday
    startTime: "09:00",
    endTime: "10:20",
    timeDisplay: "09:00 - 10:20",
    color: "bg-blue-100",
    borderColor: "border-l-blue-400",
    textColor: "text-blue-700",
  },
  {
    id: 2,
    title: "Doctor/Staff Schedule",
    day: 1, // Monday
    startTime: "10:30",
    endTime: "11:50",
    timeDisplay: "10:30 - 11:50",
    color: "bg-blue-200",
    borderColor: "border-l-blue-500",
    textColor: "text-blue-800",
  },
  {
    id: 3,
    title: "Doctor/Staff Schedule",
    day: 2, // Tuesday
    startTime: "12:45",
    endTime: "14:00",
    timeDisplay: "12:45 - 14:00",
    color: "bg-cyan-100",
    borderColor: "border-l-cyan-400",
    textColor: "text-cyan-700",
  },
];

const providerAvailability = [
  { name: "Dr. Smith", status: "Available", color: "green" },
  { name: "Dr. Brown", status: "Available", color: "green" },
  { name: "Dr. Johnson", status: "Available", color: "green" },
];

// AppointmentModal Component
const AppointmentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 8)); // September 2023

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

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "Monday, 18. September";
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
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
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
                <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <span className="text-lg md:text-xl font-bold text-blue-600">
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
  onAddNewClick,
}: {
  appointments: typeof dummyAppointments;
  onAddNewClick: () => void;
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date(2025, 1, 14)); // February 14, 2025
  const [isMobile, setIsMobile] = useState(false);

  const getWeekDays = (startDate: Date) => {
    const days = [];
    const start = new Date(startDate);

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

    const top = (startMinutes / 60) * 60; // 60px per hour
    const height = ((endMinutes - startMinutes) / 60) * 60;

    return { top: `${top}px`, height: `${height}px` };
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const monthName = startDate.toLocaleDateString("en-US", { month: "long" });
    return `${monthName}, ${startDate.getDate()}-${endDate.getDate()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-3 md:p-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {formatWeekRange(currentWeek)}
        </h2>
        <div className="flex items-center gap-2 md:gap-4">
          <Select defaultValue="february">
            <SelectTrigger className="w-24 md:w-32 border-gray-300 h-9 md:h-auto text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-blue-800 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm md:text-base h-9 md:h-auto touch-manipulation"
            onClick={onAddNewClick}
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Add new</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200 pb-2 md:pb-4 mb-2 md:mb-4 min-w-[600px] md:min-w-0">
          <div className="text-xs md:text-sm text-gray-500 font-medium px-1">
            Week
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

        {/* Time Grid */}
        <div className="relative min-w-[600px] md:min-w-0">
          {/* Time Labels */}
          <div className="absolute left-0 top-0 w-12 md:w-16">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="h-12 md:h-15 flex items-start pt-1 md:pt-2 text-xs text-gray-400"
                style={{ height: "48px" }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="ml-12 md:ml-16 relative">
            {/* Horizontal Lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-100 h-12 md:h-15"
                style={{ height: "48px" }}
              />
            ))}

            {/* Day Columns */}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative border-r border-gray-50 last:border-r-0"
                >
                  {/* Appointments for this day */}
                  {appointments
                    .filter((apt) => apt.day === dayIndex)
                    .map((appointment) => {
                      const position = getAppointmentPosition(
                        appointment.startTime,
                        appointment.endTime
                      );
                      return (
                        <div
                          key={appointment.id}
                          className={`absolute left-0.5 right-0.5 md:left-1 md:right-1 ${appointment.color} ${appointment.borderColor} border-l-2 md:border-l-4 rounded-md p-1 md:p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow touch-manipulation`}
                          style={{
                            top: position.top,
                            height: position.height,
                            minHeight: "32px",
                          }}
                        >
                          <div
                            className={`text-xs ${appointment.textColor} mb-1 flex items-center`}
                          >
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current mr-1 opacity-60"></div>
                            <span className="truncate">
                              {appointment.timeDisplay}
                            </span>
                          </div>
                          <div
                            className={`text-xs md:text-sm font-medium ${appointment.textColor} leading-tight`}
                          >
                            <span className="line-clamp-2">
                              {appointment.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 p-4 md:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <CustomWeekCalendar
              appointments={dummyAppointments}
              onAddNewClick={() => setIsModalOpen(true)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg lg:text-xl font-semibold">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 text-sm">
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

        {/* AppointmentModal */}
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
