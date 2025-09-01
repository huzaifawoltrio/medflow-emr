// components/patient-detail/dialogs/OrderLabDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderLabDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newLabOrder: any;
  setNewLabOrder: (labOrder: any) => void;
  handleOrderLab: () => void;
}

export function OrderLabDialog({
  isOpen,
  onOpenChange,
  newLabOrder,
  setNewLabOrder,
  handleOrderLab,
}: OrderLabDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Laboratory Test</DialogTitle>
          <DialogDescription>Order lab work for the patient.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Lab Test</Label>
            <Select
              value={newLabOrder.labType}
              onValueChange={(value) =>
                setNewLabOrder({ ...newLabOrder, labType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lab test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cbc">Complete Blood Count (CBC)</SelectItem>
                <SelectItem value="bmp">Basic Metabolic Panel (BMP)</SelectItem>
                <SelectItem value="cmp">
                  Comprehensive Metabolic Panel (CMP)
                </SelectItem>
                <SelectItem value="lipid">Lipid Panel</SelectItem>
                <SelectItem value="tsh">TSH</SelectItem>
                <SelectItem value="hba1c">Hemoglobin A1C</SelectItem>
                <SelectItem value="pt-ptt">PT/PTT</SelectItem>
                <SelectItem value="urinalysis">Urinalysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Clinical Indication</Label>
            <Textarea
              placeholder="Reason for ordering this test..."
              value={newLabOrder.indication}
              onChange={(e) =>
                setNewLabOrder({ ...newLabOrder, indication: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={newLabOrder.priority}
              onValueChange={(value) =>
                setNewLabOrder({ ...newLabOrder, priority: value })
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
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              placeholder="Fasting required, etc..."
              value={newLabOrder.instructions}
              onChange={(e) =>
                setNewLabOrder({ ...newLabOrder, instructions: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleOrderLab}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Order Lab Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
