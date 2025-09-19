import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { VitalsChart } from "./VitalsChart";
import { Plus } from "lucide-react";

const vitalsData = [
  { date: "2025-06-01", bp: "120/80", hr: 72, temp: 98.6, resp: 16 },
  { date: "2025-07-01", bp: "118/78", hr: 68, temp: 98.4, resp: 15 },
  { date: "2025-08-01", bp: "122/82", hr: 75, temp: 98.7, resp: 17 },
  { date: "2025-09-01", bp: "119/79", hr: 70, temp: 98.5, resp: 16 },
  { date: "2025-10-01", bp: "121/81", hr: 73, temp: 98.6, resp: 16 },
  { date: "2025-11-01", bp: "118/77", hr: 69, temp: 98.3, resp: 15 },
];

export function VitalsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-600" />
          Vitals Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VitalsCurrent />
          <VitalsChart data={vitalsData} />
        </div>
      </CardContent>
    </Card>
  );
}

function VitalsCurrent() {
  return (
    <div>
      <h3 className="font-medium mb-3 text-gray-700">Latest Vitals</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">Blood Pressure</p>
          <p className="text-xl font-bold text-blue-900">120/80</p>
          <p className="text-xs text-gray-500 mt-1">Normal</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg text-center">
          <p className="text-sm text-red-700">Heart Rate</p>
          <p className="text-xl font-bold text-red-900">72</p>
          <p className="text-xs text-gray-500 mt-1">bpm</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg text-center">
          <p className="text-sm text-orange-700">Temperature</p>
          <p className="text-xl font-bold text-orange-900">98.6</p>
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
  );
}
