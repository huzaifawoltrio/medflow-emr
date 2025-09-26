// components/patient-detail/dialogs/DiscontinueMedicationDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Loader2, AlertTriangle, Ban } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  discontinueMedication,
  type Medication,
} from "../../../app/redux/features/medications/medicationActions";
import { clearError } from "../../../app/redux/features/medications/medicationSlice";
import type { RootState, AppDispatch } from "../../../app/redux/store";
import { ToastService } from "@/services/toastService";

interface DiscontinueMedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medication: Medication | null;
}

// Common discontinuation reasons
const discontinuationReasons = [
  "Treatment completed",
  "Side effects",
  "Allergic reaction",
  "Drug interaction",
  "Ineffective treatment",
  "Patient request",
  "Medication change",
  "Contraindication developed",
  "Cost concerns",
  "Non-compliance",
  "Other",
];

export function DiscontinueMedicationDialog({
  isOpen,
  onOpenChange,
  medication,
}: DiscontinueMedicationDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { operationLoading, error } = useSelector(
    (state: RootState) => state.medications
  );

  const [discontinueReason, setDiscontinueReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDiscontinueReason("");
      setCustomReason("");
      setReasonError("");
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error && isOpen) {
      ToastService.error(`Failed to discontinue medication: ${error}`);
    }
  }, [error, isOpen]);

  const validateForm = () => {
    if (!discontinueReason) {
      setReasonError("Please select a reason for discontinuation");
      return false;
    }
    if (discontinueReason === "Other" && !customReason.trim()) {
      setReasonError("Please provide a custom reason");
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleDiscontinue = async () => {
    if (!medication || !validateForm()) return;

    const finalReason =
      discontinueReason === "Other" ? customReason.trim() : discontinueReason;

    // Show loading toast and handle the operation
    const loadingToastId = ToastService.loading("Discontinuing medication...");

    try {
      const result = await dispatch(
        discontinueMedication({
          id: medication.id,
          reason: finalReason,
        })
      ).unwrap();

      // Dismiss loading toast and show success
      ToastService.dismiss(loadingToastId);
      ToastService.success(
        `Medication "${medication.generic_name}" discontinued successfully!`
      );

      onOpenChange(false);
    } catch (error: any) {
      // Dismiss loading toast and show error
      ToastService.dismiss(loadingToastId);
      ToastService.error(
        error?.message || "Failed to discontinue medication. Please try again."
      );
      console.error("Failed to discontinue medication:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Inactive
          </Badge>
        );
      case "discontinued":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Discontinued
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!medication) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-600" />
            Discontinue Medication
          </DialogTitle>
          <DialogDescription>
            This action will mark the medication as discontinued and move it to
            the medication history. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Only show error alert for non-toast handled errors */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          {/* Medication Summary */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {medication.generic_name}
                    {medication.brand_name && (
                      <span className="text-gray-600 font-normal ml-1">
                        ({medication.brand_name})
                      </span>
                    )}
                  </h3>
                  {getStatusBadge(medication.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Strength:</span>{" "}
                    {medication.strength}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>{" "}
                    {medication.frequency}
                  </div>
                  <div>
                    <span className="font-medium">Route:</span>{" "}
                    {medication.route_of_administration}
                  </div>
                  <div>
                    <span className="font-medium">Started:</span>{" "}
                    {formatDate(medication.start_date)}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Indication:</span>{" "}
                    {medication.indication}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Discontinuation Warning */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p className="font-semibold">Important Information:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>
                    This medication will be marked as discontinued immediately
                  </li>
                  <li>The patient should be informed of this change</li>
                  <li>
                    Consider any withdrawal effects or tapering requirements
                  </li>
                  <li>
                    This action will be recorded in the patient's medical record
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Reason for Discontinuation */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="discontinue-reason"
                className="text-base font-medium"
              >
                Reason for Discontinuation{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={discontinueReason}
                onValueChange={(value) => {
                  setDiscontinueReason(value);
                  if (reasonError) setReasonError("");
                }}
              >
                <SelectTrigger
                  id="discontinue-reason"
                  className={reasonError ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select reason for discontinuation" />
                </SelectTrigger>
                <SelectContent>
                  {discontinuationReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {reasonError && (
                <p className="text-sm text-red-500">{reasonError}</p>
              )}
            </div>

            {/* Custom reason input when "Other" is selected */}
            {discontinueReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason" className="text-sm font-medium">
                  Please specify the reason{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Enter the specific reason for discontinuing this medication..."
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  className={
                    reasonError && discontinueReason === "Other"
                      ? "border-red-500"
                      : ""
                  }
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Please provide a clear and detailed explanation for
                  discontinuing this medication.
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Note:</span> After discontinuing
              this medication, it will appear in the "Medication History"
              section and will no longer be considered an active prescription
              for this patient.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={operationLoading.discontinue}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDiscontinue}
            variant="destructive"
            disabled={operationLoading.discontinue || !discontinueReason}
          >
            {operationLoading.discontinue ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Discontinuing...
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Discontinue Medication
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
