// components/appointments/AppointmentDetailsModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormattedAppointment } from "../../lib/appointment-utils";
import { useDispatch } from "react-redux";
import { deleteAppointment } from "../../app/redux/features/appointments/appointmentActions"; // Adjust this import path as needed
import { AppDispatch } from "../../app/redux/store"; // Adjust this import path as needed

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: FormattedAppointment | null;
}

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!appointment) return null;

  const handleDelete = () => {
    dispatch(deleteAppointment(appointment.id))
      .unwrap()
      .then(() => {
        console.log("Appointment deleted successfully");
        onClose(); // Close the modal on successful deletion
      })
      .catch((error) => {
        console.error("Failed to delete appointment:", error);
        // Optionally: show an error message to the user
      });
  };

  const handleUpdate = () => {
    // Mock update functionality
    alert("Update functionality is not yet implemented.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden bg-white rounded-2xl shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full ${appointment.color}`} />
              <h2 className="text-2xl font-bold text-gray-800">
                Appointment Details
              </h2>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="space-y-5">
            {/* Service */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Service</p>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p
                  className="text-sm font-medium text-
blue-800 mb-1"
                >
                  Time
                </p>
                <p className="font-semibold text-gray-900 text-lg">
                  {appointment.timeDisplay}
                </p>
              </div>

              {/* Date */}
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-600 mb-1">Date</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {appointment.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {appointment.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700 leading-relaxed">
                  {appointment.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t mt-6">
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-
blue-800 text-white hover:bg-blue-700 transition-colors"
              >
                Update
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Delete Appointment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;
