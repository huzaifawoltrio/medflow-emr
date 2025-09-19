import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

interface RecentResultsSectionProps {
  patientData: any;
}

export function RecentResultsSection({
  patientData,
}: RecentResultsSectionProps) {
  return (
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
                <p className="text-sm text-gray-600">Ordered: {lab.ordered}</p>
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
  );
}
