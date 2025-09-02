"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchDetailedPatients } from "../../redux/features/patients/patientActions";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Heart,
  User,
  MapPin,
  Filter,
  Clock,
} from "lucide-react";

/**
 * Calculates age based on a date of birth string.
 * @param dobString - The date of birth string (e.g., "YYYY-MM-DD").
 * @returns The calculated age in years.
 */
const calculateAge = (dobString: string | undefined): number => {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Formats a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculates time difference from now
 * @param dateString - ISO date string
 * @returns Human readable time difference
 */
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

/**
 * Determines patient priority based on pain level and other factors
 */
const getPatientPriority = (painLevel: number, allergies: string): string => {
  if (painLevel >= 8) return "high";
  if (painLevel >= 5 || allergies.toLowerCase().includes("severe"))
    return "medium";
  return "low";
};

/**
 * Determines vital status based on pain level
 */
const getVitalStatus = (painLevel: number): string => {
  if (painLevel >= 8) return "critical";
  if (painLevel >= 5) return "attention";
  return "stable";
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { detailedPatients, loading, error } = useSelector(
    (state: RootState) => state.patient
  );

  useEffect(() => {
    dispatch(fetchDetailedPatients());
  }, [dispatch]);

  // Transform detailed backend data to match the structure expected by the UI components
  const transformedPatients =
    detailedPatients?.map((patient) => {
      const priority = getPatientPriority(
        patient.current_pain_level,
        patient.allergies
      );
      const vitalStatus = getVitalStatus(patient.current_pain_level);
      return {
        id: patient.user_id.toString(),
        name: `${patient.first_name} ${patient.last_name}`,
        username: patient.username,
        email: patient.email,
        phone: patient.phone_number,
        age: calculateAge(patient.date_of_birth),
        gender: patient.gender,
        lastActivity: formatDate(patient.last_login),
        lastActivityType: "Last Login",
        status: patient.is_active ? "active" : "inactive",
        priority: priority,
        location: patient.address
          ? `${patient.address}, ${patient.city}`
          : "N/A",
        primaryDoctor: patient.primary_care_physician || "Dr. Unassigned",
        condition: patient.chief_complaint || "General Checkup",
        avatar: patient.profile_picture_url,
        initials: `${patient.first_name?.[0] || ""}${
          patient.last_name?.[0] || ""
        }`.toUpperCase(),
        vitalStatus: vitalStatus,
        nextAppt: "Pending", // Could be calculated from appointments if available
        allergies: patient.allergies
          ? patient.allergies.split(",").map((a) => a.trim())
          : [],
        painLevel: patient.current_pain_level,
        lastLogin: getTimeAgo(patient.last_login),
        createdAt: formatDate(patient.created_at),
      };
    }) || [];

  const filteredPatients = transformedPatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase());

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
      case "inactive":
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
  console.log("the patient details are ", filteredPatients);
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Enhanced Header */}
        <div className=" p-6 ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Patient Directory
              </h1>
              <p className="text-gray-600">
                Manage and monitor all patients across your practice
              </p>
              {detailedPatients.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {detailedPatients.length} total patients •{" "}
                  {filteredPatients.length} showing
                </p>
              )}
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
        </div>

        {/* Enhanced Patient Cards */}
        {loading && (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading patient data...</p>
          </div>
        )}
        {error && (
          <div className="text-center p-10">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 font-medium">
                  Error fetching data: {error}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        {!loading && !error && (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className="rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group bg-gradient-to-r from-white to-gray-50/30"
                onClick={() => router.push(`/patients/${patient.username}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Patient Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative">
                        <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-blue-200 group-hover:ring-blue-300 transition-all">
                          <AvatarImage
                            src={patient.avatar}
                            alt={patient.name}
                          />
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
                          {patient.painLevel >= 8 && (
                            <Badge className="bg-red-100 text-red-700">
                              Pain: {patient.painLevel}/10
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>
                              {patient.gender}, {patient.age}y • @
                              {patient.username}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{patient.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Last login: {patient.lastLogin}</span>
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

                        {patient.painLevel > 0 && (
                          <div className="mt-1 text-sm">
                            <span className="text-gray-500">Pain level: </span>
                            <span
                              className={`font-medium ${
                                patient.painLevel >= 8
                                  ? "text-red-600"
                                  : patient.painLevel >= 5
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {patient.painLevel}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center: Activity & Registration Info */}
                    <div className="flex flex-col items-center gap-3 lg:min-w-0">
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

                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Patient Since
                        </p>
                        <p className="text-xs text-gray-600">
                          {patient.createdAt}
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

                      {/* Priority Badge */}
                      <Badge
                        className={`${getPriorityColor(
                          patient.priority
                        )} text-xs font-medium`}
                      >
                        {patient.priority.toUpperCase()} Priority
                      </Badge>

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
        )}

        {/* Empty State */}
        {!loading && !error && filteredPatients.length === 0 && searchTerm && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="py-16 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No patients found
              </h3>
              <p className="text-gray-600 mb-6">
                No patients match your search criteria. Try adjusting your
                search terms.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && detailedPatients.length === 0 && !searchTerm && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="py-16 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No patients found
              </h3>
              <p className="text-gray-600 mb-6">
                No patient records were found. Try adding a new patient to get
                started.
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
