import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the structure of a single medication object
interface Medication {
  id: string;
  name: string;
  dosage: string;
  prescribedBy: string;
  status: "Active" | "Completed";
}

// Define the structure for the patient data prop
interface OverviewTabProps {
  patientData: {
    vitals: {
      bp: string;
      hr: string;
      temp: string;
      resp: string;
      spo2: string;
      recorded: string;
    };
    currentMedications?: Medication[];
  };
  setIsOrderMedOpen: (open: boolean) => void;
  setIsOrderLabOpen: (open: boolean) => void;
  setIsNewNoteOpen: (open: boolean) => void;
}

export function OverviewTab({
  patientData,
  setIsOrderMedOpen,
  setIsOrderLabOpen,
  setIsNewNoteOpen,
}: OverviewTabProps) {
  // Defensively get currentMedications, defaulting to an empty array
  const currentMedications = patientData?.currentMedications || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setIsNewNoteOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-left justify-start"
          >
            Clinical Note
          </Button>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-left justify-start">
            Telemedicine
          </Button>
          <Button
            onClick={() => setIsOrderMedOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-left justify-start"
          >
            Order Medication
          </Button>
          <Button
            onClick={() => setIsOrderLabOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-left justify-start"
          >
            Order Labs
          </Button>
        </CardContent>
      </Card>

      {/* Current Vitals */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Latest Vitals</span>
            <span className="text-xs text-gray-500">
              {patientData.vitals.recorded}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">BP</p>
            <p className="font-bold text-blue-900">{patientData.vitals.bp}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700">HR</p>
            <p className="font-bold text-red-900">{patientData.vitals.hr}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-700">Temp</p>
            <p className="font-bold text-orange-900">
              {patientData.vitals.temp}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">Resp</p>
            <p className="font-bold text-green-900">
              {patientData.vitals.resp}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">SpO2</p>
            <p className="font-bold text-purple-900">
              {patientData.vitals.spo2}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Button variant="outline" size="sm" className="h-full w-full">
              Record
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Medications */}
      <Card className="rounded-xl shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Current Medications</span>
            <Button size="sm" onClick={() => setIsOrderMedOpen(true)}>
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentMedications.length > 0 ? (
            currentMedications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-800">{med.name}</p>
                  <p className="text-sm text-slate-600">{med.dosage}</p>
                </div>
                <div className="flex gap-2">
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
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">
              No active medications on file.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
