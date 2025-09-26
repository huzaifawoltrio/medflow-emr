// components/patient-detail/tabs/OverviewTab.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  FlaskConical,
  FileText,
  Heart,
  Pill,
  Plus,
  Video,
} from "lucide-react";
import { AppDispatch, RootState } from "../../../app/redux/store";
import { fetchPatientLatestVitals } from "../../../app/redux/features/vitals/vitalsActions";
import { fetchPatientMedications } from "../../../app/redux/features/medications/medicationActions";
import { Medication } from "../../../app/redux/features/medications/medicationActions";

interface OverviewTabProps {
  patientData: any;
  setIsOrderMedOpen: (open: boolean) => void;
  setIsOrderLabOpen: (open: boolean) => void;
  setIsNewNoteOpen: (open: boolean) => void;
}

export function OverviewTab({
  patientData,
  setIsOrderMedOpen,
  setIsOrderLabOpen,
  setIsNewNoteOpen,
}: OverviewTabProps) {
  const dispatch = useDispatch<AppDispatch>();
  const patientId = patientData?.user_id || patientData?.id;

  const {
    patientLatestVitals,
    loading: vitalsLoading,
    error: vitalsError,
  } = useSelector((state: RootState) => state.vitals);
  const {
    medications,
    loading: medicationsLoading,
    error: medicationsError,
  } = useSelector((state: RootState) => state.medications);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientLatestVitals(patientId));
      dispatch(fetchPatientMedications(patientId));
    }
  }, [dispatch, patientId]);

  const latestVitals = patientLatestVitals[patientId];
  const activeMedications = medications.filter(
    (med: Medication) => med.status === "active"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setIsOrderMedOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-left justify-start"
          >
            <Pill className="mr-2 h-4 w-4" />
            Order Medication
          </Button>
          <Button
            onClick={() => setIsOrderLabOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-left justify-start"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Order Labs
          </Button>
          <Button
            onClick={() => setIsNewNoteOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-left justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Clinical Note
          </Button>
          <Button className="bg-yellow-600 hover:bg-green-700 text-left justify-start">
            <Video className="mr-2 h-4 w-4" />
            Telemedicine
          </Button>
        </CardContent>
      </Card>

      {/* Current Vitals */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Latest Vitals
            </span>
            {latestVitals && (
              <span className="text-xs text-gray-500">
                {new Date(latestVitals.recorded_date).toLocaleString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          {vitalsLoading.latest ? (
            <p>Loading vitals...</p>
          ) : vitalsError.latest ? (
            <p className="text-red-500">Error: {vitalsError.latest}</p>
          ) : latestVitals ? (
            <>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">BP</p>
                <p className="font-bold text-blue-900">
                  {latestVitals.systolic_bp}/{latestVitals.diastolic_bp} mmHg
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700">HR</p>
                <p className="font-bold text-red-900">
                  {latestVitals.heart_rate} bpm
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-700">Temp</p>
                <p className="font-bold text-orange-900">
                  {latestVitals.temperature}°F
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700">Resp</p>
                <p className="font-bold text-green-900">
                  {latestVitals.respiratory_rate} rpm
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">SpO2</p>
                <p className="font-bold text-purple-900">
                  {latestVitals.oxygen_saturation}%
                </p>
              </div>
            </>
          ) : (
            <p>No vitals data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Medications */}
      <Card className="rounded-xl shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Current Medications
            </span>
            <Button size="sm" onClick={() => setIsOrderMedOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medicationsLoading ? (
            <p>Loading medications...</p>
          ) : activeMedications.length > 0 ? (
            activeMedications.map((med: Medication) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Pill className="h-4 w-4 text-blue-800" />
                  <span className="font-medium">
                    {med.generic_name} {med.strength}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Discontinue
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No active medications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
