// components/patient-detail/dialogs/OrderMedicationDialog.tsx
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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createMedication,
  type CreateMedicationRequest,
} from "../../../app/redux/features/medications/medicationActions";
import { clearError } from "../../../app/redux/features/medications/medicationSlice";
import type { RootState, AppDispatch } from "../../../app/redux/store";
import { ToastService } from "@/services/toastService";

interface OrderMedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  appointmentId?: number;
}

export function OrderMedicationDialog({
  isOpen,
  onOpenChange,
  patientId,
  appointmentId,
}: OrderMedicationDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { operationLoading, error } = useSelector(
    (state: RootState) => state.medications
  );

  const [formData, setFormData] = useState<
    Omit<CreateMedicationRequest, "patient_id">
  >({
    generic_name: "",
    brand_name: "",
    strength: "",
    route_of_administration: "Oral",
    frequency: "",
    sig_instructions: "",
    duration_days: "",
    quantity_prescribed: "",
    refills_allowed: "0",
    indication: "",
    notes: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "active",
    priority: "routine",
    appointment_id: appointmentId,
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        generic_name: "",
        brand_name: "",
        strength: "",
        route_of_administration: "Oral",
        frequency: "",
        sig_instructions: "",
        duration_days: "",
        quantity_prescribed: "",
        refills_allowed: "0",
        indication: "",
        notes: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        status: "active",
        priority: "routine",
        appointment_id: appointmentId,
      });
      setFormErrors({});
      dispatch(clearError());
    }
  }, [isOpen, appointmentId, dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error && isOpen) {
      ToastService.error(`Failed to order medication: ${error}`);
    }
  }, [error, isOpen]);

  const validateForm = () => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.generic_name.trim()) {
      errors.generic_name = "Generic name is required";
    }
    if (!formData.strength.trim()) {
      errors.strength = "Strength is required";
    }
    if (!formData.frequency.trim()) {
      errors.frequency = "Frequency is required";
    }
    if (!formData.sig_instructions.trim()) {
      errors.sig_instructions = "Instructions are required";
    }
    if (!formData.duration_days.trim()) {
      errors.duration_days = "Duration is required";
    } else if (
      isNaN(Number(formData.duration_days)) ||
      Number(formData.duration_days) <= 0
    ) {
      errors.duration_days = "Duration must be a positive number";
    }
    if (!formData.quantity_prescribed.trim()) {
      errors.quantity_prescribed = "Quantity is required";
    }
    if (!formData.indication.trim()) {
      errors.indication = "Indication is required";
    }
    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }
    if (
      formData.end_date &&
      formData.start_date &&
      formData.end_date <= formData.start_date
    ) {
      errors.end_date = "End date must be after start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Create medication data matching API structure
    const medicationData: CreateMedicationRequest = {
      ...formData,
      patient_id: patientId,
      // Convert dates to ISO format for API
      start_date: new Date(formData.start_date + "T00:00:00Z").toISOString(),
      end_date: formData.end_date
        ? new Date(formData.end_date + "T00:00:00Z").toISOString()
        : undefined,
    };

    console.log("the create medication data is", medicationData);

    // Show loading toast and handle the operation
    const loadingToastId = ToastService.loading("Ordering medication...");

    try {
      const result = await dispatch(createMedication(medicationData)).unwrap();

      // Dismiss loading toast and show success
      ToastService.dismiss(loadingToastId);
      ToastService.success(
        `Medication "${formData.generic_name}" ordered successfully!`
      );

      onOpenChange(false);
    } catch (error: any) {
      // Dismiss loading toast and show error
      ToastService.dismiss(loadingToastId);
      ToastService.error(
        error?.message || "Failed to order medication. Please try again."
      );
      console.error("Failed to create medication:", error);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const routeOptions = [
    "Oral",
    "Intravenous (IV)",
    "Intramuscular (IM)",
    "Subcutaneous (SC)",
    "Topical",
    "Inhaled",
    "Nasal",
    "Rectal",
    "Sublingual",
    "Transdermal",
  ];

  const frequencyOptions = [
    "Once daily (QD)",
    "Twice daily (BID)",
    "Three times daily (TID)",
    "Four times daily (QID)",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed (PRN)",
    "At bedtime (QHS)",
    "Before meals (AC)",
    "After meals (PC)",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order New Medication</DialogTitle>
          <DialogDescription>
            Prescribe medication for the patient. All required fields must be
            completed.
          </DialogDescription>
        </DialogHeader>

        {/* Only show error alert for non-toast handled errors */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 py-4">
          {/* Basic Medication Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Medication Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generic_name">
                  Generic Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="generic_name"
                  placeholder="e.g., Ibuprofen"
                  value={formData.generic_name}
                  onChange={(e) =>
                    handleInputChange("generic_name", e.target.value)
                  }
                  className={formErrors.generic_name ? "border-red-500" : ""}
                />
                {formErrors.generic_name && (
                  <p className="text-sm text-red-500">
                    {formErrors.generic_name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  placeholder="e.g., Advil"
                  value={formData.brand_name}
                  onChange={(e) =>
                    handleInputChange("brand_name", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strength">
                  Strength <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="strength"
                  placeholder="e.g., 400 mg"
                  value={formData.strength}
                  onChange={(e) =>
                    handleInputChange("strength", e.target.value)
                  }
                  className={formErrors.strength ? "border-red-500" : ""}
                />
                {formErrors.strength && (
                  <p className="text-sm text-red-500">{formErrors.strength}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  Route of Administration{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.route_of_administration}
                  onValueChange={(value) =>
                    handleInputChange("route_of_administration", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {routeOptions.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dosing Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Dosing Instructions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Frequency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger
                    className={formErrors.frequency ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.frequency && (
                  <p className="text-sm text-red-500">{formErrors.frequency}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_days">
                  Duration (days) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration_days"
                  placeholder="e.g., 7"
                  type="number"
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) =>
                    handleInputChange("duration_days", e.target.value)
                  }
                  className={formErrors.duration_days ? "border-red-500" : ""}
                />
                {formErrors.duration_days && (
                  <p className="text-sm text-red-500">
                    {formErrors.duration_days}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sig_instructions">
                Sig Instructions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="sig_instructions"
                placeholder="e.g., Take 1 tablet by mouth three times daily with food for pain"
                value={formData.sig_instructions}
                onChange={(e) =>
                  handleInputChange("sig_instructions", e.target.value)
                }
                className={formErrors.sig_instructions ? "border-red-500" : ""}
                rows={3}
              />
              {formErrors.sig_instructions && (
                <p className="text-sm text-red-500">
                  {formErrors.sig_instructions}
                </p>
              )}
            </div>
          </div>

          {/* Prescription Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Prescription Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity_prescribed">
                  Quantity Prescribed <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity_prescribed"
                  placeholder="e.g., 21 tablets"
                  value={formData.quantity_prescribed}
                  onChange={(e) =>
                    handleInputChange("quantity_prescribed", e.target.value)
                  }
                  className={
                    formErrors.quantity_prescribed ? "border-red-500" : ""
                  }
                />
                {formErrors.quantity_prescribed && (
                  <p className="text-sm text-red-500">
                    {formErrors.quantity_prescribed}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="refills_allowed">Refills Allowed</Label>
                <Select
                  value={formData.refills_allowed}
                  onValueChange={(value) =>
                    handleInputChange("refills_allowed", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 11].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num === 11
                          ? "PRN (As needed)"
                          : `${num} refill${num !== 1 ? "s" : ""}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indication">
                Indication <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indication"
                placeholder="e.g., Pain and inflammation"
                value={formData.indication}
                onChange={(e) =>
                  handleInputChange("indication", e.target.value)
                }
                className={formErrors.indication ? "border-red-500" : ""}
              />
              {formErrors.indication && (
                <p className="text-sm text-red-500">{formErrors.indication}</p>
              )}
            </div>
          </div>

          {/* Schedule & Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Schedule & Priority
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleInputChange("start_date", e.target.value)
                  }
                  className={formErrors.start_date ? "border-red-500" : ""}
                />
                {formErrors.start_date && (
                  <p className="text-sm text-red-500">
                    {formErrors.start_date}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleInputChange("end_date", e.target.value)
                  }
                  min={formData.start_date}
                  className={formErrors.end_date ? "border-red-500" : ""}
                />
                {formErrors.end_date && (
                  <p className="text-sm text-red-500">{formErrors.end_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange(
                      "priority",
                      value as "routine" | "urgent" | "stat"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Routine
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        Urgent
                      </div>
                    </SelectItem>
                    <SelectItem value="stat">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        STAT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Additional Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="e.g., Take with food to reduce stomach irritation"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
              <p className="text-sm text-gray-500">
                Include any special instructions, warnings, or additional
                information for the patient.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={operationLoading.create}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={operationLoading.create}
          >
            {operationLoading.create ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ordering Medication...
              </>
            ) : (
              "Order Medication"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
