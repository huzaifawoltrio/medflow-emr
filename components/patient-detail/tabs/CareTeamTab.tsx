// components/patient-detail/tabs/CareTeamTab.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/redux/store";
import { getPatientDoctors } from "../../../app/redux/features/patients/patientActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Shield,
  Users,
  Heart,
  Building2,
  UserCheck,
  AlertCircle,
  FileText,
  Video,
  MessageSquare,
  Loader2,
  Stethoscope,
  GraduationCap,
  Languages,
} from "lucide-react";

const patientRelationships = [
  {
    type: "Family",
    name: "Jane Doe",
    relation: "Spouse",
    phone: "(555) 777-8888",
    email: "jane.doe@email.com",
    address: "123 Main St, Anytown, USA 12345",
    isPrimary: true,
    canMakeDecisions: true,
    preferredContact: "Phone",
    notes: "Prefers evening calls after 6 PM",
  },
  {
    type: "Emergency Contact",
    name: "John Smith",
    relation: "Brother",
    phone: "(555) 999-0000",
    email: "john.smith@email.com",
    address: "456 Oak Ave, Anytown, USA 12345",
    isPrimary: false,
    canMakeDecisions: false,
    preferredContact: "Text",
    notes: "Lives locally, available for emergencies",
  },
  {
    type: "Guardian",
    name: "Maria Rodriguez",
    relation: "Legal Guardian",
    phone: "(555) 111-2222",
    email: "maria.rodriguez@email.com",
    address: "789 Pine St, Anytown, USA 12345",
    isPrimary: false,
    canMakeDecisions: true,
    preferredContact: "Email",
    notes: "Has power of attorney for healthcare decisions",
  },
];

const recentInteractions = [
  {
    type: "Appointment",
    provider: "Dr. Sarah Johnson",
    date: "2024-08-28",
    description: "Annual physical examination",
    status: "Completed",
  },
  {
    type: "Care Coordination",
    provider: "Nino Kafka",
    date: "2024-08-30",
    description: "Insurance authorization follow-up",
    status: "In Progress",
  },
  {
    type: "Therapy Session",
    provider: "Steven Shmeinecke",
    date: "2024-08-25",
    description: "Weekly counseling session",
    status: "Completed",
  },
];

interface CareTeamTabProps {
  patientData: any;
}

export function CareTeamTab({ patientData }: CareTeamTabProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { patientDoctors, loading, error } = useSelector(
    (state: RootState) => state.patient
  );

  // Extract user_id to prevent unnecessary re-renders
  const patientId = patientData?.user_id;

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientDoctors(patientId));
    }
  }, [dispatch, patientId]);

  // Helper function to get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Provider Relationships
          </h2>
          <p className="text-slate-600 text-sm">
            Comprehensive care coordination and relationship management
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Care Team Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Care Team Overview</CardTitle>
              <p className="text-slate-600 text-sm">
                Your coordinated healthcare providers
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">Loading care team...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Failed to Load Providers
                </h3>
                <p className="text-slate-600 text-sm mb-4">{error}</p>
                <Button
                  onClick={() =>
                    dispatch(getPatientDoctors(patientData.user_id))
                  }
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && patientDoctors.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Providers Assigned
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  This patient doesn't have any healthcare providers assigned
                  yet. Click the button above to add a provider.
                </p>
              </div>
            </div>
          )}

          {/* Doctors Grid */}
          {!loading && !error && patientDoctors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {patientDoctors.map((doctor, index) => (
                <div
                  key={doctor.user_id}
                  className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                    index === 0
                      ? "border-l-amber-400 bg-amber-50"
                      : doctor.is_active
                      ? "border-l-blue-600 bg-blue-50"
                      : "border-l-slate-400 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                      {doctor.profile_picture_url ? (
                        <AvatarImage src={doctor.profile_picture_url} />
                      ) : null}
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {getInitials(doctor.first_name, doctor.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 truncate">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        {index === 0 && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-blue-600">
                        {doctor.specialization}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doctor.department}
                      </p>
                    </div>
                    <Badge
                      variant={doctor.is_active ? "default" : "secondary"}
                      className={
                        doctor.is_active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }
                    >
                      {doctor.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-xs text-slate-600">
                      <GraduationCap className="h-3 w-3 mr-2 text-blue-600" />
                      <span className="truncate">{doctor.qualifications}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2 text-blue-600" />
                        <span>{doctor.years_of_experience} years exp.</span>
                      </div>
                      {doctor.available_for_telehealth && (
                        <div className="flex items-center">
                          <Video className="h-3 w-3 mr-2 text-blue-600" />
                          <span>Telehealth</span>
                        </div>
                      )}
                    </div>
                    {doctor.languages_spoken && (
                      <div className="flex items-center text-xs text-slate-600">
                        <Languages className="h-3 w-3 mr-2 text-blue-600" />
                        <span className="truncate">
                          {doctor.languages_spoken}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-slate-600">
                      <Calendar className="h-3 w-3 mr-2 text-blue-600" />
                      <span>Last login: {formatDate(doctor.last_login)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        onClick={() => window.open(`mailto:${doctor.email}`)}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      {doctor.available_for_telehealth && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-blue-100"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Biography section - collapsible */}
                  {doctor.biography && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {doctor.biography}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Care Coordination */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Recent Care Coordination
              </CardTitle>
              <p className="text-slate-600 text-sm">
                Latest provider interactions and updates
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInteractions.map((interaction, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-lg ${
                    interaction.status === "Completed"
                      ? "bg-blue-600 text-white"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {interaction.type === "Appointment" && (
                    <Calendar className="h-4 w-4" />
                  )}
                  {interaction.type === "Care Coordination" && (
                    <Users className="h-4 w-4" />
                  )}
                  {interaction.type === "Therapy Session" && (
                    <Heart className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {interaction.description}
                      </h4>
                      <p className="text-sm text-slate-600">
                        with {interaction.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {new Date(interaction.date).toLocaleDateString()}
                      </p>
                      <Badge
                        variant={
                          interaction.status === "Completed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          interaction.status === "Completed"
                            ? "bg-blue-600 text-white"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {interaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Support Network */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Patient Support Network
                </CardTitle>
                <p className="text-slate-600 text-sm">
                  Family, emergency contacts, and support persons
                </p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {patientRelationships.map((contact, index) => (
              <div
                key={contact.name}
                className="p-4 bg-slate-50 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        contact.type === "Family"
                          ? "border-purple-200 text-purple-700 bg-purple-50"
                          : contact.type === "Emergency Contact"
                          ? "border-red-200 text-red-700 bg-red-50"
                          : "border-blue-200 text-blue-700 bg-blue-50"
                      }
                    >
                      {contact.type}
                    </Badge>
                    {contact.isPrimary && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {contact.name}
                  </h3>
                  <p className="text-slate-600">{contact.relation}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-3 w-3 mr-2 text-blue-600" />
                    {contact.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-3 w-3 mr-2 text-blue-600" />
                    {contact.email}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Name & Relation
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Permissions
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientRelationships.map((contact, index) => (
                  <TableRow key={contact.name} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            contact.type === "Family"
                              ? "border-purple-200 text-purple-700 bg-purple-50"
                              : contact.type === "Emergency Contact"
                              ? "border-red-200 text-red-700 bg-red-50"
                              : "border-blue-200 text-blue-700 bg-blue-50"
                          }
                        >
                          {contact.type}
                        </Badge>
                        {contact.isPrimary && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            Primary
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">
                          {contact.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {contact.relation}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-3 w-3 mr-2 text-blue-600" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="h-3 w-3 mr-2 text-blue-600" />
                          {contact.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.canMakeDecisions && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Decision Maker
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-blue-100"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-blue-100"
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-slate-100"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
