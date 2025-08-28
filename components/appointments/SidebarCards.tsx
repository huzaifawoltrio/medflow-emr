// components/appointments/SidebarCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedAppointment } from "@/lib/appointment-utils";

interface SidebarCardsProps {
  todaysAppointments: FormattedAppointment[];
  confirmedAppointments: number;
  pendingAppointments: number;
}

const SidebarCards = ({
  todaysAppointments,
  confirmedAppointments,
  pendingAppointments,
}: SidebarCardsProps) => {
  // Static data for provider availability
  const providerAvailability = [
    { name: "Dr. Smith", status: "Available", color: "green" },
    { name: "Dr. Brown", status: "Available", color: "green" },
    { name: "Dr. Johnson", status: "Available", color: "green" },
  ];

  return (
    <div className="lg:col-span-1 space-y-3 md:space-y-4 overflow-y-auto">
      {/* Today's Summary Card */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg font-semibold">
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-base">
              {todaysAppointments.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Confirmed</span>
            <span className="font-semibold text-green-600">
              {confirmedAppointments}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold text-orange-600">
              {pendingAppointments}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Provider Availability Card */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg font-semibold">
            Provider Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {providerAvailability.map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <span className="font-medium">{p.name}</span>
              <Badge
                className={`capitalize text-xs ${
                  p.color === "green"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarCards;
