"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, User } from "lucide-react";
import { Patient } from "../../app/redux/features/patients/patientActions";

interface PendingNoteItemProps {
  patient: Patient;
}

export const PendingNoteItem = ({ patient }: PendingNoteItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDaysSinceRegistration = (dateString?: string) => {
    if (!dateString) return 0;
    const registrationDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceRegistration = calculateDaysSinceRegistration(
    patient.created_at
  );

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <User className="h-4 w-4 text-gray-500" />
            <p className="font-semibold text-sm text-gray-900 truncate">
              {patient.first_name} {patient.last_name}
            </p>
            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
              No notes
            </Badge>
          </div>

          {patient.created_at && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
              <Calendar className="h-3 w-3" />
              <span>Registered: {formatDate(patient.created_at)}</span>
            </div>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>DOB: {formatDate(patient.date_of_birth)}</span>
            {daysSinceRegistration > 0 && (
              <span className="text-amber-600 font-medium">
                {daysSinceRegistration} day
                {daysSinceRegistration !== 1 ? "s" : ""} without notes
              </span>
            )}
          </div>
        </div>

        {/* <Link href={`/patients/${patient.username}`}>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-8 shrink-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create Note
          </Button>
        </Link> */}
      </div>
    </div>
  );
};
