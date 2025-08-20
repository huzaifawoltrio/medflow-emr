"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Search, Plus, Clock, Users, User } from "lucide-react"

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
]

const providers = [
  { id: "all", name: "All Providers" },
  { id: "smith", name: "Dr. Smith" },
  { id: "brown", name: "Dr. Brown" },
  { id: "johnson", name: "Dr. Johnson" },
]

const providerAvailability = [
  { name: "Dr. Smith", status: "Available", color: "green" },
  { name: "Dr. Brown", status: "Available", color: "green" },
  { name: "Dr. Johnson", status: "Available", color: "green" },
]

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 7, 20)) // August 20, 2025
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [searchPatient, setSearchPatient] = useState("")
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    provider: "",
    appointmentType: "",
    duration: "30",
    notes: "",
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleScheduleAppointment = () => {
    if (selectedTimeSlot && newAppointment.patientName && newAppointment.provider) {
      const appointment = {
        id: Date.now(),
        ...newAppointment,
        time: selectedTimeSlot,
        date: selectedDate,
        status: "confirmed",
      }
      setAppointments([...appointments, appointment])
      setIsNewAppointmentOpen(false)
      setSelectedTimeSlot("")
      setNewAppointment({
        patientName: "",
        provider: "",
        appointmentType: "",
        duration: "30",
        notes: "",
      })
    }
  }

  const getAppointmentForSlot = (time: string) => {
    return appointments.find((apt) => apt.time === time && apt.date.toDateString() === selectedDate.toDateString())
  }

  const todaysAppointments = appointments.filter((apt) => apt.date.toDateString() === selectedDate.toDateString())

  const confirmedCount = todaysAppointments.filter((apt) => apt.status === "confirmed").length
  const pendingCount = todaysAppointments.filter((apt) => apt.status === "pending").length

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Appointment Scheduling</h1>
          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new appointment for {formatDate(selectedDate)}{" "}
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
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={newAppointment.provider}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, provider: value })}
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
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, appointmentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Initial Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="therapy">Therapy Session</SelectItem>
                      <SelectItem value="checkup">Regular Checkup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={newAppointment.duration}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, duration: value })}
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
                    placeholder="Additional notes or special instructions"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                  Schedule Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Patient"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Schedule for {formatDate(selectedDate)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const appointment = getAppointmentForSlot(time)
                    return (
                      <div
                        key={time}
                        className={`w-full p-4 rounded-lg border transition-colors cursor-pointer ${
                          appointment
                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                            : selectedTimeSlot === time
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          if (!appointment) {
                            setSelectedTimeSlot(time)
                            setIsNewAppointmentOpen(true)
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-lg">{time}</span>
                            </div>
                            {appointment && (
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                                  <p className="text-sm text-gray-600">
                                    {appointment.appointmentType} • {appointment.provider}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">{appointment.status}</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="text-2xl font-bold">{todaysAppointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confirmed</span>
                  <span className="text-lg font-semibold text-green-600">{confirmedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-semibold text-orange-600">{pendingCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Provider Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Provider Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {providerAvailability.map((provider) => (
                  <div key={provider.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{provider.name}</span>
                    <Badge
                      className={`${
                        provider.color === "green"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : provider.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {provider.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointments List */}
        {todaysAppointments.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {appointment.patientName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.appointmentType} • {appointment.time} • {appointment.provider}
                        </p>
                        {appointment.notes && <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-orange-100 text-orange-800 border-orange-200"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
