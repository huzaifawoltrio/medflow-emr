"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, ChevronRight } from "lucide-react";

const patients = [
  {
    id: "P001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    lastActivity: "2025-08-20",
    avatar: "/avatars/01.png",
    initials: "JD",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    lastActivity: "2025-08-19",
    avatar: "/avatars/02.png",
    initials: "SJ",
  },
  {
    id: "P003",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    phone: "(555) 234-5678",
    lastActivity: "2025-08-21",
    avatar: "/avatars/03.png",
    initials: "MW",
  },
  {
    id: "P004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 876-5432",
    lastActivity: "2025-08-18",
    avatar: "/avatars/04.png",
    initials: "ED",
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Patient
            </Button>
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
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b last:border-b-0">
                      <td className="p-4">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="flex items-center space-x-4 group"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={patient.avatar}
                              alt={patient.name}
                            />
                            <AvatarFallback>{patient.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {patient.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {patient.id}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm text-gray-800">{patient.email}</p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-800">
                          {patient.lastActivity}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
