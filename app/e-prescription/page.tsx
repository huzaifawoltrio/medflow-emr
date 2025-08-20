"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, RefreshCw, Pill, User, Calendar, MapPin } from "lucide-react"

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
    prescribed: "8/12/2024",
    lastFilled: "8/12/2024",
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
    prescribed: "8/11/2024",
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
    prescribed: "8/10/2024",
    lastFilled: "8/10/2024",
    status: "filled",
  },
]

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
  {
    name: "Lorazepam",
    category: "Anxiolytic",
    available: "0.5mg, 1mg, 2mg",
  },
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
]

export default function EPrescription() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">sent</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">pending</Badge>
      case "filled":
        return <Badge className="bg-green-100 text-green-800 border-green-200">filled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Antidepressant":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Antidepressant</Badge>
      case "Anxiolytic":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Anxiolytic</Badge>
      case "Antipsychotic":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Antipsychotic</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">e-Prescription</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search prescriptions by patient name or medication..."
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
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{prescription.patient}</h3>
                        {getStatusBadge(prescription.status)}
                      </div>
                      <p className="text-sm text-gray-600">{prescription.patientId}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Refill
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Medication</h4>
                    <p className="text-sm text-gray-700 font-medium">{prescription.medication}</p>
                    <p className="text-xs text-gray-600">{prescription.dosage}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Prescribed: {prescription.prescribed}</span>
                      </div>
                      {prescription.lastFilled && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-600">Last filled: {prescription.lastFilled}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity & Refills</h4>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Qty:</span> {prescription.quantity}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Refills:</span> {prescription.refills}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Pharmacy</h4>
                    <div className="flex items-start space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{prescription.pharmacy}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Medications */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="mr-2 h-5 w-5" />
              Common Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonMedications.map((medication, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{medication.name}</h4>
                    {getCategoryBadge(medication.category)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Available:</span> {medication.available}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
