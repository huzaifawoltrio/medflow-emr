"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { assignPatientToDoctor } from "@/app/redux/features/patients/patientActions";
import { ToastService } from "@/services/toastService";
import { Patient } from "@/app/redux/features/patients/patientActions";

interface AssignPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

const calculateAge = (dobString: string | undefined): number => {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const AssignPatientDialog: React.FC<AssignPatientDialogProps> = ({
  isOpen,
  onOpenChange,
  patient,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.patient);

  const handleAssignPatient = async () => {
    if (!patient) return;
    const toastId = ToastService.loading("Assigning patient...");
    try {
      await dispatch(assignPatientToDoctor(patient.user_id)).unwrap();
      ToastService.dismiss(toastId);
      ToastService.success(
        `Successfully assigned ${patient.first_name} ${patient.last_name} to your care.`
      );
      onOpenChange(false);
    } catch (err: any) {
      ToastService.dismiss(toastId);
      ToastService.error(err.message || "Failed to assign patient.");
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Patient to Your Care</DialogTitle>
          <DialogDescription>
            Review patient details and confirm assignment. This will add the
            patient to your "My Patients" list.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.profile_picture_url} />
              <AvatarFallback className="text-xl">
                {patient.first_name?.[0]}
                {patient.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{`${patient.first_name} ${patient.last_name}`}</h3>
              <p className="text-sm text-gray-500">@{patient.username}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-gray-600 capitalize">
                {patient.gender}, {calculateAge(patient.date_of_birth)} years
                old
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleAssignPatient} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Take on Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
