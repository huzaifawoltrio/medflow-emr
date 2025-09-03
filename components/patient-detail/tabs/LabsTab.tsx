// components/patient-detail/tabs/LabsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  FlaskConical,
  Scan,
  Clipboard,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface LabsTabProps {
  patientData: any;
  setIsOrderLabOpen: (open: boolean) => void;
}

// Sample data for rating scales (you can replace with actual data)
const ratingScaleData = [
  { date: "2023-01-01", PHQ9: 12, GAD7: 8, PTSD: 25 },
  { date: "2023-02-01", PHQ9: 8, GAD7: 7, PTSD: 30 },
  { date: "2023-03-01", PHQ9: 6, GAD7: 5, PTSD: 20 },
  { date: "2023-04-01", PHQ9: 4, GAD7: 3, PTSD: 15 },
];

// Fluctuating lab trends data for more interesting line graph
const labTrendsData = [
  {
    date: "2025-06-01",
    hemoglobin: 13.2,
    wbc: 8.1,
    glucose: 102,
    creatinine: 1.1,
    alt: 32,
    cholesterol: 195,
  },
  {
    date: "2025-07-01",
    hemoglobin: 14.5,
    wbc: 6.5,
    glucose: 88,
    creatinine: 0.9,
    alt: 22,
    cholesterol: 178,
  },
  {
    date: "2025-08-01",
    hemoglobin: 12.8,
    wbc: 9.2,
    glucose: 115,
    creatinine: 1.3,
    alt: 41,
    cholesterol: 210,
  },
  {
    date: "2025-09-01",
    hemoglobin: 13.9,
    wbc: 7.0,
    glucose: 92,
    creatinine: 0.8,
    alt: 28,
    cholesterol: 185,
  },
  {
    date: "2025-10-01",
    hemoglobin: 14.2,
    wbc: 5.8,
    glucose: 85,
    creatinine: 1.0,
    alt: 19,
    cholesterol: 172,
  },
  {
    date: "2025-11-01",
    hemoglobin: 13.0,
    wbc: 10.1,
    glucose: 122,
    creatinine: 1.4,
    alt: 38,
    cholesterol: 205,
  },
];

// Sample vitals data
const vitalsData = [
  { date: "2025-06-01", bp: "120/80", hr: 72, temp: 98.6, resp: 16 },
  { date: "2025-07-01", bp: "118/78", hr: 68, temp: 98.4, resp: 15 },
  { date: "2025-08-01", bp: "122/82", hr: 75, temp: 98.7, resp: 17 },
  { date: "2025-09-01", bp: "119/79", hr: 70, temp: 98.5, resp: 16 },
  { date: "2025-10-01", bp: "121/81", hr: 73, temp: 98.6, resp: 16 },
  { date: "2025-11-01", bp: "118/77", hr: 69, temp: 98.3, resp: 15 },
];

const recentRatingScales = [
  {
    name: "PHQ-9 Depression Assessment",
    date: "2025-09-01",
    score: 4,
    maxScore: 27,
    interpretation: "Minimal",
    severity: "normal",
  },
  {
    name: "GAD-7 Anxiety Assessment",
    date: "2025-09-01",
    score: 3,
    maxScore: 21,
    interpretation: "Minimal",
    severity: "normal",
  },
  {
    name: "PCL-5 PTSD Assessment",
    date: "2025-08-15",
    score: 25,
    maxScore: 80,
    interpretation: "Below Threshold",
    severity: "normal",
  },
];

// Lab value configuration for the chart
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
    key: "cholesterol",
    name: "Total Cholesterol (mg/dL)",
    color: "#c2410c",
    normalRange: "<200",
    unit: "mg/dL",
  },
];

// Vitals configuration
const vitalsConfig = [
  { key: "bp", name: "Blood Pressure", color: "#3b82f6", unit: "mmHg" },
  { key: "hr", name: "Heart Rate", color: "#ef4444", unit: "bpm" },
  { key: "temp", name: "Temperature", color: "#f97316", unit: "°F" },
  { key: "resp", name: "Respiratory", color: "#10b981", unit: "rpm" },
];

export function LabsTab({ patientData, setIsOrderLabOpen }: LabsTabProps) {
  // Custom tooltip for lab trends chart
  const CustomLabTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => {
            const config = labValueConfig.find((c) => c.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.value} {config?.unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for vitals chart
  const CustomVitalsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => {
            const config = vitalsConfig.find((c) => c.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.value} {config?.unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Results & Diagnostics</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsOrderLabOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Order Lab Test
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Order Imaging
          </Button>
        </div>
      </div>

      <Tabs defaultValue="labs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Results Review
          </TabsTrigger>
          <TabsTrigger value="imaging" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Medical Imaging
          </TabsTrigger>
          <TabsTrigger value="scales" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Rating Scales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="labs" className="mt-6">
          <div className="space-y-6">
            {/* Vitals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Vitals Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Vitals */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">
                      Latest Vitals
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-sm text-blue-700">Blood Pressure</p>
                        <p className="text-xl font-bold text-blue-900">
                          120/80
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Normal</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <p className="text-sm text-red-700">Heart Rate</p>
                        <p className="text-xl font-bold text-red-900">72</p>
                        <p className="text-xs text-gray-500 mt-1">bpm</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg text-center">
                        <p className="text-sm text-orange-700">Temperature</p>
                        <p className="text-xl font-bold text-orange-900">
                          98.6
                        </p>
                        <p className="text-xs text-gray-500 mt-1">°F</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-sm text-green-700">Respiratory</p>
                        <p className="text-xl font-bold text-green-900">16</p>
                        <p className="text-xs text-gray-500 mt-1">rpm</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Record New Vitals
                    </Button>
                  </div>

                  {/* Vitals Trends Chart */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">
                      Vitals Trends
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={vitalsData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            }
                          />
                          <YAxis
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomVitalsTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="hr"
                            name="Heart Rate"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 5, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temp"
                            name="Temperature"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 5, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="resp"
                            name="Respiratory"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 5, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Lab Value Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={labTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomLabTooltip />} />
                      <Legend />
                      {labValueConfig.map((config) => (
                        <Line
                          key={config.key}
                          type="monotone"
                          dataKey={config.key}
                          stroke={config.color}
                          strokeWidth={2}
                          name={config.name}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Lab Reference Ranges */}
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-3">Reference Ranges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    {labValueConfig.map((config) => (
                      <div
                        key={config.key}
                        className="flex justify-between items-center"
                      >
                        <span className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          {config.name}:
                        </span>
                        <span className="font-medium text-slate-600">
                          {config.normalRange} {config.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Labs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-purple-600" />
                    Recent Lab Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patientData.labs.map((lab: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{lab.name}</p>
                          <p className="text-sm text-gray-600">
                            Ordered: {lab.ordered}
                          </p>
                          {lab.result && (
                            <p className="text-sm text-green-600 font-medium">
                              {lab.result}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={
                            lab.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {lab.status}
                        </Badge>
                      </div>
                      {lab.status === "completed" && (
                        <div className="mt-2 flex gap-2">
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                          <Button variant="outline" size="sm">
                            Download Report
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pending Lab Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Lab Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Complete Blood Count</p>
                          <p className="text-sm text-gray-600">
                            Ordered today - Sample collected
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Processing
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Lipid Panel</p>
                          <p className="text-sm text-gray-600">
                            Scheduled for tomorrow - Fasting required
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imaging" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Imaging */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-indigo-600" />
                  Recent Imaging Studies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Chest X-Ray</p>
                      <p className="text-sm text-gray-600">
                        Completed: Aug 25, 2025
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Normal findings
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      View Images
                    </Button>
                    <Button variant="outline" size="sm">
                      Radiology Report
                    </Button>
                  </div>
                </div>

                <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">MRI - Brain</p>
                      <p className="text-sm text-gray-600">
                        Completed: Aug 20, 2025
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        Follow-up recommended
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">
                      View Images
                    </Button>
                    <Button variant="outline" size="sm">
                      Radiology Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Imaging */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Imaging Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">CT Scan - Abdomen</p>
                        <p className="text-sm text-gray-600">
                          Scheduled: Aug 28, 2025
                        </p>
                        <p className="text-sm text-amber-600">
                          Prep instructions sent
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Scheduled
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Ultrasound - Cardiac</p>
                        <p className="text-sm text-gray-600">
                          Authorization pending
                        </p>
                        <p className="text-sm text-blue-600">
                          Insurance review in progress
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Pending Auth
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imaging History - Full Width */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Imaging History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">X-Ray - Spine</p>
                        <p className="text-sm text-slate-600">July 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm">Normal alignment</p>
                        <Badge className="bg-green-100 text-green-800">
                          Normal
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Mammography</p>
                        <p className="text-sm text-slate-600">June 10, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm">BI-RADS Category 1</p>
                        <Badge className="bg-green-100 text-green-800">
                          Normal
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">CT Scan - Chest</p>
                        <p className="text-sm text-slate-600">May 20, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm">No acute findings</p>
                        <Badge className="bg-green-100 text-green-800">
                          Normal
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scales" className="mt-6">
          <div className="space-y-6">
            {/* Rating Scale Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-emerald-600" />
                  Assessment Score Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ratingScaleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="PHQ9"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="PHQ-9 (Depression)"
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="GAD7"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        name="GAD-7 (Anxiety)"
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="PTSD"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="PCL-5 (PTSD)"
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Assessment Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessment Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentRatingScales.map((scale, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">
                            {scale.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Completed:{" "}
                            {new Date(scale.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            scale.severity === "normal"
                              ? "bg-green-100 text-green-800"
                              : scale.severity === "mild"
                              ? "bg-yellow-100 text-yellow-800"
                              : scale.severity === "moderate"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {scale.interpretation}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Score: {scale.score}/{scale.maxScore}
                          </span>
                          <span className="text-xs text-slate-500">
                            {Math.round((scale.score / scale.maxScore) * 100)}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              scale.severity === "normal"
                                ? "bg-green-500"
                                : scale.severity === "mild"
                                ? "bg-yellow-500"
                                : scale.severity === "moderate"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${(scale.score / scale.maxScore) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Compare Previous
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Assessment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">PHQ-9 Depression Screen</p>
                          <p className="text-sm text-slate-600">
                            July 15, 2024
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Score: 4</p>
                          <Badge className="bg-green-100 text-green-800">
                            Minimal
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">GAD-7 Anxiety Screen</p>
                          <p className="text-sm text-slate-600">
                            July 15, 2024
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Score: 3</p>
                          <Badge className="bg-green-100 text-green-800">
                            Minimal
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">AUDIT Alcohol Screen</p>
                          <p className="text-sm text-slate-600">
                            June 20, 2024
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Score: 1</p>
                          <Badge className="bg-green-100 text-green-800">
                            Low Risk
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-3">
                      View All History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clinical Interpretations */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Interpretation Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">PHQ-9 Depression</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>0-4:</span>
                        <span className="text-green-600">Minimal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5-9:</span>
                        <span className="text-yellow-600">Mild</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10-14:</span>
                        <span className="text-orange-600">Moderate</span>
                      </div>
                      <div className="flex justify-between">
                        <span>15-19:</span>
                        <span className="text-red-600">Mod. Severe</span>
                      </div>
                      <div className="flex justify-between">
                        <span>20-27:</span>
                        <span className="text-red-800">Severe</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">GAD-7 Anxiety</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>0-4:</span>
                        <span className="text-green-600">Minimal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5-9:</span>
                        <span className="text-yellow-600">Mild</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10-14:</span>
                        <span className="text-orange-600">Moderate</span>
                      </div>
                      <div className="flex justify-between">
                        <span>15-21:</span>
                        <span className="text-red-600">Severe</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">PCL-5 PTSD</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>0-32:</span>
                        <span className="text-green-600">Below Threshold</span>
                      </div>
                      <div className="flex justify-between">
                        <span>33-49:</span>
                        <span className="text-yellow-600">Probable PTSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>50-80:</span>
                        <span className="text-red-600">Likely PTSD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
