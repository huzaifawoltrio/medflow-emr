// components/patient-detail/tabs/BillingTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BillingTabProps {
  patientData: any;
}

export function BillingTab({ patientData }: BillingTabProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patientData.billingHistory.map((item: any) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-sm">{item.service}</p>
              <p className="text-xs text-gray-500">Date: {item.date}</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <p className="font-semibold text-sm">{item.amount}</p>
              <Badge
                className={
                  item.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
