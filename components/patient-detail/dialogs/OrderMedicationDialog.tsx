// components/patient-detail/dialogs/OrderMedicationDialog.tsx
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

interface OrderMedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMedication: any;
  setNewMedication: (medication: any) => void;
  handleOrderMedication: () => void;
}

export function OrderMedicationDialog({
  isOpen,
  onOpenChange,
  newMedication,
  setNewMedication,
  handleOrderMedication,
}: OrderMedicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order New Medication</DialogTitle>
          <DialogDescription>
            Prescribe medication for the patient.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Medication</Label>
              <Input
                placeholder="Search medication..."
                value={newMedication.medication}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    medication: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input
                placeholder="e.g., 10mg"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={newMedication.frequency}
                onValueChange={(value) =>
                  setNewMedication({ ...newMedication, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once-daily">Once daily</SelectItem>
                  <SelectItem value="twice-daily">Twice daily</SelectItem>
                  <SelectItem value="three-times-daily">
                    Three times daily
                  </SelectItem>
                  <SelectItem value="four-times-daily">
                    Four times daily
                  </SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g., 30 days"
                value={newMedication.duration}
                onChange={(e) =>
                  setNewMedication({
                    ...newMedication,
                    duration: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              placeholder="Take with food, etc..."
              value={newMedication.instructions}
              onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  instructions: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={newMedication.priority}
              onValueChange={(value) =>
                setNewMedication({ ...newMedication, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleOrderMedication}
            className="bg-blue-800 hover:bg-blue-700"
          >
            Order Medication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
