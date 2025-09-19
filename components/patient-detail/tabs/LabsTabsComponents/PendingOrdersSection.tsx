import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PendingOrdersSection() {
  return (
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
              <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
