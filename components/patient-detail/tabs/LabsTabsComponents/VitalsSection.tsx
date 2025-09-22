// components/patient-detail/tabs/LabsTabsComponents/VitalsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/redux/store";
import {
  fetchPatientVitalSigns,
  fetchPatientLatestVitals,
  formatVitalSigns,
} from "../../../../app/redux/features/vitals/vitalsActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Plus,
  Loader2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { VitalsChart } from "./VitalsChart";
import { AddVitalsDialog } from "../../dialogs/addVitalsDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VitalsSectionProps {
  patientId?: number;
}

export function VitalsSection({ patientId }: VitalsSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { patientLatestVitals, patientVitals, loading, error, success } =
    useSelector((state: RootState) => state.vitals);

  const [isAddVitalsOpen, setIsAddVitalsOpen] = useState(false);

  // Get current patient ID from props or URL params
  const currentPatientId = patientId || 1; // Fallback for demo

  const latestVitals = patientLatestVitals[currentPatientId];
  const vitalsHistory = patientVitals[currentPatientId] || [];
  console.log("vitals history", vitalsHistory);

  useEffect(() => {
    if (currentPatientId) {
      // Fetch latest vitals for current display
      dispatch(fetchPatientLatestVitals(currentPatientId));

      // Fetch historical vitals for trends (last 1 year only)
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      dispatch(
        fetchPatientVitalSigns({
          patientId: currentPatientId,
          filters: {
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate,
            per_page: 50, // Get more records for trends
          },
        })
      );
    }
  }, [dispatch, currentPatientId, success.creating]); // Refresh when new vitals are added

  // Format vitals data for the chart (1 year only)
  const formatChartData = () => {
    if (!vitalsHistory.length) return [];

    // Filter data for the last 1 year
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    return vitalsHistory
      .filter((vital) => new Date(vital.recorded_date) >= oneYearAgo)
      .map((vital) => ({
        date: vital.recorded_date.split("T")[0], // Format to YYYY-MM-DD
        bp:
          vital.systolic_bp && vital.diastolic_bp
            ? `${vital.systolic_bp}/${vital.diastolic_bp}`
            : null,
        hr: vital.heart_rate ? parseInt(vital.heart_rate) : null,
        temp: vital.temperature ? parseFloat(vital.temperature) : null,
        resp: vital.respiratory_rate ? parseInt(vital.respiratory_rate) : null,
        systolic: vital.systolic_bp ? parseInt(vital.systolic_bp) : null,
        diastolic: vital.diastolic_bp ? parseInt(vital.diastolic_bp) : null,
        oxygen: vital.oxygen_saturation
          ? parseInt(vital.oxygen_saturation)
          : null,
        // Store original vital for tooltip
        original: vital,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = formatChartData();

  // Determine vital status based on normal ranges
  const getVitalStatus = (value: string | undefined, type: string) => {
    if (!value) return { status: "unknown", color: "gray" };

    const numValue = parseFloat(value);

    switch (type) {
      case "systolic":
        if (numValue < 90) return { status: "low", color: "blue" };
        if (numValue > 140) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };

      case "diastolic":
        if (numValue < 60) return { status: "low", color: "blue" };
        if (numValue > 90) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };

      case "heart_rate":
        if (numValue < 60) return { status: "low", color: "blue" };
        if (numValue > 100) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };

      case "temperature":
        // Assuming Fahrenheit
        if (numValue < 97.0) return { status: "low", color: "blue" };
        if (numValue > 99.5) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };

      case "respiratory":
        if (numValue < 12) return { status: "low", color: "blue" };
        if (numValue > 20) return { status: "high", color: "red" };
        return { status: "normal", color: "green" };

      case "oxygen":
        if (numValue < 95) return { status: "low", color: "red" };
        return { status: "normal", color: "green" };

      default:
        return { status: "normal", color: "gray" };
    }
  };

  if (loading.latest || loading.patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Vitals Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading vital signs...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error.latest || error.patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Vitals Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load vital signs: {error.latest || error.patient}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Vitals Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VitalsCurrent
              latestVitals={latestVitals}
              getVitalStatus={getVitalStatus}
              onAddVitals={() => setIsAddVitalsOpen(true)}
            />
            <VitalsChartSection chartData={chartData} />
          </div>
        </CardContent>
      </Card>

      <AddVitalsDialog
        isOpen={isAddVitalsOpen}
        onOpenChange={setIsAddVitalsOpen}
        patientId={currentPatientId}
      />
    </>
  );
}

function VitalsCurrent({
  latestVitals,
  getVitalStatus,
  onAddVitals,
}: {
  latestVitals: any;
  getVitalStatus: (
    value: string | undefined,
    type: string
  ) => { status: string; color: string };
  onAddVitals: () => void;
}) {
  if (!latestVitals) {
    return (
      <div>
        <h3 className="font-medium mb-3 text-gray-700">Latest Vitals</h3>
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No vital signs recorded yet</p>
          <Button onClick={onAddVitals} className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Record First Vitals
          </Button>
        </div>
      </div>
    );
  }

  const formattedVitals = formatVitalSigns(latestVitals);
  const recordedDate = new Date(
    latestVitals.recorded_date
  ).toLocaleDateString();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">Latest Vitals</h3>
        <span className="text-sm text-gray-500">Recorded: {recordedDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Blood Pressure */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">Blood Pressure</p>
          <p className="text-xl font-bold text-blue-900">
            {formattedVitals.blood_pressure || "N/A"}
          </p>
          <p
            className={`text-xs mt-1 ${
              latestVitals.systolic_bp
                ? getVitalStatus(latestVitals.systolic_bp, "systolic")
                    .status === "normal"
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-500"
            }`}
          >
            {latestVitals.systolic_bp
              ? getVitalStatus(latestVitals.systolic_bp, "systolic").status ===
                "normal"
                ? "Normal"
                : getVitalStatus(latestVitals.systolic_bp, "systolic")
                    .status === "high"
                ? "High"
                : "Low"
              : "Not recorded"}
          </p>
        </div>

        {/* Heart Rate */}
        <div className="p-4 bg-red-50 rounded-lg text-center">
          <p className="text-sm text-red-700">Heart Rate</p>
          <p className="text-xl font-bold text-red-900">
            {latestVitals.heart_rate || "N/A"}
          </p>
          <p
            className={`text-xs mt-1 ${
              latestVitals.heart_rate
                ? getVitalStatus(latestVitals.heart_rate, "heart_rate")
                    .status === "normal"
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-500"
            }`}
          >
            {latestVitals.heart_rate ? "bpm" : "Not recorded"}
          </p>
        </div>

        {/* Temperature */}
        <div className="p-4 bg-orange-50 rounded-lg text-center">
          <p className="text-sm text-orange-700">Temperature</p>
          <p className="text-xl font-bold text-orange-900">
            {formattedVitals.temperature_formatted || "N/A"}
          </p>
          <p
            className={`text-xs mt-1 ${
              latestVitals.temperature
                ? getVitalStatus(latestVitals.temperature, "temperature")
                    .status === "normal"
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-500"
            }`}
          >
            {latestVitals.temperature
              ? getVitalStatus(latestVitals.temperature, "temperature")
                  .status === "normal"
                ? "Normal"
                : getVitalStatus(latestVitals.temperature, "temperature")
                    .status === "high"
                ? "Fever"
                : "Low"
              : "Not recorded"}
          </p>
        </div>

        {/* Respiratory Rate */}
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <p className="text-sm text-green-700">Respiratory</p>
          <p className="text-xl font-bold text-green-900">
            {latestVitals.respiratory_rate || "N/A"}
          </p>
          <p
            className={`text-xs mt-1 ${
              latestVitals.respiratory_rate
                ? getVitalStatus(latestVitals.respiratory_rate, "respiratory")
                    .status === "normal"
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-500"
            }`}
          >
            {latestVitals.respiratory_rate ? "rpm" : "Not recorded"}
          </p>
        </div>
      </div>

      {/* Oxygen Saturation - Full width if available */}
      {latestVitals.oxygen_saturation && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-sm text-purple-700">Oxygen Saturation</p>
          <p className="text-xl font-bold text-purple-900">
            {latestVitals.oxygen_saturation}%
          </p>
          <p
            className={`text-xs mt-1 ${
              getVitalStatus(latestVitals.oxygen_saturation, "oxygen")
                .status === "normal"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {getVitalStatus(latestVitals.oxygen_saturation, "oxygen").status ===
            "normal"
              ? "Normal"
              : "Low"}
          </p>
        </div>
      )}

      <Button
        onClick={onAddVitals}
        className="w-full mt-4 bg-red-600 hover:bg-red-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Record New Vitals
      </Button>
    </div>
  );
}

function VitalsChartSection({ chartData }: { chartData: any[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">Vitals Trends (Past Year)</h3>
      </div>

      {chartData.length > 0 ? (
        <VitalsChart data={chartData} />
      ) : (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No historical data available</p>
            <p className="text-sm text-gray-500 mt-1">
              Record more vitals to see trends
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
