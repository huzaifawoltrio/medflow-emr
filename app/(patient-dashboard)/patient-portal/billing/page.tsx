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
} from "lucide-react";

// Mock patient info
const currentPatient = {
  name: "Sarah Johnson",
  id: "MRN-789012",
  insuranceProvider: "Blue Cross Blue Shield",
  policyNumber: "BC123456789",
};

const patientBills = [
  {
    id: "BILL-001",
    date: "2025-08-26",
    serviceDate: "2025-08-20",
    provider: "Dr. Michael Smith",
    services: "Annual Physical Examination",
    totalAmount: 350.0,
    insuranceCoverage: 280.0,
    patientResponsibility: 70.0,
    amountPaid: 70.0,
    dueDate: "2025-09-20",
    status: "paid",
    billingCodes: [
      {
        code: "99213",
        description: "Office visit, established patient",
        amount: 150,
      },
      { code: "85027", description: "Complete blood count", amount: 50 },
      {
        code: "80053",
        description: "Comprehensive metabolic panel",
        amount: 150,
      },
    ],
  },
  {
    id: "BILL-002",
    date: "2025-08-22",
    serviceDate: "2025-08-18",
    provider: "Jennifer Adams, PT",
    services: "Physical Therapy Session",
    totalAmount: 200.0,
    insuranceCoverage: 160.0,
    patientResponsibility: 40.0,
    amountPaid: 0.0,
    dueDate: "2025-09-22",
    status: "pending",
    billingCodes: [
      { code: "97110", description: "Therapeutic exercise", amount: 100 },
      { code: "97112", description: "Neuromuscular re-education", amount: 100 },
    ],
  },
  {
    id: "BILL-003",
    date: "2025-08-15",
    serviceDate: "2025-08-10",
    provider: "Dr. Emily Rodriguez",
    services: "Cardiology Consultation",
    totalAmount: 450.0,
    insuranceCoverage: 360.0,
    patientResponsibility: 90.0,
    amountPaid: 0.0,
    dueDate: "2025-08-30",
    status: "overdue",
    billingCodes: [
      {
        code: "99204",
        description: "Office visit, new patient, moderate complexity",
        amount: 250,
      },
      { code: "93000", description: "Electrocardiogram", amount: 100 },
      { code: "76700", description: "Abdominal ultrasound", amount: 100 },
    ],
  },
  {
    id: "BILL-004",
    date: "2025-07-28",
    serviceDate: "2025-07-25",
    provider: "City Medical Lab",
    services: "Laboratory Tests",
    totalAmount: 180.0,
    insuranceCoverage: 144.0,
    patientResponsibility: 36.0,
    amountPaid: 36.0,
    dueDate: "2025-08-28",
    status: "paid",
    billingCodes: [
      { code: "80061", description: "Lipid panel", amount: 80 },
      {
        code: "84443",
        description: "Thyroid stimulating hormone test",
        amount: 100,
      },
    ],
  },
];

const paymentMethods = [
  {
    id: "card-1",
    type: "credit",
    last4: "4242",
    brand: "Visa",
    isDefault: true,
  },
  {
    id: "bank-1",
    type: "bank",
    last4: "1234",
    brand: "Checking Account",
    isDefault: false,
  },
];

export default function PatientBilling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  );

  // Calculate financial stats
  const totalOwed = patientBills
    .filter((bill) => bill.status !== "paid")
    .reduce(
      (sum, bill) => sum + (bill.patientResponsibility - bill.amountPaid),
      0
    );

  const totalPaid = patientBills.reduce(
    (sum, bill) => sum + bill.amountPaid,
    0
  );

  const overdueAmount = patientBills
    .filter((bill) => bill.status === "overdue")
    .reduce(
      (sum, bill) => sum + (bill.patientResponsibility - bill.amountPaid),
      0
    );

  const thisYearTotal = patientBills.reduce(
    (sum, bill) => sum + bill.patientResponsibility,
    0
  );

  const filteredBills = patientBills.filter((bill) => {
    const matchesSearch =
      bill.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.services.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePayment = () => {
    if (selectedBill && paymentAmount) {
      // In a real app, this would integrate with payment processing
      console.log(
        `Processing payment of $${paymentAmount} for bill ${selectedBill.id}`
      );
      setIsPaymentModalOpen(false);
      setPaymentAmount("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Bills & Payments
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your healthcare bills and payment methods
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Patient: {currentPatient.name}
            </p>
            <p className="text-sm text-gray-500">ID: {currentPatient.id}</p>
          </div>
        </div>

        {/* Insurance Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield
              className="h-5 w-5 text-
blue-800 mr-2"
            />
            <div>
              <p className="font-medium text-blue-900">Insurance Coverage</p>
              <p className="text-sm text-blue-700">
                {currentPatient.insuranceProvider} • Policy:{" "}
                {currentPatient.policyNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">
              Amount Due
            </CardTitle>
            <div className="p-2 bg-red-600 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">
              ${totalOwed.toFixed(2)}
            </div>
            <p className="text-xs text-red-700 mt-2">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              Overdue
            </CardTitle>
            <div className="p-2 bg-orange-600 rounded-lg">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              ${overdueAmount.toFixed(2)}
            </div>
            <p className="text-xs text-orange-700 mt-2">Past due date</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Paid This Year
            </CardTitle>
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${totalPaid.toFixed(2)}
            </div>
            <p className="text-xs text-green-700 mt-2">Total payments made</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Total Healthcare Costs
            </CardTitle>
            <div className="p-2 bg-blue-800 rounded-lg">
              <Receipt className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              ${thisYearTotal.toFixed(2)}
            </div>
            <p className="text-xs text-blue-700 mt-2">Your portion this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {totalOwed > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="font-medium text-yellow-900">Payment Required</p>
                <p className="text-sm text-yellow-700">
                  You have ${totalOwed.toFixed(2)} in outstanding bills
                </p>
              </div>
            </div>
            <Button className="bg-blue-800 hover:bg-blue-700">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay All Bills
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
              placeholder="Search bills by provider or service..."
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
            <SelectItem value="all">All Bills</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills Table */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>You Owe</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.date}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bill.provider}</p>
                      <p className="text-sm text-gray-500">
                        Service: {bill.serviceDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{bill.services}</TableCell>
                  <TableCell className="font-medium">
                    ${bill.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    -${bill.insuranceCoverage.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-bold">
                    ${(bill.patientResponsibility - bill.amountPaid).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(bill.dueDate) < new Date() &&
                    bill.status !== "paid" ? (
                      <span className="text-red-600 font-medium">
                        {bill.dueDate}
                      </span>
                    ) : (
                      bill.dueDate
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        bill.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(bill.status)}
                      <span className="capitalize">{bill.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBill(bill);
                          setIsBillDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {bill.status !== "paid" &&
                        bill.patientResponsibility - bill.amountPaid > 0 && (
                          <Button
                            size="sm"
                            className="bg-blue-800 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedBill(bill);
                              setPaymentAmount(
                                (
                                  bill.patientResponsibility - bill.amountPaid
                                ).toFixed(2)
                              );
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay
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

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg ${
                  method.isDefault
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand} ••••{method.last4}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {method.type} {method.isDefault && "• Default"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Pay your healthcare bill securely
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedBill.services}</p>
                <p className="text-sm text-gray-600">{selectedBill.provider}</p>
                <p className="text-sm text-gray-600">Bill: {selectedBill.id}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.brand} ••••{method.last4}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Shield
                    className="h-4 w-4 text-
blue-800 mr-2"
                  />
                  <p className="text-sm text-blue-800">
                    Your payment is secured with 256-bit encryption
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="bg-blue-800 hover:bg-blue-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${paymentAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bill Details Modal */}
      <Dialog open={isBillDetailsOpen} onOpenChange={setIsBillDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown of your healthcare charges
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Provider</p>
                    <p>{selectedBill.provider}</p>
                  </div>
                  <div>
                    <p className="font-medium">Service Date</p>
                    <p>{selectedBill.serviceDate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bill Date</p>
                    <p>{selectedBill.date}</p>
                  </div>
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p>{selectedBill.dueDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Service Details</h4>
                <div className="space-y-2">
                  {selectedBill.billingCodes.map((code: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{code.code}</p>
                        <p className="text-sm text-gray-600">
                          {code.description}
                        </p>
                      </div>
                      <p className="font-medium">${code.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Charges:</span>
                    <span className="font-medium">
                      ${selectedBill.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Insurance Coverage:</span>
                    <span className="font-medium">
                      -${selectedBill.insuranceCoverage.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Your Responsibility:</span>
                    <span>
                      ${selectedBill.patientResponsibility.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-medium">
                      ${selectedBill.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-red-600">
                    <span>Balance Due:</span>
                    <span>
                      $
                      {(
                        selectedBill.patientResponsibility -
                        selectedBill.amountPaid
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBillDetailsOpen(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
