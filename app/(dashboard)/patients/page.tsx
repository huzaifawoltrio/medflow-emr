"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ChevronRight,
  Clock,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Heart,
  User,
  MapPin,
  Filter,
} from "lucide-react";

const patients = [
  {
    id: "P001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    age: 39,
    gender: "Male",
    lastActivity: "2025-08-20",
    lastActivityType: "Lab Results",
    status: "active",
    priority: "high",
    location: "Room 302B",
    primaryDoctor: "Dr. Emily Carter",
    condition: "Hypertension",
    avatar: "/avatars/01.png",
    initials: "JD",
    vitalStatus: "stable",
    nextAppt: "2025-09-05",
    allergies: ["Penicillin"],
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    age: 28,
    gender: "Female",
    lastActivity: "2025-08-19",
    lastActivityType: "Consultation",
    status: "active",
    priority: "medium",
    location: "Outpatient",
    primaryDoctor: "Dr. James Wilson",
    condition: "Diabetes Type 2",
    avatar: "/avatars/02.png",
    initials: "SJ",
    vitalStatus: "attention",
    nextAppt: "2025-08-30",
    allergies: [],
  },
  {
    id: "P003",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    phone: "(555) 234-5678",
    age: 45,
    gender: "Male",
    lastActivity: "2025-08-21",
    lastActivityType: "Medication Review",
    status: "active",
    priority: "low",
    location: "Room 105A",
    primaryDoctor: "Dr. Lisa Brown",
    condition: "Anxiety Disorder",
    avatar: "/avatars/03.png",
    initials: "MW",
    vitalStatus: "stable",
    nextAppt: "2025-09-10",
    allergies: ["Sulfa", "Latex"],
  },
  {
    id: "P004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 876-5432",
    age: 52,
    gender: "Female",
    lastActivity: "2025-08-18",
    lastActivityType: "Emergency Visit",
    status: "discharged",
    priority: "high",
    location: "Discharged",
    primaryDoctor: "Dr. Michael Chen",
    condition: "Post-op Recovery",
    avatar: "/avatars/04.png",
    initials: "ED",
    vitalStatus: "stable",
    nextAppt: "2025-09-02",
    allergies: ["Peanuts"],
  },
  {
    id: "P005",
    name: "Robert Martinez",
    email: "robert.m@example.com",
    phone: "(555) 345-6789",
    age: 67,
    gender: "Male",
    lastActivity: "2025-08-21",
    lastActivityType: "Vital Signs",
    status: "active",
    priority: "high",
    location: "ICU 201",
    primaryDoctor: "Dr. Sarah Kim",
    condition: "Cardiac Monitoring",
    avatar: "/avatars/05.png",
    initials: "RM",
    vitalStatus: "critical",
    nextAppt: "2025-08-27",
    allergies: ["Aspirin"],
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || p.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "discharged":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "text-green-600";
      case "attention":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getVitalStatusBg = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100";
      case "attention":
        return "bg-yellow-100";
      case "critical":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Patient Directory
              </h1>
              <p className="text-gray-600">
                Manage and monitor all patients across your practice
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:min-w-0 lg:flex-1 lg:max-w-2xl lg:ml-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search patients, conditions, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-12 px-4 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <Link href="/patient-intake">
                  <Button className="h-12 px-6 bg-blue-800 hover:bg-blue-700 rounded-xl font-semibold shadow-lg shadow-blue-200/50">
                    <Plus className="mr-2 h-5 w-5" />
                    New Patient
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-800">
                    {patients.filter((p) => p.status === "active").length}
                  </p>
                  <p className="text-sm text-gray-600">Active Patients</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {patients.filter((p) => p.priority === "high").length}
                  </p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      patients.filter((p) => p.vitalStatus === "attention")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Need Attention</p>
                </div>
                <Heart className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter((p) => p.vitalStatus === "stable").length}
                  </p>
                  <p className="text-sm text-gray-600">Stable</p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Patient Cards */}
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group bg-gradient-to-r from-white to-gray-50/30"
              onClick={() => router.push(`/patients/${patient.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left: Patient Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-blue-200 group-hover:ring-blue-300 transition-all">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-800 text-white text-lg font-semibold">
                          {patient.initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Vital Status Indicator */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 ${getVitalStatusBg(
                          patient.vitalStatus
                        )} rounded-full border-3 border-white flex items-center justify-center`}
                      >
                        <Heart
                          className={`h-3 w-3 ${getVitalStatusColor(
                            patient.vitalStatus
                          )}`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {patient.name}
                        </h3>
                        <Badge
                          className={`${getStatusColor(
                            patient.status
                          )} font-medium`}
                        >
                          {patient.status}
                        </Badge>
                        {patient.allergies.length > 0 && (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-700"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Allergies
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>
                            {patient.gender}, {patient.age}y • {patient.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{patient.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Next: {patient.nextAppt}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">
                          Primary condition:{" "}
                        </span>
                        <span className="font-medium text-gray-700">
                          {patient.condition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Priority & Status */}
                  <div className="flex flex-col items-center gap-3 lg:min-w-0">
                    <Badge
                      className={`${getPriorityColor(
                        patient.priority
                      )} font-semibold px-3 py-1 border`}
                    >
                      {patient.priority.toUpperCase()} PRIORITY
                    </Badge>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Last Activity
                      </p>
                      <p className="font-medium text-gray-900">
                        {patient.lastActivityType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {patient.lastActivity}
                      </p>
                    </div>
                  </div>

                  {/* Right: Contact & Action */}
                  <div className="flex flex-col lg:items-end gap-3 lg:min-w-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg hover:bg-blue-50 hover:border-blue-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${patient.phone}`);
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg hover:bg-blue-50 hover:border-blue-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${patient.email}`);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right text-sm">
                      <p className="font-medium text-gray-900 truncate">
                        {patient.primaryDoctor}
                      </p>
                      <p className="text-gray-500">Primary Physician</p>
                    </div>

                    <div className="flex items-center text-blue-800 group-hover:text-blue-700 font-medium">
                      <span className="text-sm mr-2">View Details</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="py-16 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No patients found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or add a new patient.
              </p>
              <Link href="/patient-intake">
                <Button className="bg-blue-800 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
