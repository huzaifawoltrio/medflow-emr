"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";

export const PendingNoteItem = ({
  note,
}: {
  note: any;
  onCreateNote: (note: any) => void;
  onRemoveNote: (id: number) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "Draft saved") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
          Draft saved
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
        No note created
      </Badge>
    );
  };

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {note.patientName}
            </p>
            {getStatusBadge(note.status)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDate(note.encounterDate)} • {note.encounterTime}
            </span>
          </div>
          <p className="text-xs text-gray-600">{note.encounterType}</p>
        </div>
        <div className="flex flex-col space-y-1">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-7"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create Note
          </Button>
          {note.status === "Draft saved" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1 h-6"
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
