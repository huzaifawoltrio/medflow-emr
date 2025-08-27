// components/patient-detail/tabs/VitalsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VitalsTabProps {
  patientData: any;
}

export function VitalsTab({ patientData }: VitalsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Vitals & Monitoring</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Record New Vitals
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Vitals */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Vitals</CardTitle>
            <p className="text-sm text-gray-600">
              Recorded: {patientData.vitals.recorded}
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">Blood Pressure</p>
              <p className="text-2xl font-bold text-blue-900">
                {patientData.vitals.bp}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-red-700">Heart Rate</p>
              <p className="text-2xl font-bold text-red-900">
                {patientData.vitals.hr}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-orange-700">Temperature</p>
              <p className="text-2xl font-bold text-orange-900">
                {patientData.vitals.temp}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-700">Respiratory</p>
              <p className="text-2xl font-bold text-green-900">
                {patientData.vitals.resp}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vitals History Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Vitals Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Vitals trend chart would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
