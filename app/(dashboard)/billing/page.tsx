"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
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
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Download,
  CreditCard,
} from "lucide-react";

const billingCodes = [
  {
    code: "99213",
    description: "Office visit, established patient",
    amount: 150,
  },
  {
    code: "99204",
    description: "Office visit, new patient, moderate complexity",
    amount: 250,
  },
  {
    code: "90791",
    description: "Psychiatric diagnostic evaluation",
    amount: 200,
  },
  { code: "90837", description: "Psychotherapy, 60 minutes", amount: 150 },
  { code: "90834", description: "Psychotherapy, 45 minutes", amount: 120 },
];

const sampleInvoices = [
  {
    id: "INV-001",
    patientName: "John Doe",
    patientId: "P001",
    date: "8/10/2025",
    services: "Office Visit - Follow-up",
    amount: 150.0,
    dueDate: "8/25/2025",
    status: "pending",
    billingCodes: ["99213"],
  },
  {
    id: "INV-002",
    patientName: "Sarah Johnson",
    patientId: "P002",
    date: "8/8/2025",
    services: "Initial Consultation Lab Work",
    amount: 250.0,
    dueDate: "8/23/2025",
    status: "paid",
    billingCodes: ["99204", "90791"],
  },
  {
    id: "INV-003",
    patientName: "Mike Wilson",
    patientId: "P003",
    date: "8/5/2025",
    services: "Therapy Session",
    amount: 85.0,
    dueDate: "8/20/2025",
    status: "overdue",
    billingCodes: ["90834"],
  },
];

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoices, setInvoices] = useState(sampleInvoices);

  const [newInvoice, setNewInvoice] = useState({
    patientName: "",
    patientId: "",
    services: "",
    selectedCodes: [] as string[],
    amount: 0,
    dueDate: "",
    notes: "",
  });

  // Calculate financial stats
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingPayments = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const thisMonth = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    if (
      newInvoice.patientName &&
      newInvoice.services &&
      newInvoice.amount > 0
    ) {
      const invoice = {
        id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
        ...newInvoice,
        date: new Date().toLocaleDateString(),
        status: "pending" as const,
        billingCodes: newInvoice.selectedCodes,
      };
      setInvoices([invoice, ...invoices]);
      setIsCreateInvoiceOpen(false);
      setNewInvoice({
        patientName: "",
        patientId: "",
        services: "",
        selectedCodes: [],
        amount: 0,
        dueDate: "",
        notes: "",
      });
    }
  };

  const handleCodeSelection = (code: string) => {
    const isSelected = newInvoice.selectedCodes.includes(code);
    let updatedCodes: string[];
    let updatedAmount = newInvoice.amount;

    if (isSelected) {
      updatedCodes = newInvoice.selectedCodes.filter((c) => c !== code);
      const codeData = billingCodes.find((bc) => bc.code === code);
      if (codeData) updatedAmount -= codeData.amount;
    } else {
      updatedCodes = [...newInvoice.selectedCodes, code];
      const codeData = billingCodes.find((bc) => bc.code === code);
      if (codeData) updatedAmount += codeData.amount;
    }

    setNewInvoice({
      ...newInvoice,
      selectedCodes: updatedCodes,
      amount: updatedAmount,
    });
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

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Billing & Invoicing
          </h1>
          <Dialog
            open={isCreateInvoiceOpen}
            onOpenChange={setIsCreateInvoiceOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-800 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate an invoice for patient services and procedures.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      value={newInvoice.patientName}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          patientName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="P001"
                      value={newInvoice.patientId}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          patientId: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Services Description</Label>
                  <Input
                    id="services"
                    placeholder="Describe the services provided"
                    value={newInvoice.services}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, services: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Billing Codes</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {billingCodes.map((code) => (
                      <div
                        key={code.code}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          newInvoice.selectedCodes.includes(code.code)
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleCodeSelection(code.code)}
                      >
                        <div>
                          <span className="font-medium">{code.code}</span>
                          <p className="text-sm text-gray-600">
                            {code.description}
                          </p>
                        </div>
                        <span className="font-medium">${code.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Total Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newInvoice.amount}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          amount: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or payment instructions"
                    value={newInvoice.notes}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-700">Collected payments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                Pending Payments
              </CardTitle>
              <div className="p-2 bg-orange-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">
                ${pendingPayments.toFixed(2)}
              </div>
              <p className="text-xs text-orange-700 mt-2">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">
                Overdue Amount
              </CardTitle>
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                ${overdueAmount.toFixed(2)}
              </div>
              <p className="text-xs text-red-700 mt-2">Past due date</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                This Month
              </CardTitle>
              <div className="p-2 bg-blue-800 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                ${thisMonth.toFixed(2)}
              </div>
              <p className="text-xs text-blue-700 mt-2">Total invoiced</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices by patient name or invoice ID..."
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
              <SelectItem value="all">All Status</SelectItem>
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
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {invoice.patientId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.services}</TableCell>
                    <TableCell className="font-medium">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== "paid" && (
                          <Button
                            size="sm"
                            className="bg-blue-800 hover:bg-blue-700"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Process Payment
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

        {/* Common Billing Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Common Billing Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {billingCodes.map((code) => (
                <div
                  key={code.code}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-600">{code.code}</span>
                    <span className="font-bold text-green-600">
                      ${code.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{code.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
