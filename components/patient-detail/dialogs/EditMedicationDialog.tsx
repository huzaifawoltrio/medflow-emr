// components/patient-detail/dialogs/EditMedicationDialog.tsx
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
  updateMedication,
  type UpdateMedicationRequest,
} from "../../../app/redux/features/medications/medicationActions";
import { clearError } from "../../../app/redux/features/medications/medicationSlice";
import type { RootState, AppDispatch } from "../../../app/redux/store";

interface EditMedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
}

export function EditMedicationDialog({
  isOpen,
  onOpenChange,
  patientId,
}: EditMedicationDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedMedication, operationLoading, error } = useSelector(
    (state: RootState) => state.medications
  );

  const [formData, setFormData] = useState<UpdateMedicationRequest>({
    generic_name: "",
    brand_name: "",
    strength: "",
    route_of_administration: "",
    frequency: "",
    sig_instructions: "",
    duration_days: "",
    quantity_prescribed: "",
    refills_allowed: "",
    indication: "",
    notes: "",
    start_date: "",
    end_date: "",
    status: "active",
    priority: "routine",
    change_reason: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof UpdateMedicationRequest, string>>
  >({});

  // Populate form with selected medication data
  useEffect(() => {
    if (isOpen && selectedMedication) {
      setFormData({
        generic_name: selectedMedication.generic_name || "",
        brand_name: selectedMedication.brand_name || "",
        strength: selectedMedication.strength || "",
        route_of_administration:
          selectedMedication.route_of_administration || "",
        frequency: selectedMedication.frequency || "",
        sig_instructions: selectedMedication.sig_instructions || "",
        duration_days: selectedMedication.duration_days || "",
        quantity_prescribed: selectedMedication.quantity_prescribed || "",
        refills_allowed: selectedMedication.refills_allowed || "",
        indication: selectedMedication.indication || "",
        notes: selectedMedication.notes || "",
        start_date: selectedMedication.start_date
          ? new Date(selectedMedication.start_date).toISOString().split("T")[0]
          : "",
        end_date: selectedMedication.end_date
          ? new Date(selectedMedication.end_date).toISOString().split("T")[0]
          : "",
        status: selectedMedication.status,
        priority: selectedMedication.priority,
        change_reason: "",
      });
      setFormErrors({});
      dispatch(clearError());
    }
  }, [isOpen, selectedMedication, dispatch]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        generic_name: "",
        brand_name: "",
        strength: "",
        route_of_administration: "",
        frequency: "",
        sig_instructions: "",
        duration_days: "",
        quantity_prescribed: "",
        refills_allowed: "",
        indication: "",
        notes: "",
        start_date: "",
        end_date: "",
        status: "active",
        priority: "routine",
        change_reason: "",
      });
      setFormErrors({});
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const validateForm = () => {
    const errors: Partial<Record<keyof UpdateMedicationRequest, string>> = {};

    if (formData.generic_name && !formData.generic_name.trim()) {
      errors.generic_name = "Generic name cannot be empty";
    }
    if (formData.strength && !formData.strength.trim()) {
      errors.strength = "Strength cannot be empty";
    }
    if (formData.frequency && !formData.frequency.trim()) {
      errors.frequency = "Frequency cannot be empty";
    }
    if (formData.sig_instructions && !formData.sig_instructions.trim()) {
      errors.sig_instructions = "Instructions cannot be empty";
    }
    if (
      formData.duration_days &&
      (isNaN(Number(formData.duration_days)) ||
        Number(formData.duration_days) <= 0)
    ) {
      errors.duration_days = "Duration must be a positive number";
    }
    if (formData.indication && !formData.indication.trim()) {
      errors.indication = "Indication cannot be empty";
    }
    if (
      formData.end_date &&
      formData.start_date &&
      formData.end_date <= formData.start_date
    ) {
      errors.end_date = "End date must be after start date";
    }
    if (!formData.change_reason.trim()) {
      errors.change_reason = "Reason for change is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedMedication) return;

    // Create update data with only changed fields and required change_reason
    const updateData: UpdateMedicationRequest = {
      change_reason: formData.change_reason,
    };

    // Only include fields that have been modified
    if (formData.generic_name !== selectedMedication.generic_name) {
      updateData.generic_name = formData.generic_name;
    }
    if (formData.brand_name !== selectedMedication.brand_name) {
      updateData.brand_name = formData.brand_name;
    }
    if (formData.strength !== selectedMedication.strength) {
      updateData.strength = formData.strength;
    }
    if (
      formData.route_of_administration !==
      selectedMedication.route_of_administration
    ) {
      updateData.route_of_administration = formData.route_of_administration;
    }
    if (formData.frequency !== selectedMedication.frequency) {
      updateData.frequency = formData.frequency;
    }
    if (formData.sig_instructions !== selectedMedication.sig_instructions) {
      updateData.sig_instructions = formData.sig_instructions;
    }
    if (formData.duration_days !== selectedMedication.duration_days) {
      updateData.duration_days = formData.duration_days;
    }
    if (
      formData.quantity_prescribed !== selectedMedication.quantity_prescribed
    ) {
      updateData.quantity_prescribed = formData.quantity_prescribed;
    }
    if (formData.refills_allowed !== selectedMedication.refills_allowed) {
      updateData.refills_allowed = formData.refills_allowed;
    }
    if (formData.indication !== selectedMedication.indication) {
      updateData.indication = formData.indication;
    }
    if (formData.notes !== (selectedMedication.notes || "")) {
      updateData.notes = formData.notes;
    }
    if (formData.status !== selectedMedication.status) {
      updateData.status = formData.status;
    }
    if (formData.priority !== selectedMedication.priority) {
      updateData.priority = formData.priority;
    }

    // Handle dates
    const originalStartDate = selectedMedication.start_date
      ? new Date(selectedMedication.start_date).toISOString().split("T")[0]
      : "";
    const originalEndDate = selectedMedication.end_date
      ? new Date(selectedMedication.end_date).toISOString().split("T")[0]
      : "";

    if (formData.start_date !== originalStartDate) {
      updateData.start_date = formData.start_date
        ? new Date(formData.start_date + "T00:00:00Z").toISOString()
        : undefined;
    }
    if (formData.end_date !== originalEndDate) {
      updateData.end_date = formData.end_date
        ? new Date(formData.end_date + "T00:00:00Z").toISOString()
        : undefined;
    }

    try {
      const result = await dispatch(
        updateMedication({
          id: selectedMedication.id,
          data: updateData,
        })
      );
      if (updateMedication.fulfilled.match(result)) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update medication:", error);
    }
  };

  const handleInputChange = (
    field: keyof UpdateMedicationRequest,
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

  if (!selectedMedication) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medication</DialogTitle>
          <DialogDescription>
            Update medication details for {selectedMedication.generic_name}
            {selectedMedication.brand_name &&
              ` (${selectedMedication.brand_name})`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 py-4">
          {/* Reason for Change - Required */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Reason for Change
            </h3>
            <div className="space-y-2">
              <Label htmlFor="change_reason">
                Reason for Change <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="change_reason"
                placeholder="e.g., Dose adjustment for better pain control"
                value={formData.change_reason}
                onChange={(e) =>
                  handleInputChange("change_reason", e.target.value)
                }
                className={formErrors.change_reason ? "border-red-500" : ""}
                rows={2}
              />
              {formErrors.change_reason && (
                <p className="text-sm text-red-500">
                  {formErrors.change_reason}
                </p>
              )}
            </div>
          </div>

          {/* Basic Medication Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Medication Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generic_name">Generic Name</Label>
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
                <Label htmlFor="strength">Strength</Label>
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
                <Label>Route of Administration</Label>
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
                <Label>Frequency</Label>
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
                <Label htmlFor="duration_days">Duration (days)</Label>
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
              <Label htmlFor="sig_instructions">Sig Instructions</Label>
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
                <Label htmlFor="quantity_prescribed">Quantity Prescribed</Label>
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
              <Label htmlFor="indication">Indication</Label>
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

          {/* Schedule, Status & Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Schedule, Status & Priority
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
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
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange(
                      "status",
                      value as "active" | "inactive" | "discontinued"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={operationLoading.update}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={operationLoading.update}
          >
            {operationLoading.update ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Medication"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
