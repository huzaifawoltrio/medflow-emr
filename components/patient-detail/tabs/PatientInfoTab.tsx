// components/patient-detail/tabs/PatientInfoTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  AlertCircle,
} from "lucide-react";

interface PatientInfoTabProps {
  patientData: any;
}

export function PatientInfoTab({ patientData }: PatientInfoTabProps) {
  const { personalInfo, insurance, medicalHistory } = patientData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Patient Information</h2>
        <Button variant="outline" className="flex items-center">
          <Edit className="mr-2 h-4 w-4" />
          Edit Information
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">First Name</p>
                <p className="text-sm font-semibold">
                  {personalInfo.firstName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Last Name</p>
                <p className="text-sm font-semibold">{personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Date of Birth
                </p>
                <p className="text-sm font-semibold">
                  {personalInfo.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Gender</p>
                <p className="text-sm font-semibold capitalize">
                  {personalInfo.gender}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-800" />
                  <span className="text-sm">{personalInfo.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-800" />
                  <span className="text-sm">{personalInfo.emailAddress}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p>{personalInfo.address}</p>
                    <p>
                      {personalInfo.city}, {personalInfo.state}{" "}
                      {personalInfo.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Emergency Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">
                    {personalInfo.emergencyContactName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="text-sm">
                    {personalInfo.emergencyContactPhone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Insurance Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Insurance Provider
                </p>
                <p className="text-sm font-semibold">
                  {insurance.insuranceProvider}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Policy Number
                  </p>
                  <p className="text-sm font-mono font-semibold">
                    {insurance.policyNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Group Number
                  </p>
                  <p className="text-sm font-mono font-semibold">
                    {insurance.groupNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Policy Holder
                  </p>
                  <p className="text-sm font-semibold">
                    {insurance.policyHolderName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Relationship
                  </p>
                  <p className="text-sm font-semibold capitalize">
                    {insurance.relationshipToPatient}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Policy Holder DOB
                </p>
                <p className="text-sm font-semibold">
                  {insurance.policyHolderDob}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Badge className="bg-green-100 text-green-800 border-transparent">
                Coverage Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Medical History Overview */}
        <Card className="rounded-xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Medical History Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Primary Care Physician
                </p>
                <p className="text-sm font-semibold">
                  {medicalHistory.primaryCarePhysician}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Smoking Status
                </p>
                <Badge
                  className={
                    medicalHistory.smokingStatus === "never"
                      ? "bg-green-100 text-green-800"
                      : medicalHistory.smokingStatus === "former"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {medicalHistory.smokingStatus === "never"
                    ? "Non-smoker"
                    : medicalHistory.smokingStatus === "former"
                    ? "Former smoker"
                    : "Current smoker"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Exercise Frequency
                </p>
                <p className="text-sm font-semibold capitalize">
                  {medicalHistory.exerciseFrequency.replace("-", "-")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Known Allergies
                </p>
                <div className="flex flex-wrap gap-2">
                  {medicalHistory.allergies.map(
                    (allergy: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-red-100 text-red-800 border-transparent"
                      >
                        {allergy}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Alcohol Consumption
                </p>
                <p className="text-sm font-semibold capitalize">
                  {medicalHistory.alcoholConsumption}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Previous Surgeries
                </p>
                <p className="text-sm">
                  {medicalHistory.previousSurgeries || "None reported"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Family Medical History
                </p>
                <p className="text-sm">
                  {medicalHistory.familyMedicalHistory || "None reported"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                Current Medications
              </p>
              <p className="text-sm">{medicalHistory.currentMedications}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
