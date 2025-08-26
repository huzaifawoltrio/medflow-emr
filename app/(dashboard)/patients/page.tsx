"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
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
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchPatients } from "../../redux/features/patients/patientActions";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { patients, loading, error } = useAppSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredPatients = patients.filter(
    (p) =>
      (p.first_name &&
        p.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.last_name &&
        p.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.username &&
        p.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.chief_complaint &&
        p.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    return "P";
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Placeholder functions for dynamic styling, as these fields are not in the API response
  const getPriorityColor = (patientId: number) => {
    // Example logic: assign priority based on patient ID for demonstration
    if (patientId % 3 === 0)
      return "bg-green-100 text-green-800 border-green-200";
    if (patientId % 2 === 0)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getPriorityText = (patientId: number) => {
    if (patientId % 3 === 0) return "LOW";
    if (patientId % 2 === 0) return "MEDIUM";
    return "HIGH";
  };

  const getVitalStatusBg = (patientId: number) => {
    if (patientId % 3 === 0) return "bg-green-100";
    if (patientId % 2 === 0) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getVitalStatusColor = (patientId: number) => {
    if (patientId % 3 === 0) return "text-green-600";
    if (patientId % 2 === 0) return "text-yellow-600";
    return "text-red-600";
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
                    {patients.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {patients.filter((p) => p.user_id % 2 !== 0).length}
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
                    {patients.filter((p) => p.user_id % 2 === 0).length}
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
                    {patients.filter((p) => p.user_id % 3 === 0).length}
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
          {loading ? (
            <div className="text-center p-8">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">{error}</div>
          ) : (
            filteredPatients.map((patient) => (
              <Card
                key={patient.user_id}
                className="rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group bg-gradient-to-r from-white to-gray-50/30"
                onClick={() => router.push(`/patients/${patient.user_id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Patient Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative">
                        <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-blue-200 group-hover:ring-blue-300 transition-all">
                          <AvatarImage
                            src={patient.profile_picture_url}
                            alt={`${patient.first_name} ${patient.last_name}`}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-800 text-white text-lg font-semibold">
                            {getInitials(patient.first_name, patient.last_name)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Vital Status Indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 ${getVitalStatusBg(
                            patient.user_id
                          )} rounded-full border-3 border-white flex items-center justify-center`}
                        >
                          <Heart
                            className={`h-3 w-3 ${getVitalStatusColor(
                              patient.user_id
                            )}`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <Badge
                            className={`bg-blue-100 text-blue-800 font-medium`}
                          >
                            Active
                          </Badge>
                          {patient.allergies &&
                            patient.allergies.length > 0 && (
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
                              {patient.gender},{" "}
                              {calculateAge(patient.date_of_birth)}y •{" "}
                              {patient.username}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">
                              {patient.city}, {patient.state}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Next: 2025-09-10</span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">
                            Primary condition:{" "}
                          </span>
                          <span className="font-medium text-gray-700">
                            {patient.chief_complaint}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Priority & Status */}
                    <div className="flex flex-col items-center gap-3 lg:min-w-0">
                      <Badge
                        className={`${getPriorityColor(
                          patient.user_id
                        )} font-semibold px-3 py-1 border`}
                      >
                        {getPriorityText(patient.user_id)} PRIORITY
                      </Badge>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          Last Activity
                        </p>
                        <p className="font-medium text-gray-900">
                          Registration
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
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
                            window.open(`tel:${patient.phone_number}`);
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
                          {patient.primary_care_physician}
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
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
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
