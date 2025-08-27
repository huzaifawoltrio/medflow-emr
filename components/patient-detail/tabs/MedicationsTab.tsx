// components/patient-detail/tabs/MedicationsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface MedicationsTabProps {
  patientData: any;
  setIsOrderMedOpen: (open: boolean) => void;
}

export function MedicationsTab({
  patientData,
  setIsOrderMedOpen,
}: MedicationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Medication Management</h2>
        <Button
          onClick={() => setIsOrderMedOpen(true)}
          className="bg-blue-800 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Order New Medication
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Active Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientData.currentMedications.map(
              (med: string, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{med.split(" ")[0]}</p>
                      <p className="text-sm text-gray-600">
                        {med.split(" ").slice(1).join(" ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prescribed by Dr. Carter
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      Discontinue
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Medication History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Amoxicillin 500mg</p>
                    <p className="text-sm text-gray-600">
                      3x daily for 10 days
                    </p>
                    <p className="text-xs text-gray-500">Ordered: 2025-08-20</p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
