// components/patient-detail/dialogs/AddVitalsDialog.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/redux/store";
import {
  createVitalSigns,
  validateVitalSigns,
} from "../../../app/redux/features/vitals/vitalsActions";
import type { CreateVitalSignsData } from "../../../app/redux/features/vitals/vitalsActions";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

interface AddVitalsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
  appointmentId?: number;
}

export function AddVitalsDialog({
  isOpen,
  onOpenChange,
  patientId,
  appointmentId,
}: AddVitalsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.vitals
  );

  const [formData, setFormData] = useState<Partial<CreateVitalSignsData>>({
    patient_id: patientId,
    appointment_id: appointmentId,
    systolic_bp: "",
    diastolic_bp: "",
    heart_rate: "",
    temperature: "",
    temperature_unit: "F",
    respiratory_rate: "",
    oxygen_saturation: "",
    weight: "",
    weight_unit: "lbs",
    height: "",
    height_unit: "in",
    pain_level: undefined,
    pain_location: "",
    pain_description: "",
    notes: "",
    recorded_date: new Date().toISOString().slice(0, 16), // Format for datetime-local input
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (
    field: keyof CreateVitalSignsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const errors = validateVitalSigns(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Convert recorded_date to proper ISO string if provided
    const submitData = {
      ...formData,
      recorded_date: formData.recorded_date
        ? new Date(formData.recorded_date).toISOString()
        : new Date().toISOString(),
    };

    try {
      await dispatch(
        createVitalSigns(submitData as CreateVitalSignsData)
      ).unwrap();
      // Reset form and close dialog on success
      setFormData({
        patient_id: patientId,
        appointment_id: appointmentId,
        systolic_bp: "",
        diastolic_bp: "",
        heart_rate: "",
        temperature: "",
        temperature_unit: "F",
        respiratory_rate: "",
        oxygen_saturation: "",
        weight: "",
        weight_unit: "lbs",
        height: "",
        height_unit: "in",
        pain_level: undefined,
        pain_location: "",
        pain_description: "",
        notes: "",
        recorded_date: new Date().toISOString().slice(0, 16),
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by Redux
      console.error("Failed to create vitals:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      patient_id: patientId,
      appointment_id: appointmentId,
      systolic_bp: "",
      diastolic_bp: "",
      heart_rate: "",
      temperature: "",
      temperature_unit: "F",
      respiratory_rate: "",
      oxygen_saturation: "",
      weight: "",
      weight_unit: "lbs",
      height: "",
      height_unit: "in",
      pain_level: undefined,
      pain_location: "",
      pain_description: "",
      notes: "",
      recorded_date: new Date().toISOString().slice(0, 16),
    });
    setValidationErrors([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Vital Signs</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* API Error */}
          {error.creating && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error.creating}</AlertDescription>
            </Alert>
          )}

          {/* Recorded Date */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="recorded_date">Recorded Date & Time</Label>
              <Input
                id="recorded_date"
                type="datetime-local"
                value={formData.recorded_date}
                onChange={(e) =>
                  handleInputChange("recorded_date", e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Vital Signs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blood Pressure */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-blue-700">Blood Pressure</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="systolic_bp">Systolic</Label>
                  <Input
                    id="systolic_bp"
                    type="number"
                    placeholder="120"
                    value={formData.systolic_bp}
                    onChange={(e) =>
                      handleInputChange("systolic_bp", e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">mmHg</p>
                </div>
                <div>
                  <Label htmlFor="diastolic_bp">Diastolic</Label>
                  <Input
                    id="diastolic_bp"
                    type="number"
                    placeholder="80"
                    value={formData.diastolic_bp}
                    onChange={(e) =>
                      handleInputChange("diastolic_bp", e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">mmHg</p>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-red-700">Heart Rate</h3>
              <div>
                <Label htmlFor="heart_rate">BPM</Label>
                <Input
                  id="heart_rate"
                  type="number"
                  placeholder="72"
                  value={formData.heart_rate}
                  onChange={(e) =>
                    handleInputChange("heart_rate", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">beats per minute</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-orange-700">Temperature</h3>
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex gap-2">
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={formData.temperature}
                    onChange={(e) =>
                      handleInputChange("temperature", e.target.value)
                    }
                  />
                  <Select
                    value={formData.temperature_unit}
                    onValueChange={(value) =>
                      handleInputChange("temperature_unit", value)
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">°F</SelectItem>
                      <SelectItem value="C">°C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-green-700">Respiratory Rate</h3>
              <div>
                <Label htmlFor="respiratory_rate">RPM</Label>
                <Input
                  id="respiratory_rate"
                  type="number"
                  placeholder="16"
                  value={formData.respiratory_rate}
                  onChange={(e) =>
                    handleInputChange("respiratory_rate", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">breaths per minute</p>
              </div>
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-purple-700">Oxygen Saturation</h3>
              <div>
                <Label htmlFor="oxygen_saturation">SpO2</Label>
                <Input
                  id="oxygen_saturation"
                  type="number"
                  placeholder="98"
                  value={formData.oxygen_saturation}
                  onChange={(e) =>
                    handleInputChange("oxygen_saturation", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">%</p>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-indigo-700">
                Physical Measurements
              </h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="160"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                    />
                    <Select
                      value={formData.weight_unit}
                      onValueChange={(value) =>
                        handleInputChange("weight_unit", value)
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="68"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                    />
                    <Select
                      value={formData.height_unit}
                      onValueChange={(value) =>
                        handleInputChange("height_unit", value)
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pain Assessment */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium text-yellow-700">Pain Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pain_level">Pain Level (0-10)</Label>
                <Select
                  value={formData.pain_level?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("pain_level", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level} -{" "}
                        {level === 0
                          ? "No pain"
                          : level <= 3
                          ? "Mild"
                          : level <= 6
                          ? "Moderate"
                          : "Severe"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pain_location">Pain Location</Label>
                <Input
                  id="pain_location"
                  placeholder="e.g., Lower back"
                  value={formData.pain_location}
                  onChange={(e) =>
                    handleInputChange("pain_location", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="pain_description">Pain Description</Label>
                <Input
                  id="pain_description"
                  placeholder="e.g., Dull ache"
                  value={formData.pain_description}
                  onChange={(e) =>
                    handleInputChange("pain_description", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading.creating}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading.creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Vitals"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
