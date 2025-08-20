"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Shield, Heart, AlertCircle, Save, Send, ChevronRight } from "lucide-react"

const sections = [
  { id: "personal", name: "Personal Info", icon: User, completed: false },
  { id: "insurance", name: "Insurance", icon: Shield, completed: false },
  { id: "medical", name: "Medical History", icon: Heart, completed: false },
  { id: "concerns", name: "Current Concerns", icon: AlertCircle, completed: false },
]

export default function PatientIntake() {
  const [activeSection, setActiveSection] = useState("personal")
  const [completedSections, setCompletedSections] = useState<string[]>([])
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
    allergies: [] as string[],
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
  })

  const completionPercentage = (completedSections.length / sections.length) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allergies: checked ? [...prev.allergies, allergy] : prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections((prev) => [...prev, sectionId])
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
            <SelectTrigger>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input
            id="emergencyContactName"
            placeholder="Contact name"
            value={formData.emergencyContactName}
            onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
          <Input
            id="emergencyContactPhone"
            placeholder="(555) 123-4567"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            markSectionComplete("personal")
            setActiveSection("insurance")
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Insurance
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderInsurance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
          <Input
            id="insuranceProvider"
            placeholder="e.g., Blue Cross Blue Shield"
            value={formData.insuranceProvider}
            onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            onChange={(e) => handleInputChange("policyHolderName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="policyHolderDob">Policy Holder Date of Birth</Label>
          <Input
            id="policyHolderDob"
            placeholder="mm/dd/yyyy"
            value={formData.policyHolderDob}
            onChange={(e) => handleInputChange("policyHolderDob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relationshipToPatient">Relationship to Patient</Label>
          <Select
            value={formData.relationshipToPatient}
            onValueChange={(value) => handleInputChange("relationshipToPatient", value)}
          >
            <SelectTrigger>
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveSection("personal")}>
          Previous
        </Button>
        <Button
          onClick={() => {
            markSectionComplete("insurance")
            setActiveSection("medical")
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Medical History
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryCarePhysician">Primary Care Physician</Label>
        <Input
          id="primaryCarePhysician"
          placeholder="Dr. Name, Practice"
          value={formData.primaryCarePhysician}
          onChange={(e) => handleInputChange("primaryCarePhysician", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label>Allergies *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Penicillin", "Latex", "Dairy", "Sulfa drugs", "Shellfish", "Pollen", "Aspirin", "Nuts", "Pet dander"].map(
            (allergy) => (
              <div key={allergy} className="flex items-center space-x-2">
                <Checkbox
                  id={allergy}
                  checked={formData.allergies.includes(allergy)}
                  onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                />
                <Label htmlFor={allergy} className="text-sm">
                  {allergy}
                </Label>
              </div>
            ),
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-allergies"
              checked={formData.allergies.includes("No known allergies")}
              onCheckedChange={(checked) => handleAllergyChange("No known allergies", checked as boolean)}
            />
            <Label htmlFor="no-allergies" className="text-sm">
              No known allergies
            </Label>
          </div>
        </div>
        <div className="mt-2">
          <Input placeholder="Please specify any additional allergies or reactions" className="text-sm text-blue-600" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          placeholder="List all current medications, dosages, and frequency"
          value={formData.currentMedications}
          onChange={(e) => handleInputChange("currentMedications", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
        <Textarea
          id="previousSurgeries"
          placeholder="List any previous surgeries and dates"
          value={formData.previousSurgeries}
          onChange={(e) => handleInputChange("previousSurgeries", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="familyMedicalHistory">Family Medical History</Label>
        <Textarea
          id="familyMedicalHistory"
          placeholder="Notable family medical history (heart disease, diabetes, cancer, etc.)"
          value={formData.familyMedicalHistory}
          onChange={(e) => handleInputChange("familyMedicalHistory", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Smoking Status</Label>
          <div className="space-y-2">
            {["Never", "Former", "Current"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`smoking-${status}`}
                  checked={formData.smokingStatus === status}
                  onCheckedChange={(checked) => checked && handleInputChange("smokingStatus", status)}
                />
                <Label htmlFor={`smoking-${status}`} className="text-sm">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alcohol Consumption</Label>
          <div className="space-y-2">
            {["None", "Occasional", "Regular"].map((consumption) => (
              <div key={consumption} className="flex items-center space-x-2">
                <Checkbox
                  id={`alcohol-${consumption}`}
                  checked={formData.alcoholConsumption === consumption}
                  onCheckedChange={(checked) => checked && handleInputChange("alcoholConsumption", consumption)}
                />
                <Label htmlFor={`alcohol-${consumption}`} className="text-sm">
                  {consumption}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Exercise Frequency</Label>
          <div className="space-y-2">
            {["None", "1-3x/week", "Daily"].map((frequency) => (
              <div key={frequency} className="flex items-center space-x-2">
                <Checkbox
                  id={`exercise-${frequency}`}
                  checked={formData.exerciseFrequency === frequency}
                  onCheckedChange={(checked) => checked && handleInputChange("exerciseFrequency", frequency)}
                />
                <Label htmlFor={`exercise-${frequency}`} className="text-sm">
                  {frequency}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveSection("insurance")}>
          Previous
        </Button>
        <Button
          onClick={() => {
            markSectionComplete("medical")
            setActiveSection("concerns")
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Current Concerns
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderCurrentConcerns = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
        <Textarea
          id="chiefComplaint"
          placeholder="Please describe your main reason for today's visit"
          value={formData.chiefComplaint}
          onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptomDuration">How long have you been experiencing these symptoms?</Label>
        <Select value={formData.symptomDuration} onValueChange={(value) => handleInputChange("symptomDuration", value)}>
          <SelectTrigger>
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

      <div className="space-y-4">
        <Label>Current Pain Level (if applicable)</Label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">No Pain</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleInputChange("painLevel", level.toString())}
                className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${
                  formData.painLevel === level.toString()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600">Severe Pain</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousTreatment">Previous Treatment for This Condition</Label>
        <Textarea
          id="previousTreatment"
          placeholder="Have you seen other doctors or tried treatments for this condition?"
          value={formData.previousTreatment}
          onChange={(e) => handleInputChange("previousTreatment", e.target.value)}
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveSection("medical")}>
          Previous
        </Button>
        <Button onClick={() => markSectionComplete("concerns")} className="bg-green-600 hover:bg-green-700">
          Complete Forms
        </Button>
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo()
      case "insurance":
        return renderInsurance()
      case "medical":
        return renderMedicalHistory()
      case "concerns":
        return renderCurrentConcerns()
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Patient Intake Forms</h1>
            <p className="text-gray-600 mt-1">Form Completion: {completedSections.length}/4 sections</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center bg-transparent">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Submit Forms
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(completionPercentage)}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            const isCompleted = completedSections.includes(section.id)

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  isActive
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : isCompleted
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                />
                <span className="font-medium">{section.name}</span>
                {isCompleted && <Badge className="bg-green-100 text-green-800 text-xs">✓</Badge>}
              </button>
            )
          })}
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {(() => {
                const section = sections.find((s) => s.id === activeSection)
                const Icon = section?.icon || User
                return (
                  <>
                    <Icon className="mr-2 h-5 w-5" />
                    {section?.name}
                  </>
                )
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderSectionContent()}</CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
