"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  getDoctorProfile,
  getUserDetails,
  uploadProfilePicture,
} from "@/app/redux/features/auth/authActions";
import { clearUploadError } from "@/app/redux/features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, doctorProfile, loading, uploadingPicture, uploadError } =
    useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails());
    }
    dispatch(getDoctorProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (doctorProfile) {
      setProfileData({
        ...user,
        ...doctorProfile,
      });
    }
  }, [user, doctorProfile]);

  const handleInputChange = (
    field: keyof typeof profileData,
    value: string | boolean
  ) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically dispatch an action to save the updated profile
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    if (user && doctorProfile) {
      setProfileData({
        ...user,
        ...doctorProfile,
      });
    }
    setIsEditing(false);
  };

  const handlePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      // You might want to add a toast notification here instead
      alert("Please select a valid image file (JPG, PNG, GIF, etc.)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Clear any previous upload errors
    dispatch(clearUploadError());

    try {
      const result = await dispatch(uploadProfilePicture(file)).unwrap();
      if (result.success) {
        setUploadSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      // Error is already handled by Redux
      console.error("Upload failed:", error);
    } finally {
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Clear upload success message after some time
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  // Clear upload error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearUploadError());
    };
  }, [dispatch]);

  if (loading || !profileData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
        </div>
      </MainLayout>
    );
  }

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
              {/* Profile Picture Upload Section */}
              <div className="relative group mb-4">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage
                    src={
                      profileData.profile_picture_url ||
                      "/professional-doctor-headshot.png"
                    }
                  />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                    {profileData.first_name?.[0]}
                    {profileData.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Button Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {uploadingPicture ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                disabled={uploadingPicture}
                className="w-full mb-2 text-xs"
              >
                {uploadingPicture ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-3 w-3" />
                    Upload Picture
                  </>
                )}
              </Button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="hidden"
              />

              {/* Upload Status */}
              {(uploadSuccess || uploadError) && (
                <div
                  className={`flex items-center space-x-1 mb-2 p-2 rounded text-xs ${
                    uploadSuccess
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {uploadSuccess ? (
                    <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  )}
                  <span className="text-xs">
                    {uploadSuccess
                      ? "Profile picture updated successfully!"
                      : uploadError}
                  </span>
                </div>
              )}

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
                  <span className="text-gray-600">
                    {profileData.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {profileData.city || "N/A"}, {profileData.state || "N/A"}
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
            {/* Profile Picture Upload Card (Larger version for better UX) */}
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold mb-4 flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Profile Picture
                </CardTitle>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Current Picture */}
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-3">
                      <AvatarImage
                        src={
                          profileData.profile_picture_url ||
                          "/professional-doctor-headshot.png"
                        }
                      />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                        {profileData.first_name?.[0]}
                        {profileData.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-500 text-center">
                      Current Picture
                    </p>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Upload New Picture
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose a professional headshot. Accepted formats: JPG,
                          PNG, GIF. Max size: 5MB.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                          variant="outline"
                          onClick={triggerFileInput}
                          disabled={uploadingPicture}
                          className="flex items-center justify-center"
                        >
                          {uploadingPicture ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose File
                            </>
                          )}
                        </Button>

                        {profileData.profile_picture_url && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setProfileData((prev: any) => ({
                                ...prev,
                                profile_picture_url: null,
                              }));
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove Picture
                          </Button>
                        )}
                      </div>

                      {/* Upload Status */}
                      {(uploadSuccess || uploadError) && (
                        <div
                          className={`flex items-center space-x-2 p-3 rounded-lg ${
                            uploadSuccess
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {uploadSuccess ? (
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="text-sm">
                            {uploadSuccess
                              ? "Profile picture updated successfully!"
                              : uploadError}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

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
                        value={profileData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.phone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address || ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.address || "N/A"}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={profileData.city || ""}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.city || "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={profileData.state || ""}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.state || "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={profileData.zip_code || ""}
                        onChange={(e) =>
                          handleInputChange("zip_code", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profileData.zip_code || "N/A"}
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
