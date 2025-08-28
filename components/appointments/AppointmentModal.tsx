// components/appointments/AppointmentModal.tsx
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { createAppointment } from "@/app/redux/features/appointments/appointmentActions";
import { fetchPatients } from "@/app/redux/features/patients/patientActions";
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewAppointmentData {
  patient_id: number;
  appointment_datetime: string;
  duration: number;
  location: string;
  services: string[];
  appointment_fee: number;
  billing_type: string;
  repeat: boolean;
}

const AppointmentModal = ({ isOpen, onClose }: AppointmentModalProps) => {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patient);
  const [formData, setFormData] = useState<
    Omit<NewAppointmentData, "appointment_datetime">
  >({
    patient_id: 0,
    duration: 50,
    location: "Telehealth",
    services: ["Psychotherapy Session"],
    appointment_fee: 250.0,
    billing_type: "insurance",
    repeat: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [time, setTime] = useState({ hour: "02", minute: "00", period: "PM" });

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(fetchPatients());
    }
  }, [dispatch, patients.length]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (
    part: "hour" | "minute" | "period",
    value: string
  ) => {
    setTime((prev) => ({ ...prev, [part]: value }));
  };

  const handleSubmit = () => {
    if (!selectedDate || !formData.patient_id) {
      alert("Please select a patient and a date.");
      return;
    }

    let hour = parseInt(time.hour, 10);
    if (time.period === "PM" && hour < 12) hour += 12;
    if (time.period === "AM" && hour === 12) hour = 0;

    const appointment_datetime = new Date(selectedDate);
    appointment_datetime.setHours(hour, parseInt(time.minute, 10), 0, 0);

    const submissionData: NewAppointmentData = {
      ...formData,
      appointment_datetime: appointment_datetime.toISOString(),
    };

    dispatch(createAppointment(submissionData));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            New Appointment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4 flex flex-col">
              <div>
                <Label
                  htmlFor="patient_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Patient
                </Label>
                <Select
                  onValueChange={(val) =>
                    handleInputChange("patient_id", parseInt(val))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.user_id} value={String(p.user_id)}>
                        {p.first_name} {p.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Time
                </Label>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Input
                    value={time.hour}
                    onChange={(e) => handleTimeChange("hour", e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                    placeholder="HH"
                  />
                  <span className="font-bold">:</span>
                  <Input
                    value={time.minute}
                    onChange={(e) => handleTimeChange("minute", e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                    placeholder="MM"
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      onClick={() => handleTimeChange("period", "AM")}
                      className={`w-12 ${
                        time.period === "AM"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      disabled={time.period === "AM"}
                    >
                      AM
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleTimeChange("period", "PM")}
                      className={`w-12 ${
                        time.period === "PM"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      disabled={time.period === "PM"}
                    >
                      PM
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700"
                >
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="services"
                  className="text-sm font-medium text-gray-700"
                >
                  Services (comma-separated)
                </Label>
                <Input
                  id="services"
                  value={formData.services.join(", ")}
                  onChange={(e) =>
                    handleInputChange(
                      "services",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="appointment_fee"
                  className="text-sm font-medium text-gray-700"
                >
                  Fee
                </Label>
                <Input
                  id="appointment_fee"
                  type="number"
                  value={formData.appointment_fee}
                  onChange={(e) =>
                    handleInputChange(
                      "appointment_fee",
                      parseFloat(e.target.value)
                    )
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="billing_type"
                  className="text-sm font-medium text-gray-700"
                >
                  Billing Type
                </Label>
                <Select
                  value={formData.billing_type}
                  onValueChange={(val) =>
                    handleInputChange("billing_type", val)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="self-pay">Self-Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="repeat"
                  checked={formData.repeat}
                  onCheckedChange={(checked) =>
                    handleInputChange("repeat", !!checked)
                  }
                />
                <Label htmlFor="repeat">Repeat Appointment</Label>
              </div>
            </div>

            <div className="w-full">
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-5xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-800 hover:bg-blue-700 text-white"
            >
              Create Appointment
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AppointmentModal;
