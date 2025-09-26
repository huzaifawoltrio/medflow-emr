// components/patient-detail/dialogs/AddLabResultsDialog.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X, AlertCircle } from "lucide-react";
import { AppDispatch, RootState } from "../../../app/redux/store";
import {
  createLabResult,
  validateLabResult,
} from "../../../app/redux/features/labResults/labResultsActions";
import {
  clearError,
  clearSuccess,
} from "../../../app/redux/features/labResults/labResultsSlice";
import { ToastService } from "../../../services/toastService";

interface AddLabResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
}

interface LabField {
  key: string;
  label: string;
  unit: string;
  normalRange: string;
}

const LAB_FIELDS: LabField[] = [
  {
    key: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    normalRange: "12.0-15.5",
  },
  { key: "glucose", label: "Glucose", unit: "mg/dL", normalRange: "70-100" },
  {
    key: "creatinine",
    label: "Creatinine",
    unit: "mg/dL",
    normalRange: "0.6-1.3",
  },
  {
    key: "wbc",
    label: "White Blood Cells",
    unit: "K/μL",
    normalRange: "4.0-11.0",
  },
  { key: "alt", label: "ALT", unit: "U/L", normalRange: "7-56" },
  {
    key: "total_cholesterol",
    label: "Total Cholesterol",
    unit: "mg/dL",
    normalRange: "<200",
  },
];

export function AddLabResultsDialog({
  isOpen,
  onOpenChange,
  patientId,
}: AddLabResultsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.labResults
  );

  // Form state
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    test_date: new Date().toISOString().split("T")[0],
    appointment_id: "",
    status: "pending" as "pending" | "final" | "cancelled",
    lab_facility: "",
    lab_order_number: "",
    notes: "",
    // Lab values
    hemoglobin: "",
    glucose: "",
    creatinine: "",
    wbc: "",
    alt: "",
    total_cholesterol: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const resetForm = () => {
    setSelectedFields([]);
    setFormData({
      test_date: new Date().toISOString().split("T")[0],
      appointment_id: "",
      status: "pending",
      lab_facility: "",
      lab_order_number: "",
      notes: "",
      hemoglobin: "",
      glucose: "",
      creatinine: "",
      wbc: "",
      alt: "",
      total_cholesterol: "",
    });
    setValidationErrors([]);
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Clear errors when dialog opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError("creating"));
      dispatch(clearSuccess("creating"));
    }
  }, [isOpen, dispatch]);

  const handleFieldToggle = (fieldKey: string) => {
    if (selectedFields.includes(fieldKey)) {
      // Remove field
      setSelectedFields(selectedFields.filter((key) => key !== fieldKey));
      setFormData((prev) => ({ ...prev, [fieldKey]: "" }));
    } else {
      // Add field
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for submission
    const submitData = {
      patient_id: patientId,
      test_date: formData.test_date,
      appointment_id: formData.appointment_id
        ? parseInt(formData.appointment_id)
        : undefined,
      status: formData.status,
      lab_facility: formData.lab_facility || undefined,
      lab_order_number: formData.lab_order_number || undefined,
      notes: formData.notes || undefined,
    };

    // Add selected lab values
    selectedFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (value) {
        (submitData as any)[field] = parseFloat(value);
      }
    });

    // Client-side validation
    const errors = validateLabResult(submitData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      ToastService.error(
        "Please correct the validation errors before submitting."
      );
      return;
    }

    try {
      // Use ToastService.handleAsync for consistent loading/success/error handling
      const result = await ToastService.handleAsync(
        () => dispatch(createLabResult(submitData)).unwrap(),
        {
          loading: "Processing lab results...",
          success: `Lab results added successfully! ${
            selectedFields.length
          } test ${
            selectedFields.length === 1 ? "value" : "values"
          } recorded for the patient.`,
          error: "Failed to add lab results. Please try again.",
        }
      );

      if (result) {
        // Show additional context about what was created
        const addedValues = selectedFields
          .map((field) => {
            const labField = LAB_FIELDS.find((f) => f.key === field);
            return labField?.label;
          })
          .filter(Boolean);

        if (addedValues.length > 0) {
          // Small delay to show after the main success toast
          setTimeout(() => {
            ToastService.success(`Added: ${addedValues.join(", ")}`);
          }, 1000);
        }

        // Reset form and close dialog on success
        resetForm();
        onOpenChange(false);
      }
    } catch (error: any) {
      // Error is already handled by ToastService.handleAsync
      console.error("Failed to create lab results:", error);

      // Show specific validation errors if they exist in the response
      if (error?.response?.data?.errors) {
        const apiErrors = Object.values(
          error.response.data.errors
        ).flat() as string[];
        setValidationErrors(apiErrors);
      }
    }
  };

  const handleClose = () => {
    // Only show confirmation if form has meaningful data
    const hasFormData =
      selectedFields.length > 0 ||
      formData.lab_facility ||
      formData.lab_order_number ||
      formData.notes ||
      formData.appointment_id ||
      selectedFields.some((field) => formData[field as keyof typeof formData]);

    if (hasFormData) {
      if (
        window.confirm(
          "You have unsaved lab results. Are you sure you want to close?"
        )
      ) {
        resetForm();
        onOpenChange(false);
      }
    } else {
      resetForm();
      onOpenChange(false);
    }
  };

  const getFieldValue = (fieldKey: string) => {
    return formData[fieldKey as keyof typeof formData] as string;
  };

  // Helper function to get field status based on value
  const getFieldStatus = (fieldKey: string, value: string) => {
    if (!value) return null;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    const field = LAB_FIELDS.find((f) => f.key === fieldKey);
    if (!field) return null;

    // Basic range checking for visual feedback
    const ranges: { [key: string]: { low: number; high: number } } = {
      hemoglobin: { low: 12, high: 15.5 },
      glucose: { low: 70, high: 100 },
      creatinine: { low: 0.6, high: 1.3 },
      wbc: { low: 4, high: 11 },
      alt: { low: 7, high: 56 },
      total_cholesterol: { low: 0, high: 200 },
    };

    const range = ranges[fieldKey];
    if (!range) return null;

    if (numValue < range.low) return "low";
    if (numValue > range.high) return "high";
    return "normal";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lab Results</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test_date">Test Date *</Label>
              <Input
                id="test_date"
                type="date"
                value={formData.test_date}
                onChange={(e) => handleInputChange("test_date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="appointment_id">Appointment ID</Label>
              <Input
                id="appointment_id"
                type="number"
                placeholder="Optional"
                value={formData.appointment_id}
                onChange={(e) =>
                  handleInputChange("appointment_id", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "final" | "cancelled") =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lab_facility">Lab Facility</Label>
              <Input
                id="lab_facility"
                placeholder="e.g., LabCorp, Quest"
                value={formData.lab_facility}
                onChange={(e) =>
                  handleInputChange("lab_facility", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="lab_order_number">Lab Order Number</Label>
              <Input
                id="lab_order_number"
                placeholder="Optional"
                value={formData.lab_order_number}
                onChange={(e) =>
                  handleInputChange("lab_order_number", e.target.value)
                }
              />
            </div>
          </div>

          {/* Lab Values Selection */}
          <div>
            <Label className="text-base font-medium">
              Select Lab Values to Enter
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              Click on the lab values you want to enter. At least one value is
              required.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LAB_FIELDS.map((field) => {
                const fieldValue = getFieldValue(field.key);
                const status = getFieldStatus(field.key, fieldValue);
                const isSelected = selectedFields.includes(field.key);

                return (
                  <div
                    key={field.key}
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() => handleFieldToggle(field.key)}
                        className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                      >
                        {isSelected ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Plus className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">{field.label}</span>
                      </button>
                      {status && (
                        <Badge
                          variant={
                            status === "normal" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {status === "normal"
                            ? "Normal"
                            : status === "high"
                            ? "High"
                            : "Low"}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      <div>Unit: {field.unit}</div>
                      <div>Normal: {field.normalRange}</div>
                    </div>

                    {isSelected && (
                      <div className="mt-3">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          value={fieldValue}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          className={`w-full ${
                            status === "high" || status === "low"
                              ? "border-yellow-300 bg-yellow-50"
                              : status === "normal"
                              ? "border-green-300 bg-green-50"
                              : ""
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Fields Summary */}
            {selectedFields.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">
                  Selected Fields ({selectedFields.length}):
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFields.map((fieldKey) => {
                    const field = LAB_FIELDS.find((f) => f.key === fieldKey);
                    const value = getFieldValue(fieldKey);
                    return (
                      <Badge
                        key={fieldKey}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {field?.label}
                        {value && <span className="text-xs">({value})</span>}
                        <button
                          type="button"
                          onClick={() => handleFieldToggle(fieldKey)}
                          className="ml-1 hover:bg-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or observations..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading.creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading.creating || selectedFields.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading.creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Results...
                </>
              ) : (
                `Add Lab Results ${
                  selectedFields.length > 0 ? `(${selectedFields.length})` : ""
                }`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
