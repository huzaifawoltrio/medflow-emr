"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Shield,
  Heart,
  AlertCircle,
  Save,
  Send,
  ChevronRight,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const sections = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "insurance", name: "Insurance", icon: Shield },
  { id: "medical", name: "Medical History", icon: Heart },
  { id: "concerns", name: "Current Concerns", icon: AlertCircle },
];

export default function PatientIntake() {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    // Insurance
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    policyHolderName: "",
    policyHolderDob: "",
    relationshipToPatient: "",
    // Medical History
    primaryCarePhysician: "",
    allergies: [],
    currentMedications: "",
    previousSurgeries: "",
    familyMedicalHistory: "",
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    // Current Concerns
    chiefComplaint: "",
    symptomDuration: "",
    painLevel: "",
    previousTreatment: "",
    additionalNotes: "",
  });

  const getProgressPercentage = () => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === activeSection
    );
    return ((sectionIndex + 1) / sections.length) * 100;
  };

  const getCurrentSectionNumber = () => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === activeSection
    );
    return sectionIndex + 1;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergyChange = (allergy: string, checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData((prev) => ({
      ...prev,
      allergies: isChecked
        ? [...prev.allergies, allergy]
        : prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections((prev) => [...prev, sectionId]);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Personal Information
      </CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            placeholder="(555) 123-4567"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="email@example.com"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange("emailAddress", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="Street address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => handleInputChange("state", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
              <SelectItem value="fl">Florida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input
            id="emergencyContactName"
            placeholder="Contact name"
            value={formData.emergencyContactName}
            onChange={(e) =>
              handleInputChange("emergencyContactName", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
          <Input
            id="emergencyContactPhone"
            placeholder="(555) 123-4567"
            value={formData.emergencyContactPhone}
            onChange={(e) =>
              handleInputChange("emergencyContactPhone", e.target.value)
            }
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            markSectionComplete("personal");
            setActiveSection("insurance");
          }}
          className="bg-blue-800 hover:bg-blue-700"
        >
          Continue to Insurance <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Insurance Information
      </CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
          <Input
            id="insuranceProvider"
            placeholder="e.g., Blue Cross Blue Shield"
            value={formData.insuranceProvider}
            onChange={(e) =>
              handleInputChange("insuranceProvider", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policyNumber">Policy Number *</Label>
          <Input
            id="policyNumber"
            placeholder="Policy number"
            value={formData.policyNumber}
            onChange={(e) => handleInputChange("policyNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groupNumber">Group Number</Label>
          <Input
            id="groupNumber"
            placeholder="Group number"
            value={formData.groupNumber}
            onChange={(e) => handleInputChange("groupNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policyHolderName">Policy Holder Name *</Label>
          <Input
            id="policyHolderName"
            placeholder="Policy holder name"
            value={formData.policyHolderName}
            onChange={(e) =>
              handleInputChange("policyHolderName", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policyHolderDob">Policy Holder Date of Birth</Label>
          <Input
            id="policyHolderDob"
            type="date"
            placeholder="mm/dd/yyyy"
            value={formData.policyHolderDob}
            onChange={(e) =>
              handleInputChange("policyHolderDob", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relationshipToPatient">Relationship to Patient</Label>
          <Select
            value={formData.relationshipToPatient}
            onValueChange={(value) =>
              handleInputChange("relationshipToPatient", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setActiveSection("personal")}>
          Previous
        </Button>
        <Button
          onClick={() => {
            markSectionComplete("insurance");
            setActiveSection("medical");
          }}
          className="bg-blue-800 hover:bg-blue-700"
        >
          Continue to Medical History <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Medical History
      </CardTitle>
      <div className="space-y-2">
        <Label htmlFor="primaryCarePhysician">Primary Care Physician</Label>
        <Input
          id="primaryCarePhysician"
          placeholder="Dr. Name, Practice"
          value={formData.primaryCarePhysician}
          onChange={(e) =>
            handleInputChange("primaryCarePhysician", e.target.value)
          }
        />
      </div>
      <div className="space-y-4">
        <Label>Allergies *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Penicillin",
            "Latex",
            "Dairy",
            "Sulfa drugs",
            "Shellfish",
            "Pollen",
            "Aspirin",
            "Nuts",
            "Pet dander",
          ].map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={formData.allergies.includes(allergy)}
                onCheckedChange={(checked) =>
                  handleAllergyChange(allergy, checked)
                }
              />
              <Label htmlFor={allergy} className="text-sm font-normal">
                {allergy}
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-allergies"
              checked={formData.allergies.includes("No known allergies")}
              onCheckedChange={(checked) =>
                handleAllergyChange("No known allergies", checked)
              }
            />
            <Label htmlFor="no-allergies" className="text-sm font-normal">
              No known allergies
            </Label>
          </div>
        </div>
        <Input
          placeholder="Please specify any additional allergies or reactions"
          className="text-sm mt-2"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          placeholder="List all current medications, dosages, and frequency"
          value={formData.currentMedications}
          onChange={(e) =>
            handleInputChange("currentMedications", e.target.value)
          }
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
        <Textarea
          id="previousSurgeries"
          placeholder="List any previous surgeries and dates"
          value={formData.previousSurgeries}
          onChange={(e) =>
            handleInputChange("previousSurgeries", e.target.value)
          }
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="familyMedicalHistory">Family Medical History</Label>
        <Textarea
          id="familyMedicalHistory"
          placeholder="Notable family medical history (heart disease, diabetes, cancer, etc.)"
          value={formData.familyMedicalHistory}
          onChange={(e) =>
            handleInputChange("familyMedicalHistory", e.target.value)
          }
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Smoking Status</Label>
          <RadioGroup
            value={formData.smokingStatus}
            onValueChange={(value) => handleInputChange("smokingStatus", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never">Never</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="former" id="former" />
              <Label htmlFor="former">Former</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current">Current</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Alcohol Consumption</Label>
          <RadioGroup
            value={formData.alcoholConsumption}
            onValueChange={(value) =>
              handleInputChange("alcoholConsumption", value)
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none-alcohol" />
              <Label htmlFor="none-alcohol">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occasional" id="occasional" />
              <Label htmlFor="occasional">Occasional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular">Regular</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Exercise Frequency</Label>
          <RadioGroup
            value={formData.exerciseFrequency}
            onValueChange={(value) =>
              handleInputChange("exerciseFrequency", value)
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none-exercise" />
              <Label htmlFor="none-exercise">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-3-week" id="1-3-week" />
              <Label htmlFor="1-3-week">1-3x/week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setActiveSection("insurance")}>
          Previous
        </Button>
        <Button
          onClick={() => {
            markSectionComplete("medical");
            setActiveSection("concerns");
          }}
          className="bg-blue-800 hover:bg-blue-700"
        >
          Continue to Current Concerns <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCurrentConcerns = () => (
    <div className="space-y-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Current Concerns
      </CardTitle>
      <div className="space-y-2">
        <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
        <Textarea
          id="chiefComplaint"
          placeholder="Please describe your main reason for today's visit"
          value={formData.chiefComplaint}
          onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="symptomDuration">
          How long have you been experiencing these symptoms?
        </Label>
        <Select
          value={formData.symptomDuration}
          onValueChange={(value) => handleInputChange("symptomDuration", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-week">Less than a week</SelectItem>
            <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
            <SelectItem value="1-month">About a month</SelectItem>
            <SelectItem value="several-months">Several months</SelectItem>
            <SelectItem value="over-year">Over a year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <Label>Current Pain Level (if applicable)</Label>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">No Pain</span>
          <div className="flex-1 flex justify-between">
            {[...Array(10)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() =>
                  handleInputChange("painLevel", (i + 1).toString())
                }
                className={`w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                  formData.painLevel === (i + 1).toString()
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600">Severe Pain</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="previousTreatment">
          Previous Treatment for This Condition
        </Label>
        <Textarea
          id="previousTreatment"
          placeholder="Have you seen other doctors or tried treatments for this condition?"
          value={formData.previousTreatment}
          onChange={(e) =>
            handleInputChange("previousTreatment", e.target.value)
          }
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Any other information you'd like your provider to know"
          value={formData.additionalNotes}
          onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setActiveSection("medical")}>
          Previous
        </Button>
        <Button
          onClick={() => markSectionComplete("concerns")}
          className="bg-blue-800 hover:bg-blue-700"
        >
          Complete Forms
        </Button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo();
      case "insurance":
        return renderInsurance();
      case "medical":
        return renderMedicalHistory();
      case "concerns":
        return renderCurrentConcerns();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Intake Forms
            </h1>
            <div className="flex items-center justify-between mt-1">
              <p className="text-gray-600">
                Section {getCurrentSectionNumber()}/4:{" "}
                {sections.find((s) => s.id === activeSection)?.name}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center bg-white">
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button className="bg-blue-800 hover:bg-blue-700 flex items-center">
              <Send className="mr-2 h-4 w-4" /> Submit Forms
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-800 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 bg-gray-100 p-1 rounded-full">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  isActive
                    ? "text-gray-900 bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{
                  backgroundColor: isActive ? "white" : "#F1F5F9",
                }}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-gray-700" : "text-gray-400"
                  }`}
                />
                <span className="whitespace-nowrap">{section.name}</span>
              </button>
            );
          })}
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8">{renderSectionContent()}</CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
