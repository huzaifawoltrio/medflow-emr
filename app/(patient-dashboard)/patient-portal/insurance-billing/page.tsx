"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  DollarSign,
  CreditCard,
  Eye,
  Download,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  HelpCircle,
  FileText,
  RefreshCw,
  Send,
  XCircle,
  Phone,
  Mail,
} from "lucide-react";

// Mock insurance claims data
const insuranceClaims = [
  {
    id: "CLM-2025-001234",
    patientName: "Sarah Johnson",
    patientId: "MRN-789012",
    serviceDate: "2025-08-20",
    submissionDate: "2025-08-21",
    provider: "Dr. Michael Smith",
    insurancePayer: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
    totalCharges: 350.0,
    approvedAmount: 280.0,
    paidAmount: 280.0,
    deductible: 0.0,
    copay: 20.0,
    patientResponsibility: 70.0,
    status: "paid",
    paymentDate: "2025-08-26",
    codes: [
      {
        code: "99213",
        description: "Office visit, established patient",
        charges: 150.0,
        approved: 120.0,
      },
      {
        code: "85027",
        description: "Complete blood count",
        charges: 50.0,
        approved: 40.0,
      },
      {
        code: "80053",
        description: "Comprehensive metabolic panel",
        charges: 150.0,
        approved: 120.0,
      },
    ],
    authNumber: "AUTH-789456123",
    referenceNumber: "REF-456789",
    processingNotes: "Claim processed successfully",
  },
  {
    id: "CLM-2025-001235",
    patientName: "Michael Davis",
    patientId: "MRN-567890",
    serviceDate: "2025-08-18",
    submissionDate: "2025-08-19",
    provider: "Jennifer Adams, PT",
    insurancePayer: "Aetna",
    policyNumber: "AET987654321",
    totalCharges: 200.0,
    approvedAmount: 160.0,
    paidAmount: 0.0,
    deductible: 25.0,
    copay: 15.0,
    patientResponsibility: 40.0,
    status: "pending",
    paymentDate: null,
    codes: [
      {
        code: "97110",
        description: "Therapeutic exercise",
        charges: 100.0,
        approved: 80.0,
      },
      {
        code: "97112",
        description: "Neuromuscular re-education",
        charges: 100.0,
        approved: 80.0,
      },
    ],
    authNumber: "AUTH-654321987",
    referenceNumber: "REF-654321",
    processingNotes: "Under review - additional documentation requested",
  },
  {
    id: "CLM-2025-001236",
    patientName: "Emma Wilson",
    patientId: "MRN-345678",
    serviceDate: "2025-08-10",
    submissionDate: "2025-08-11",
    provider: "Dr. Emily Rodriguez",
    insurancePayer: "United Healthcare",
    policyNumber: "UHC456789123",
    totalCharges: 450.0,
    approvedAmount: 0.0,
    paidAmount: 0.0,
    deductible: 0.0,
    copay: 30.0,
    patientResponsibility: 0.0,
    status: "denied",
    paymentDate: null,
    codes: [
      {
        code: "99204",
        description: "Office visit, new patient",
        charges: 250.0,
        approved: 0.0,
      },
      {
        code: "93000",
        description: "Electrocardiogram",
        charges: 100.0,
        approved: 0.0,
      },
      {
        code: "76700",
        description: "Abdominal ultrasound",
        charges: 100.0,
        approved: 0.0,
      },
    ],
    authNumber: null,
    referenceNumber: "REF-987654",
    processingNotes: "Denied - procedure not covered under current policy",
  },
  {
    id: "CLM-2025-001237",
    patientName: "Robert Chen",
    patientId: "MRN-234567",
    serviceDate: "2025-07-25",
    submissionDate: "2025-07-26",
    provider: "City Medical Lab",
    insurancePayer: "Cigna",
    policyNumber: "CIG123789456",
    totalCharges: 180.0,
    approvedAmount: 144.0,
    paidAmount: 144.0,
    deductible: 10.0,
    copay: 0.0,
    patientResponsibility: 36.0,
    status: "paid",
    paymentDate: "2025-08-01",
    codes: [
      {
        code: "80061",
        description: "Lipid panel",
        charges: 80.0,
        approved: 64.0,
      },
      {
        code: "84443",
        description: "Thyroid stimulating hormone test",
        charges: 100.0,
        approved: 80.0,
      },
    ],
    authNumber: "AUTH-147258369",
    referenceNumber: "REF-147258",
    processingNotes: "Claim processed and paid",
  },
];

const insurancePayers = [
  {
    id: "bc-bs",
    name: "Blue Cross Blue Shield",
    phone: "1-800-555-BCBS",
    email: "provider@bcbs.com",
    timely_filing: 90,
    avg_processing: 14,
  },
  {
    id: "aetna",
    name: "Aetna",
    phone: "1-800-555-AETN",
    email: "claims@aetna.com",
    timely_filing: 120,
    avg_processing: 10,
  },
  {
    id: "uhc",
    name: "United Healthcare",
    phone: "1-800-555-UHC",
    email: "provider@uhc.com",
    timely_filing: 365,
    avg_processing: 12,
  },
  {
    id: "cigna",
    name: "Cigna",
    phone: "1-800-555-CGNA",
    email: "claims@cigna.com",
    timely_filing: 180,
    avg_processing: 8,
  },
];

export default function InsuranceBilling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payerFilter, setPayerFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isClaimDetailsOpen, setIsClaimDetailsOpen] = useState(false);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitNotes, setResubmitNotes] = useState("");

  // Calculate financial stats
  const totalPending = insuranceClaims
    .filter((claim) => claim.status === "pending")
    .reduce((sum, claim) => sum + claim.totalCharges, 0);

  const totalPaid = insuranceClaims
    .filter((claim) => claim.status === "paid")
    .reduce((sum, claim) => sum + claim.paidAmount, 0);

  const totalDenied = insuranceClaims
    .filter((claim) => claim.status === "denied")
    .reduce((sum, claim) => sum + claim.totalCharges, 0);

  const thisMonthClaims = insuranceClaims.filter((claim) => {
    const claimDate = new Date(claim.submissionDate);
    const now = new Date();
    return (
      claimDate.getMonth() === now.getMonth() &&
      claimDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const filteredClaims = insuranceClaims.filter((claim) => {
    const matchesSearch =
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insurancePayer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    const matchesPayer =
      payerFilter === "all" || claim.insurancePayer === payerFilter;

    return matchesSearch && matchesStatus && matchesPayer;
  });

  const handleResubmit = () => {
    if (selectedClaim && resubmitNotes) {
      console.log(
        `Resubmitting claim ${selectedClaim.id} with notes: ${resubmitNotes}`
      );
      setIsResubmitModalOpen(false);
      setResubmitNotes("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "denied":
        return <XCircle className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const uniquePayers = [
    ...new Set(insuranceClaims.map((claim) => claim.insurancePayer)),
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Insurance Claims Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage insurance claims, authorizations, and payments
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Claim
            </Button>
            <Button className="bg-blue-800 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="font-medium text-blue-900">
                  Claims Processing Status
                </p>
                <p className="text-sm text-blue-700">
                  {insuranceClaims.filter((c) => c.status === "pending").length}{" "}
                  pending •
                  {insuranceClaims.filter((c) => c.status === "paid").length}{" "}
                  paid •
                  {insuranceClaims.filter((c) => c.status === "denied").length}{" "}
                  denied
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              Pending Claims
            </CardTitle>
            <div className="p-2 bg-orange-600 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              ${totalPending.toFixed(2)}
            </div>
            <p className="text-xs text-orange-700 mt-2">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Paid Claims
            </CardTitle>
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${totalPaid.toFixed(2)}
            </div>
            <p className="text-xs text-green-700 mt-2">Received this period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">
              Denied Claims
            </CardTitle>
            <div className="p-2 bg-red-600 rounded-lg">
              <XCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">
              ${totalDenied.toFixed(2)}
            </div>
            <p className="text-xs text-red-700 mt-2">Requires action</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Claims This Month
            </CardTitle>
            <div className="p-2 bg-blue-800 rounded-lg">
              <Receipt className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {thisMonthClaims}
            </div>
            <p className="text-xs text-blue-700 mt-2">Total submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Required Alert */}
      {insuranceClaims.filter((c) => c.status === "denied").length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="font-medium text-red-900">Action Required</p>
                <p className="text-sm text-red-700">
                  {insuranceClaims.filter((c) => c.status === "denied").length}{" "}
                  claims denied and need attention
                </p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <FileText className="mr-2 h-4 w-4" />
              Review Denials
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by patient, provider, or claim ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={payerFilter} onValueChange={setPayerFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Payers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payers</SelectItem>
            {uniquePayers.map((payer) => (
              <SelectItem key={payer} value={payer}>
                {payer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Claims Table */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Insurance Payer</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{claim.id}</p>
                      <p className="text-xs text-gray-500">
                        Ref: {claim.referenceNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{claim.patientName}</p>
                      <p className="text-sm text-gray-500">{claim.patientId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{claim.provider}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{claim.insurancePayer}</p>
                      <p className="text-sm text-gray-500">
                        Policy: {claim.policyNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{claim.serviceDate}</TableCell>
                  <TableCell className="font-medium">
                    ${claim.totalCharges.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    ${claim.approvedAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    ${claim.paidAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        claim.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(claim.status)}
                      <span className="capitalize">{claim.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClaim(claim);
                          setIsClaimDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {claim.status === "denied" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setIsResubmitModalOpen(true);
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resubmit
                        </Button>
                      )}
                      {claim.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-blue-800 hover:bg-blue-700"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Follow Up
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insurance Payers Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Payer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insurancePayers.map((payer) => (
              <div key={payer.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{payer.name}</h3>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{payer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{payer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timely Filing:</span>
                    <span>{payer.timely_filing} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Processing:</span>
                    <span>{payer.avg_processing} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resubmit Modal */}
      <Dialog open={isResubmitModalOpen} onOpenChange={setIsResubmitModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resubmit Claim</DialogTitle>
            <DialogDescription>
              Add notes and resubmit this denied claim
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Claim: {selectedClaim.id}</p>
                <p className="text-sm text-gray-600">
                  Patient: {selectedClaim.patientName}
                </p>
                <p className="text-sm text-gray-600">
                  Provider: {selectedClaim.provider}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: ${selectedClaim.totalCharges.toFixed(2)}
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  Denial Reason:
                </p>
                <p className="text-sm text-red-700">
                  {selectedClaim.processingNotes}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resubmit-notes">Resubmission Notes</Label>
                <textarea
                  id="resubmit-notes"
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={4}
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  placeholder="Enter notes explaining corrections or additional documentation..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    Include any corrected codes, additional documentation, or
                    authorization numbers
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResubmit}
              className="bg-blue-800 hover:bg-blue-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Resubmit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Claim Details Modal */}
      <Dialog open={isClaimDetailsOpen} onOpenChange={setIsClaimDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>
              Complete claim information and processing history
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              {/* Claim Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Claim ID</p>
                    <p>{selectedClaim.id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Reference Number</p>
                    <p>{selectedClaim.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Patient</p>
                    <p>{selectedClaim.patientName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Patient ID</p>
                    <p>{selectedClaim.patientId}</p>
                  </div>
                  <div>
                    <p className="font-medium">Service Date</p>
                    <p>{selectedClaim.serviceDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Submission Date</p>
                    <p>{selectedClaim.submissionDate}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h4 className="font-medium mb-3">Insurance Information</h4>
                <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Payer</p>
                    <p>{selectedClaim.insurancePayer}</p>
                  </div>
                  <div>
                    <p className="font-medium">Policy Number</p>
                    <p>{selectedClaim.policyNumber}</p>
                  </div>
                  {selectedClaim.authNumber && (
                    <div>
                      <p className="font-medium">Authorization</p>
                      <p>{selectedClaim.authNumber}</p>
                    </div>
                  )}
                  {selectedClaim.paymentDate && (
                    <div>
                      <p className="font-medium">Payment Date</p>
                      <p>{selectedClaim.paymentDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Codes */}
              <div>
                <h4 className="font-medium mb-3">Billing Codes</h4>
                <div className="space-y-2">
                  {selectedClaim.codes.map((code: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{code.code}</p>
                        <p className="text-sm text-gray-600">
                          {code.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${code.charges.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-600">
                          Approved: ${code.approved.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h4 className="font-medium mb-3">Financial Details</h4>
                <div className="bg-green-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Total Charges</p>
                    <p>${selectedClaim.totalCharges.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Approved Amount</p>
                    <p className="text-blue-600">
                      ${selectedClaim.approvedAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Paid Amount</p>
                    <p className="text-green-600">
                      ${selectedClaim.paidAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Patient Responsibility</p>
                    <p>${selectedClaim.patientResponsibility.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Deductible</p>
                    <p>${selectedClaim.deductible.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Copay</p>
                    <p>${selectedClaim.copay.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Processing Notes */}
              <div>
                <h4 className="font-medium mb-3">Processing Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedClaim.processingNotes}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
