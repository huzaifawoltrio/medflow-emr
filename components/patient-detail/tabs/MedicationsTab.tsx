import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building } from "lucide-react";

// --- Data Model Interfaces ---

interface Pharmacy {
  name: string;
  phone: string;
  address: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  prescribedBy: string;
  pharmacy?: Pharmacy; // Pharmacy is now optional
  status: "Active" | "Completed";
  orderedDate?: string; // For recent orders
}

interface MedicationsTabProps {
  patientData: {
    currentMedications?: Medication[];
    recentOrders?: Medication[];
  };
  setIsOrderMedOpen: (open: boolean) => void;
}

// --- Reusable Medication Item Component ---

const MedicationItem = ({ medication }: { medication: Medication }) => {
  const isCompleted = medication.status === "Completed";

  return (
    <div className="p-3 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">
            {medication.name}
          </p>
          <p className="text-sm text-gray-600">{medication.dosage}</p>
          <p className="text-xs text-gray-500 mt-1">
            {isCompleted
              ? `Ordered: ${medication.orderedDate}`
              : `Prescribed by ${medication.prescribedBy}`}
          </p>
        </div>
        <Badge
          className={`shrink-0 ${
            isCompleted
              ? "bg-slate-100 text-slate-700 border-slate-200"
              : "bg-green-100 text-green-800 border-green-200"
          }`}
        >
          {medication.status}
        </Badge>
      </div>

      {/* --- New Pharmacy Info Section --- */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Building className="h-4 w-4 shrink-0 mt-0.5 text-blue-800" />
          {medication.pharmacy ? (
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-slate-700 truncate">
                {medication.pharmacy.name}
              </span>
              <a
                href={`tel:${medication.pharmacy.phone}`}
                className="hover:underline truncate"
              >
                {medication.pharmacy.phone}
              </a>
              <span className="text-xs truncate">
                {medication.pharmacy.address}
              </span>
            </div>
          ) : (
            <Badge className="border-transparent bg-slate-100 text-slate-500 font-normal">
              No pharmacy on file
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons for Active Meds */}
      {!isCompleted && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Discontinue
          </Button>
        </div>
      )}
    </div>
  );
};

// --- Main Medications Tab Component ---

export function MedicationsTab({
  patientData,
  setIsOrderMedOpen,
}: MedicationsTabProps) {
  const currentMedications = patientData?.currentMedications || [];
  const recentOrders = patientData?.recentOrders || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          Medication Management
        </h2>
        <Button
          onClick={() => setIsOrderMedOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Order New Medication
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Active Medications */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Active Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentMedications.length > 0 ? (
              currentMedications.map((med) => (
                <MedicationItem key={med.id} medication={med} />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No active medications on file.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((med) => (
                <MedicationItem key={med.id} medication={med} />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No recent medication orders.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
