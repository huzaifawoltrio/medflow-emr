// components/patient-detail/tabs/ImagingTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface ImagingTabProps {
  patientData: any;
}

export function ImagingTab({ patientData }: ImagingTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Medical Imaging</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Order Imaging Study
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Chest X-Ray</p>
                  <p className="text-sm text-gray-600">Ordered: Aug 25, 2025</p>
                  <p className="text-sm text-green-600">Normal findings</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Images
                  </Button>
                  <Button variant="outline" size="sm">
                    Report
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">CT Scan - Abdomen</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: Aug 28, 2025
                  </p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Scheduled
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
