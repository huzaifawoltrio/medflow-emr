// components/patient-detail/tabs/LabsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface LabsTabProps {
  patientData: any;
  setIsOrderLabOpen: (open: boolean) => void;
}

export function LabsTab({ patientData, setIsOrderLabOpen }: LabsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Laboratory & Diagnostics</h2>
        <Button
          onClick={() => setIsOrderLabOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Order Lab Test
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Labs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientData.labs.map((lab: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{lab.name}</p>
                    <p className="text-sm text-gray-600">
                      Ordered: {lab.ordered}
                    </p>
                    {lab.result && (
                      <p className="text-sm text-green-600">{lab.result}</p>
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
                  <Button variant="outline" size="sm" className="mt-2">
                    View Results
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
