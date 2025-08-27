"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  GraduationCap,
  Calendar,
  Globe,
  Edit,
  Save,
  X,
} from "lucide-react";

// Sample doctor profile data
const doctorProfile = {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane.doe@emr.com",
  phone: "(555) 123-4567",
  department: "Cardiology",
  specialization: "Interventional Cardiology",
  medical_license_number: "MD-UNIQUE-12345",
  qualifications: "MD, FACC",
  years_of_experience: 10,
  npi_number: "1234567890",
  dea_number: "JD1234567",
  available_for_telehealth: true,
  biography:
    "Dr. Jane Doe is a leading expert in cardiology with over 10 years of experience in interventional procedures. She specializes in complex cardiac interventions and has published numerous research papers in cardiovascular medicine.",
  languages_spoken: "English, Spanish",
  address: "123 Medical Center Drive, Suite 200",
  city: "San Francisco",
  state: "CA",
  zip_code: "94102",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(doctorProfile);

  const handleInputChange = (
    field: keyof typeof profileData,
    value: string | boolean
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a database
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    setProfileData(doctorProfile);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your professional information and credentials
            </p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center bg-transparent"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-800 hover:bg-blue-700 flex items-center"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-800 hover:bg-blue-700 flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Overview Card */}
          <Card className="lg:col-span-1 rounded-xl shadow-sm h-fit">
            <CardContent className="p-4">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src="/professional-doctor-headshot.png" />
                <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                  {profileData.first_name[0]}
                  {profileData.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                Dr. {profileData.first_name} {profileData.last_name}
              </h2>
              <p className="text-gray-600 mb-2 text-center text-sm">
                {profileData.specialization}
              </p>
              <div className="flex justify-center mb-2">
                <Badge variant="secondary" className="text-xs">
                  {profileData.department}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">
                    {profileData.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {profileData.city}, {profileData.state}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {profileData.years_of_experience} years exp.
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {profileData.languages_spoken}
                  </span>
                </div>
              </div>

              {profileData.available_for_telehealth && (
                <div className="flex justify-center mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs text-green-600 border-green-200"
                  >
                    Telehealth Available
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Details Cards */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.first_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.last_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.state}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={profileData.zip_code}
                        onChange={(e) =>
                          handleInputChange("zip_code", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.zip_code}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold mb-4 flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Professional Information
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.department}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    {isEditing ? (
                      <Input
                        id="specialization"
                        value={profileData.specialization}
                        onChange={(e) =>
                          handleInputChange("specialization", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.specialization}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">
                      Medical License Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="licenseNumber"
                        value={profileData.medical_license_number}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_license_number",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.medical_license_number}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    {isEditing ? (
                      <Input
                        id="qualifications"
                        value={profileData.qualifications}
                        onChange={(e) =>
                          handleInputChange("qualifications", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.qualifications}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="npiNumber">NPI Number</Label>
                    {isEditing ? (
                      <Input
                        id="npiNumber"
                        value={profileData.npi_number}
                        onChange={(e) =>
                          handleInputChange("npi_number", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.npi_number}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deaNumber">DEA Number</Label>
                    {isEditing ? (
                      <Input
                        id="deaNumber"
                        value={profileData.dea_number}
                        onChange={(e) =>
                          handleInputChange("dea_number", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.dea_number}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="languages">Languages Spoken</Label>
                  {isEditing ? (
                    <Input
                      id="languages"
                      value={profileData.languages_spoken}
                      onChange={(e) =>
                        handleInputChange("languages_spoken", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.languages_spoken}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Professional Biography
                </CardTitle>
                <div className="space-y-2">
                  <Label htmlFor="biography">Biography</Label>
                  {isEditing ? (
                    <Textarea
                      id="biography"
                      value={profileData.biography}
                      onChange={(e) =>
                        handleInputChange("biography", e.target.value)
                      }
                      rows={4}
                      placeholder="Enter your professional biography..."
                    />
                  ) : (
                    <p className="text-gray-900 leading-relaxed">
                      {profileData.biography}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
