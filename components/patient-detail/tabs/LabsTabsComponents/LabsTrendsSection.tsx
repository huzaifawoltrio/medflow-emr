import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LabTrendsChart } from "./LabTrendsChart";

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

export function LabTrendsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Lab Value Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LabTrendsChart data={labTrendsData} config={labValueConfig} />
        <LabReferenceRanges config={labValueConfig} />
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
              {item.normalRange} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
