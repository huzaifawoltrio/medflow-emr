// components/patient-detail/tabs/ClinicalNotesTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClinicalNotesTabProps {
  patientData: any;
  setIsNewNoteOpen: (open: boolean) => void;
}

export function ClinicalNotesTab({
  patientData,
  setIsNewNoteOpen,
}: ClinicalNotesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Clinical Documentation</h2>
        <Button
          onClick={() => setIsNewNoteOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Clinical Note
        </Button>
      </div>
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          <div className="space-y-0">
            {patientData.clinicalNotes.map((note: any, index: number) => (
              <div
                key={note.id}
                className={`p-4 ${
                  index !== patientData.clinicalNotes.length - 1
                    ? "border-b"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      By {note.author} on {note.date}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
