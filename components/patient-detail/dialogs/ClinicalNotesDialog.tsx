// components/patient-detail/dialogs/ClinicalNotesDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClinicalNotesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newNote: any;
  setNewNote: (note: any) => void;
  handleCreateNote: () => void;
}

export function ClinicalNotesDialog({
  isOpen,
  onOpenChange,
  newNote,
  setNewNote,
  handleCreateNote,
}: ClinicalNotesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>
            Document patient encounter and clinical findings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" value={newNote.patientName} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" value={newNote.patientId} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Note Type</Label>
            <Select
              value={newNote.type}
              onValueChange={(value) => setNewNote({ ...newNote, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Initial Assessment">
                  Initial Assessment
                </SelectItem>
                <SelectItem value="Progress Note">Progress Note</SelectItem>
                <SelectItem value="Therapy Session">Therapy Session</SelectItem>
                <SelectItem value="Medication Review">
                  Medication Review
                </SelectItem>
                <SelectItem value="Discharge Summary">
                  Discharge Summary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Clinical Content</Label>
            <Textarea
              id="content"
              placeholder="Enter clinical notes..."
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCodes">Billing Codes</Label>
            <Input
              id="billingCodes"
              placeholder="99213, 90834 (comma separated)"
              value={newNote.billingCodes}
              onChange={(e) =>
                setNewNote({ ...newNote, billingCodes: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newNote.status}
              onValueChange={(value) =>
                setNewNote({
                  ...newNote,
                  status: value as "draft" | "completed",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
