// components/patient-detail/tabs/ClinicalNotesTab.tsx
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pin } from "lucide-react";

// Assume the note object has this structure
interface ClinicalNote {
  id: string;
  title: string;
  author: string;
  date: string; // Should be a parsable date string like "YYYY-MM-DD"
  content: string;
  providerType: "physician" | "social work" | "therapist" | "nurse";
}

interface ClinicalNotesTabProps {
  patientData: {
    clinicalNotes: ClinicalNote[];
  };
  setIsNewNoteOpen: (open: boolean) => void;
}

const PINNED_NOTE_TITLES = [
  "Biopsychosocial",
  "Initial Psychiatric Evaluation",
  "Risk assessment",
  "Treatment Plan",
];

export function ClinicalNotesTab({
  patientData,
  setIsNewNoteOpen,
}: ClinicalNotesTabProps) {
  const [sortOrder, setSortOrder] = useState("newest-to-oldest");
  const [providerFilter, setProviderFilter] = useState("all");

  const processedNotes = useMemo(() => {
    const notes = patientData.clinicalNotes || [];

    // 1. Partition notes into pinned and regular
    const pinnedNotes: ClinicalNote[] = [];
    const regularNotes: ClinicalNote[] = [];

    notes.forEach((note) => {
      if (PINNED_NOTE_TITLES.includes(note.title)) {
        pinnedNotes.push(note);
      } else {
        regularNotes.push(note);
      }
    });

    // 2. Filter the regular notes
    const filteredNotes =
      providerFilter === "all"
        ? regularNotes
        : regularNotes.filter((note) => note.providerType === providerFilter);

    // 3. Sort the filtered notes
    filteredNotes.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest-to-oldest" ? dateB - dateA : dateA - dateB;
    });

    // 4. Combine pinned notes (always on top) with sorted/filtered notes
    return [...pinnedNotes, ...filteredNotes];
  }, [patientData.clinicalNotes, sortOrder, providerFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          Clinical Documentation
        </h2>
        <Button
          onClick={() => setIsNewNoteOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Clinical Note
        </Button>
      </div>

      {/* START: Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border rounded-lg">
        <div className="flex-1 min-w-[180px]">
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Sort by Date
          </label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest-to-oldest">Newest to Oldest</SelectItem>
              <SelectItem value="oldest-to-newest">Oldest to Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Filter by Provider
          </label>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="physician">Physician</SelectItem>
              <SelectItem value="social work">Social Work</SelectItem>
              <SelectItem value="therapist">Therapist</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* END: Filter and Sort Controls */}

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          <div className="space-y-0">
            {processedNotes.length > 0 ? (
              processedNotes.map((note, index) => {
                const isPinned = PINNED_NOTE_TITLES.includes(note.title);
                return (
                  <div
                    key={note.id}
                    className={`p-4 ${
                      index !== processedNotes.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {isPinned && (
                            <Pin className="h-4 w-4 text-blue-600 fill-blue-100" />
                          )}
                          <p className="font-semibold text-slate-800">
                            {note.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.author} ({note.providerType}) on {note.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Full Note
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No clinical notes match the current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
