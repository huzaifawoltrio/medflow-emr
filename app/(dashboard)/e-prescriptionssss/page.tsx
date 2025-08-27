"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Eye,
  RefreshCw,
  Pill,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  Send,
} from "lucide-react";

const prescriptions = [
  {
    id: "P001",
    patient: "John Doe",
    patientId: "P001",
    medication: "Sertraline 50mg",
    dosage: "1 tablet daily",
    quantity: 30,
    refills: 2,
    pharmacy: "CVS Pharmacy - Main St",
    prescribed: "8/12/2025",
    lastFilled: "8/12/2025",
    status: "sent",
  },
  {
    id: "P002",
    patient: "Sarah Johnson",
    patientId: "P002",
    medication: "Lorazepam 0.5mg",
    dosage: "1/2 tablet as needed",
    quantity: 15,
    refills: 0,
    pharmacy: "Walgreens - Oak Ave",
    prescribed: "8/11/2025",
    lastFilled: null,
    status: "pending",
  },
  {
    id: "P003",
    patient: "Mike Wilson",
    patientId: "P003",
    medication: "Fluoxetine 20mg",
    dosage: "1 capsule daily",
    quantity: 30,
    refills: 5,
    pharmacy: "Rite Aid - Center St",
    prescribed: "8/10/2025",
    lastFilled: "8/10/2025",
    status: "filled",
  },
];

const commonMedications = [
  {
    name: "Sertraline",
    category: "Antidepressant",
    available: "25mg, 50mg, 100mg",
  },
  {
    name: "Fluoxetine",
    category: "Antidepressant",
    available: "10mg, 20mg, 40mg",
  },
  { name: "Lorazepam", category: "Anxiolytic", available: "0.5mg, 1mg, 2mg" },
  {
    name: "Alprazolam",
    category: "Anxiolytic",
    available: "0.25mg, 0.5mg, 1mg, 2mg",
  },
  {
    name: "Risperidone",
    category: "Antipsychotic",
    available: "0.5mg, 1mg, 2mg, 3mg, 4mg",
  },
];

export default function EPrescription() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized badge components to prevent unnecessary re-renders
  const getStatusBadge = useMemo(() => {
    return (status) => {
      switch (status) {
        case "sent":
          return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              sent
            </Badge>
          );
        case "pending":
          return (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              pending
            </Badge>
          );
        case "filled":
          return (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              filled
            </Badge>
          );
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };
  }, []);

  const getCategoryBadge = useMemo(() => {
    return (category) => {
      switch (category) {
        case "Antidepressant":
          return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Antidepressant
            </Badge>
          );
        case "Anxiolytic":
          return (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Anxiolytic
            </Badge>
          );
        case "Antipsychotic":
          return (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              Antipsychotic
            </Badge>
          );
        default:
          return <Badge variant="outline">{category}</Badge>;
      }
    };
  }, []);

  // Memoized filtered prescriptions to prevent unnecessary calculations
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => {
      const matchesSearch =
        p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medication.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSendPrescription = () => {
    // Add your prescription sending logic here
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            e-Prescription
          </h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-800 hover:bg-blue-700 w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Write New Prescription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="patient" className="text-sm font-medium">
                      Patient
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="sarah-johnson">
                          Sarah Johnson
                        </SelectItem>
                        <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pharmacy" className="text-sm font-medium">
                      Pharmacy
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pharmacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cvs">
                          CVS Pharmacy - Main St
                        </SelectItem>
                        <SelectItem value="walgreens">
                          Walgreens - Oak Ave
                        </SelectItem>
                        <SelectItem value="riteaid">
                          Rite Aid - Center St
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="medication" className="text-sm font-medium">
                    Medication
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Search medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonMedications.map((med) => (
                        <SelectItem key={med.name} value={med.name}>
                          <div className="flex flex-col">
                            <span>{med.name}</span>
                            <span className="text-xs text-gray-500">
                              {med.available}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity
                    </label>
                    <Input id="quantity" type="number" placeholder="30" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="refills" className="text-sm font-medium">
                      Refills
                    </label>
                    <Input id="refills" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="dosage" className="text-sm font-medium">
                    Dosage Instructions
                  </label>
                  <Input id="dosage" placeholder="e.g., Take 1 tablet daily" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Additional instructions for pharmacist"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-800 hover:bg-blue-700"
                  onClick={handleSendPrescription}
                >
                  <Send className="mr-2 h-4 w-4" /> Send to Pharmacy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((p) => (
              <Card
                key={p.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-blue-800" />
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-x-2">
                          <h3 className="font-medium text-gray-900">
                            {p.patient}
                          </h3>
                          {getStatusBadge(p.status)}
                        </div>
                        <p className="text-sm text-gray-600">{p.patientId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-center shrink-0">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" /> View
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" /> Refill
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Medication
                      </h4>
                      <p className="text-sm text-gray-800 font-medium">
                        {p.medication}
                      </p>
                      <p className="text-xs text-gray-600">{p.dosage}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Quantity & Refills
                      </h4>
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Qty:</span> {p.quantity}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Refills:</span>{" "}
                        {p.refills}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Pharmacy
                      </h4>
                      <div className="flex items-start space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-800">{p.pharmacy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>
                          <Calendar className="inline h-3 w-3 mr-1" />
                          Prescribed: {p.prescribed}
                        </span>
                        {p.lastFilled && (
                          <span>
                            <Calendar className="inline h-3 w-3 mr-1" />
                            Last Filled: {p.lastFilled}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Pill className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      No prescriptions found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Common Medications */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Pill className="mr-2 h-5 w-5" />
              Common Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonMedications.map((med, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{med.name}</h4>
                    {getCategoryBadge(med.category)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Available:</span>{" "}
                    {med.available}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
