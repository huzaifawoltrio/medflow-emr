"use client";

import { MainLayout } from "@/components/layout/main-layout";
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
} from "lucide-react";

const providerRelationships = [
  {
    role: "Primary Care Physician",
    name: "Dr. Sarah Johnson MD",
    specialty: "Internal Medicine",
    avatar: "/placeholder-user.jpg",
    initials: "SJ",
    status: "Active",
    lastContact: "2024-08-28",
    phone: "(555) 123-4567",
    email: "s.johnson@healthsystem.com",
    facility: "Metro General Hospital",
    yearsWorking: "3 years",
    rating: 4.8,
    isPrimary: true,
  },
  {
    role: "Case Manager",
    name: "Nino Kafka LCSW",
    specialty: "Social Work",
    avatar: "/placeholder-user.jpg",
    initials: "NK",
    status: "Active",
    lastContact: "2024-08-30",
    phone: "(555) 234-5678",
    email: "n.kafka@carecoord.com",
    facility: "Community Care Center",
    yearsWorking: "2 years",
    rating: 4.9,
    isPrimary: false,
  },
  {
    role: "Therapist",
    name: "Steven Shmeinecke LPC",
    specialty: "Behavioral Health",
    avatar: "/placeholder-user.jpg",
    initials: "SS",
    status: "Active",
    lastContact: "2024-08-25",
    phone: "(555) 345-6789",
    email: "s.shmeinecke@therapy.com",
    facility: "Wellness Therapy Group",
    yearsWorking: "1 year",
    rating: 4.7,
    isPrimary: false,
  },
  {
    role: "Specialist",
    name: "Dr. Ayo Odesina MD",
    specialty: "Cardiology",
    avatar: "/placeholder-user.jpg",
    initials: "AO",
    status: "Consulting",
    lastContact: "2024-08-20",
    phone: "(555) 456-7890",
    email: "a.odesina@heartcare.com",
    facility: "Heart Care Specialists",
    yearsWorking: "6 months",
    rating: 4.6,
    isPrimary: false,
  },
];

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

export default function RelationshipsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Patient Relationships
                </h1>
                <p className="text-slate-600 mt-2 text-sm sm:text-base">
                  Comprehensive care coordination and relationship management
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </Button>
              </div>
            </div>
          </div>

          {/* Rest of the content remains the same */}
          {/* Care Team Overview */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-800" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Care Team Overview
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Your coordinated healthcare providers
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {providerRelationships.map((provider) => (
                  <div
                    key={provider.name}
                    className={`p-5 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                      provider.isPrimary
                        ? "border-l-amber-400 bg-amber-50"
                        : provider.status === "Active"
                        ? "border-l-blue-800 bg-blue-50"
                        : "border-l-slate-400 bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-white shadow-md">
                          <AvatarImage src={provider.avatar} />
                          <AvatarFallback className="bg-blue-800 text-white font-semibold">
                            {provider.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h3 className="font-semibold text-slate-800 truncate">
                              {provider.name}
                            </h3>
                            {provider.isPrimary && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs w-fit">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-blue-800">
                            {provider.role}
                          </p>
                          <p className="text-xs text-slate-500">
                            {provider.specialty}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          provider.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          provider.status === "Active"
                            ? "bg-blue-800 text-white"
                            : "bg-slate-200 text-slate-700"
                        }
                      >
                        {provider.status}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-xs text-slate-600">
                        <Building2 className="h-3 w-3 mr-2 text-blue-800 flex-shrink-0" />
                        <span className="truncate">{provider.facility}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-blue-800 flex-shrink-0" />
                          <span>{provider.yearsWorking}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-2 text-blue-800 fill-current flex-shrink-0" />
                          <span>{provider.rating}/5.0</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-slate-600">
                        <Calendar className="h-3 w-3 mr-2 text-blue-800 flex-shrink-0" />
                        <span>
                          Last contact:{" "}
                          {new Date(provider.lastContact).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Meet
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-800"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Care Coordination */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-800" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Recent Care Coordination
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Latest provider interactions and updates
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentInteractions.map((interaction, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <div
                      className={`p-3 rounded-lg self-start ${
                        interaction.status === "Completed"
                          ? "bg-blue-800 text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {interaction.type === "Appointment" && (
                        <Calendar className="h-5 w-5" />
                      )}
                      {interaction.type === "Care Coordination" && (
                        <Users className="h-5 w-5" />
                      )}
                      {interaction.type === "Therapy Session" && (
                        <Heart className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {interaction.description}
                          </h4>
                          <p className="text-sm text-slate-600">
                            with {interaction.provider}
                          </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
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
                                ? "bg-blue-800 text-white"
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
            </div>
          </div>

          {/* Patient Support Network - Mobile Responsive Cards */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-800" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Patient Support Network
                    </h2>
                    <p className="text-slate-600 text-sm">
                      Family, emergency contacts, and support persons
                    </p>
                  </div>
                </div>
                <Button className="bg-blue-800 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="p-6 block lg:hidden">
              <div className="space-y-4">
                {patientRelationships.map((contact, index) => (
                  <div
                    key={contact.name}
                    className="p-5 bg-slate-50 rounded-xl space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
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
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {contact.name}
                      </h3>
                      <p className="text-slate-600">{contact.relation}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="h-4 w-4 mr-2 text-blue-800" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-800" />
                        {contact.email}
                      </div>
                      <div className="flex items-start text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-800 flex-shrink-0" />
                        <span>{contact.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="text-xs bg-slate-200 text-slate-700">
                        Prefers: {contact.preferredContact}
                      </Badge>
                      {contact.canMakeDecisions && (
                        <Badge className="bg-blue-800 text-white text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Decision Maker
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg">
                      <div className="flex items-start space-x-1">
                        <FileText className="h-3 w-3 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span>{contact.notes}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-slate-100"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 py-4">
                      Contact Type
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Name & Relation
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Contact Information
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Address
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Permissions
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Notes
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientRelationships.map((contact, index) => (
                    <TableRow
                      key={contact.name}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
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
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-800">
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
                            <Phone className="h-3 w-3 mr-2 text-blue-800" />
                            {contact.phone}
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="h-3 w-3 mr-2 text-blue-800" />
                            {contact.email}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-300 text-slate-600"
                          >
                            Prefers: {contact.preferredContact}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1 text-sm text-slate-600">
                          <MapPin className="h-3 w-3 mt-0.5 text-blue-800 flex-shrink-0" />
                          <span className="leading-tight">
                            {contact.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.canMakeDecisions && (
                            <Badge className="bg-blue-800 text-white text-xs">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Decision Maker
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-slate-500">
                            <Shield className="h-3 w-3 mr-1 text-blue-800" />
                            {contact.canMakeDecisions
                              ? "Healthcare Decisions"
                              : "Contact Only"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1 text-xs text-slate-600">
                          <FileText className="h-3 w-3 mt-0.5 text-blue-800 flex-shrink-0" />
                          <span className="leading-tight max-w-32">
                            {contact.notes}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-800"
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-800"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Care Coordination Alerts */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Care Coordination Alerts
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Important updates and action items
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-l-blue-800">
                  <div className="p-2 bg-blue-800 text-white rounded-lg self-start">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      Upcoming Care Team Meeting
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Scheduled for September 15, 2024 at 2:00 PM
                    </p>
                    <p className="text-xs text-slate-500">
                      All primary care providers will discuss treatment plan
                      updates
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-amber-50 rounded-xl border-l-4 border-l-amber-400">
                  <div className="p-2 bg-amber-500 text-white rounded-lg self-start">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      Insurance Authorization Pending
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Waiting for approval from insurance provider
                    </p>
                    <p className="text-xs text-slate-500">
                      Case manager Nino Kafka is following up on specialist
                      referral
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-500">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg self-start">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      Emergency Contact Updated
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      John Smith contact information verified
                    </p>
                    <p className="text-xs text-slate-500">
                      All emergency contacts are current and reachable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-800 text-white rounded-xl shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="bg-blue-700 hover:bg-blue-600 text-white justify-start h-12 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-600 text-white justify-start h-12 w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-600 text-white justify-start h-12 w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Records
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-600 text-white justify-start h-12 w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
