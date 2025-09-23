// components/patient-detail/tabs/LabsTabsComponents/LabsTrendsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/redux/store";
import { fetchPatientLabResultsGraph } from "../../../../app/redux/features/labResults/labResultsActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Loader2, AlertTriangle, Calendar } from "lucide-react";
import { LabTrendsChart } from "./LabTrendsChart";

interface LabTrendsSectionProps {
  patientId?: number;
}

const labValueConfig = [
  {
    key: "hemoglobin",
    name: "Hemoglobin (g/dL)",
    color: "#dc2626",
    normalRange: "12.0-15.5",
    unit: "g/dL",
  },
  {
    key: "wbc",
    name: "WBC (K/μL)",
    color: "#2563eb",
    normalRange: "4.0-11.0",
    unit: "K/μL",
  },
  {
    key: "glucose",
    name: "Glucose (mg/dL)",
    color: "#16a34a",
    normalRange: "70-100",
    unit: "mg/dL",
  },
  {
    key: "creatinine",
    name: "Creatinine (mg/dL)",
    color: "#ca8a04",
    normalRange: "0.6-1.2",
    unit: "mg/dL",
  },
  {
    key: "alt",
    name: "ALT (U/L)",
    color: "#9333ea",
    normalRange: "10-40",
    unit: "U/L",
  },
  {
    key: "total_cholesterol",
    name: "Total Cholesterol (mg/dL)",
    color: "#c2410c",
    normalRange: "<200",
    unit: "mg/dL",
  },
];

export function LabTrendsSection({ patientId }: LabTrendsSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { patientGraphResults, loading, error } = useSelector(
    (state: RootState) => state.labResults
  );

  const [dateRange, setDateRange] = useState<"6m" | "1y" | "2y">("1y");

  // Get current patient ID from props or fallback
  const currentPatientId = patientId || 1;

  // Get graph data for current patient
  const graphData = patientGraphResults[currentPatientId] || [];

  // Calculate date range for API call
  const getDateRange = (range: "6m" | "1y" | "2y") => {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "2y":
        startDate.setFullYear(startDate.getFullYear() - 2);
        break;
    }

    return {
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  };

  // Fetch lab results when component mounts or date range changes
  useEffect(() => {
    if (currentPatientId) {
      const { start_date, end_date } = getDateRange(dateRange);

      dispatch(
        fetchPatientLabResultsGraph({
          patientId: currentPatientId,
          filters: {
            start_date,
            end_date,
            status: "final", // Only show completed results
            per_page: 100, // Get enough data for trends
          },
        })
      );
    }
  }, [dispatch, currentPatientId, dateRange]);

  // Transform graph data for the chart
  const transformDataForChart = () => {
    if (!graphData.length) return [];

    // Convert the graph data to chart format
    const chartData = graphData.map((result) => ({
      date: result.date,
      timestamp: result.timestamp,
      hemoglobin: result.values.hemoglobin || null,
      wbc: result.values.wbc || null,
      glucose: result.values.glucose || null,
      creatinine: result.values.creatinine || null,
      alt: result.values.alt || null,
      total_cholesterol: result.values.total_cholesterol || null,
      // Keep reference to original for additional info
      original: result,
    }));

    // Sort by timestamp to ensure proper order
    return chartData.sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = transformDataForChart();

  // Handle date range change
  const handleDateRangeChange = (newRange: "6m" | "1y" | "2y") => {
    setDateRange(newRange);
  };

  // Loading state
  if (loading.graph) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Lab Value Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading lab trends...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error.graph) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Lab Value Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load lab trends: {error.graph}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Lab Value Trends
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1">
              {(["6m", "1y", "2y"] as const).map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateRangeChange(range)}
                  className="px-3 py-1 text-xs"
                >
                  {range === "6m"
                    ? "6 Months"
                    : range === "1y"
                    ? "1 Year"
                    : "2 Years"}
                </Button>
              ))}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <LabTrendsChart data={chartData} config={labValueConfig} />
            <LabReferenceRanges config={labValueConfig} />
            <LabDataSummary data={chartData} />
          </>
        ) : (
          <NoLabDataMessage />
        )}
      </CardContent>
    </Card>
  );
}

function LabReferenceRanges({ config }: { config: typeof labValueConfig }) {
  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
      <h4 className="font-medium mb-3">Reference Ranges</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        {config.map((item) => (
          <div key={item.key} className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-medium text-slate-600">
              {item.normalRange}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LabDataSummary({ data }: { data: any[] }) {
  if (!data.length) return null;

  const dataPoints = data.length;
  const dateRange =
    data.length > 0
      ? {
          start: new Date(data[0].date).toLocaleDateString(),
          end: new Date(data[data.length - 1].date).toLocaleDateString(),
        }
      : null;

  // Count available lab values
  const availableValues = labValueConfig.filter((config) =>
    data.some(
      (point) => point[config.key] !== null && point[config.key] !== undefined
    )
  ).length;

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="font-medium mb-2 text-blue-900">Data Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
        <div>
          <span className="font-medium">Data Points:</span> {dataPoints} results
        </div>
        <div>
          <span className="font-medium">Lab Values:</span> {availableValues} of{" "}
          {labValueConfig.length} types
        </div>
        {dateRange && (
          <div>
            <span className="font-medium">Date Range:</span> {dateRange.start} -{" "}
            {dateRange.end}
          </div>
        )}
      </div>
    </div>
  );
}

function NoLabDataMessage() {
  return (
    <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-gray-900 mb-2">
          No Lab Trends Available
        </h3>
        <p className="text-gray-600 mb-1">
          No completed lab results found for the selected time period.
        </p>
        <p className="text-sm text-gray-500">
          Lab trends will appear here once results are entered and finalized.
        </p>
      </div>
    </div>
  );
}
