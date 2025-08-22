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
      <DialogContent className="max-w-4xl p-0 gap-0">
        <div className="flex">
          {/* Left Side - Form */}
          <div className="flex-1 p-6 border-r border-gray-200">
            {/* Header with logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">
                  Daisy EMR
                </span>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-6">Add New</h2>

            {/* Upload Image */}
            <div className="mb-6">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Upload Image here</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Name*
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter name"
                    className="pl-10 border-gray-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Role*
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Role"
                    className="pl-10 border-gray-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Display */}
            <div className="mb-4">
              <p className="font-medium text-gray-900">
                {formatSelectedDate()}
              </p>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "default" : "outline"}
                  className={`w-full justify-start text-left ${
                    selectedTimeSlot === time
                      ? "bg-blue-600 text-white"
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
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">{monthName}</h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["So", "Mo", "Tu", "Wed", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm text-gray-500 py-2"
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
                      h-10 text-sm rounded-lg transition-colors
                      ${!day ? "invisible" : ""}
                      ${
                        selectedDate === day
                          ? "bg-blue-600 text-white"
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
    <div className="bg-white rounded-2xl border border-blue-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {formatWeekRange(currentWeek)}
        </h2>
        <div className="flex items-center gap-4">
          <Select defaultValue="february">
            <SelectTrigger className="w-32 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={onAddNewClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200 pb-4 mb-4">
          <div className="text-sm text-gray-500 font-medium">Week</div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {day.getDate()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative">
          {/* Time Labels */}
          <div className="absolute left-0 top-0 w-16">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="h-15 flex items-start pt-2 text-xs text-gray-400"
                style={{ height: "60px" }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="ml-16 relative">
            {/* Horizontal Lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-100 h-15"
                style={{ height: "60px" }}
              />
            ))}

            {/* Day Columns */}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="relative">
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
                          className={`absolute left-1 right-1 ${appointment.color} ${appointment.borderColor} border-l-4 rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                          style={position}
                        >
                          <div
                            className={`text-xs ${appointment.textColor} mb-1 flex items-center`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current mr-1 opacity-60"></div>
                            {appointment.timeDisplay}
                          </div>
                          <div
                            className={`text-sm font-medium ${appointment.textColor}`}
                          >
                            {appointment.title}
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
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CustomWeekCalendar
              appointments={dummyAppointments}
              onAddNewClick={() => setIsModalOpen(true)}
            />
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

        {/* AppointmentModal */}
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
