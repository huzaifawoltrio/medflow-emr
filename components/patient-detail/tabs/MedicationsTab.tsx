// components/patient-detail/tabs/MedicationsTab.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, AlertCircle, Edit, Ban } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchPatientMedications,
  discontinueMedication,
  type Medication,
} from "../../../app/redux/features/medications/medicationActions";
import {
  clearError,
  clearSuccess,
  setSelectedMedication,
} from "../../../app/redux/features/medications/medicationSlice";
import type { RootState, AppDispatch } from "../../../app/redux/store";
import { EditMedicationDialog } from "../dialogs/EditMedicationDialog";
import { DiscontinueMedicationDialog } from "../dialogs/DiscontinueMedicationDialog";

interface MedicationsTabProps {
  patientData: any;
  setIsOrderMedOpen: (open: boolean) => void;
}

export function MedicationsTab({
  patientData,
  setIsOrderMedOpen,
}: MedicationsTabProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { medications, loading, error, success, operationLoading } =
    useSelector((state: RootState) => state.medications);
  console.log("medications in the med tab is", medications);
  const [isEditMedOpen, setIsEditMedOpen] = useState(false);
  const [isDiscontinueDialogOpen, setIsDiscontinueDialogOpen] = useState(false);
  const [selectedMedicationForAction, setSelectedMedicationForAction] =
    useState<Medication | null>(null);

  // Extract patient ID from patientData
  const patientId = patientData?.user_id || patientData?.id;

  useEffect(() => {
    if (patientId) {
      console.log("Fetching medications for patient ID:", patientId);
      dispatch(fetchPatientMedications(patientId));
    }
  }, [dispatch, patientId]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());

      // Refetch medications after successful operation
      if (patientId) {
        dispatch(fetchPatientMedications(patientId));
      }
    }
  }, [success, dispatch, patientId]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEditMedication = (medication: Medication) => {
    dispatch(setSelectedMedication(medication));
    setIsEditMedOpen(true);
  };

  const handleDiscontinueMedication = (medication: Medication) => {
    setSelectedMedicationForAction(medication);
    setIsDiscontinueDialogOpen(true);
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "stat":
        return <Badge className="bg-red-600 text-white">STAT</Badge>;
      case "urgent":
        return <Badge className="bg-orange-500 text-white">Urgent</Badge>;
      case "routine":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Routine
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeMedications = medications.filter(
    (med) => med.status === "active"
  );

  const inactiveMedications = medications.filter(
    (med) => med.status === "inactive"
  );

  const discontinuedMedications = medications
    .filter((med) => med.status === "discontinued")
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  if (loading && medications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-500">Loading medications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Medication Management</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and track patient medications
          </p>
        </div>
        <Button
          onClick={() => setIsOrderMedOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={operationLoading.create}
        >
          {operationLoading.create ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Order New Medication
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Medications */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              Active Medications
              <Badge variant="secondary" className="text-sm">
                {activeMedications.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeMedications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No active medications
                </p>
                <p className="text-gray-400 text-sm">
                  Click "Order New Medication" to get started
                </p>
              </div>
            ) : (
              activeMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {medication.generic_name}
                          {medication.brand_name && (
                            <span className="text-sm text-gray-600 font-normal ml-1">
                              ({medication.brand_name})
                            </span>
                          )}
                        </p>
                        {getPriorityBadge(medication.priority)}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">
                            {medication.strength}
                          </span>{" "}
                          - {medication.frequency}
                        </p>
                        <p className="text-gray-600">
                          Route: {medication.route_of_administration}
                        </p>
                        <p className="text-gray-600">
                          Duration: {medication.duration_days} days
                        </p>
                        <p className="text-gray-600">
                          Quantity: {medication.quantity_prescribed}
                        </p>
                        <p className="text-gray-600">
                          Started: {formatDate(medication.start_date)}
                          {medication.end_date && (
                            <span> - {formatDate(medication.end_date)}</span>
                          )}
                        </p>
                        {medication.indication && (
                          <p className="text-blue-700 font-medium">
                            For: {medication.indication}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(medication.status)}
                    </div>
                  </div>

                  {medication.sig_instructions && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-900 font-medium mb-1">
                        Instructions:
                      </p>
                      <p className="text-sm text-blue-800">
                        {medication.sig_instructions}
                      </p>
                    </div>
                  )}

                  {medication.notes && (
                    <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <p className="text-sm text-orange-900 font-medium mb-1">
                        Notes:
                      </p>
                      <p className="text-sm text-orange-800">
                        {medication.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMedication(medication)}
                      disabled={operationLoading.update}
                      className="flex-1"
                    >
                      {operationLoading.update ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Edit className="h-3 w-3 mr-1" />
                      )}
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:border-red-300 flex-1"
                      onClick={() => handleDiscontinueMedication(medication)}
                      disabled={operationLoading.discontinue}
                    >
                      {operationLoading.discontinue ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Ban className="h-3 w-3 mr-1" />
                      )}
                      Discontinue
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Medication History */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Medication History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Inactive Medications */}
              {inactiveMedications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Inactive ({inactiveMedications.length})
                  </h4>
                  <div className="space-y-2">
                    {inactiveMedications.slice(0, 3).map((medication) => (
                      <div
                        key={medication.id}
                        className="p-3 border border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {medication.generic_name}
                              {medication.brand_name && (
                                <span className="text-gray-600 font-normal ml-1">
                                  ({medication.brand_name})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {medication.strength} - {medication.frequency}
                            </p>
                            <p className="text-xs text-gray-500">
                              Prescribed:{" "}
                              {formatDate(medication.date_prescribed)}
                            </p>
                          </div>
                          {getStatusBadge(medication.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discontinued Medications */}
              {discontinuedMedications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Recently Discontinued ({discontinuedMedications.length})
                  </h4>
                  <div className="space-y-2">
                    {discontinuedMedications.map((medication) => (
                      <div
                        key={medication.id}
                        className="p-3 border border-red-200 rounded-md bg-red-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {medication.generic_name}
                              {medication.brand_name && (
                                <span className="text-gray-600 font-normal ml-1">
                                  ({medication.brand_name})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {medication.strength} - {medication.frequency}
                            </p>
                            {medication.discontinued_at && (
                              <p className="text-xs text-red-600">
                                Discontinued:{" "}
                                {formatDate(medication.discontinued_at)}
                              </p>
                            )}
                            {medication.discontinued_reason && (
                              <p className="text-xs text-red-700 font-medium">
                                Reason: {medication.discontinued_reason}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(medication.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inactiveMedications.length === 0 &&
                discontinuedMedications.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      No medication history
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditMedicationDialog
        isOpen={isEditMedOpen}
        onOpenChange={setIsEditMedOpen}
        patientId={patientId}
      />

      <DiscontinueMedicationDialog
        isOpen={isDiscontinueDialogOpen}
        onOpenChange={setIsDiscontinueDialogOpen}
        medication={selectedMedicationForAction}
      />
    </div>
  );
}
