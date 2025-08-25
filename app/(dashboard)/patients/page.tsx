"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, ChevronRight, Loader2 } from "lucide-react";
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Patient Directory
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/patient-intake">
              <Button className="bg-blue-800 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> New Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Patient List */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Patient
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">
                      Contact
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">
                      Last Activity
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center p-8">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                        <p className="mt-2 text-gray-500">
                          Loading patients...
                        </p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="text-center p-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient.user_id}
                        className="border-b last:border-b-0 hover:bg-gray-50/70 transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(`/patients/${patient.user_id}`)
                        }
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={patient.profile_picture_url || ""}
                                alt={`${patient.first_name} ${patient.last_name}`}
                              />
                              <AvatarFallback>
                                {getInitials(
                                  patient.first_name,
                                  patient.last_name
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {patient.first_name} {patient.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {patient.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-sm text-gray-800">
                            {patient.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {patient.phone_number}
                          </p>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <p className="text-sm text-gray-800">
                            {/* Placeholder for last activity */}
                            2025-08-25
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
