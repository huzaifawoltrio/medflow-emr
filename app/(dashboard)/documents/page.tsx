"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Search,
  Plus,
  FileText,
  Calendar,
  User,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  PenTool,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  TestTube,
  Camera,
  Heart,
  Thermometer,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientId: "MRN-789012",
    patientAge: 34,
    date: "2025-08-26T09:30:00",
    type: "Physician Note",
    category: "physician",
    status: "completed",
    title: "Annual Physical Exam",
    content:
      "Patient presents for routine annual physical. Overall health good, vitals stable. Continue current medications...",
    billingCodes: ["99213", "90834"],
    author: "Dr. Smith",
    signed: true,
  },
  {
    id: 2,
    patientName: "John Martinez",
    patientId: "MRN-456789",
    patientAge: 42,
    date: "2025-08-26T08:15:00",
    type: "Case Management Note",
    category: "case_management",
    status: "draft",
    title: "Care Coordination Update",
    content:
      "Follow-up on insurance authorization for specialist referral. Patient requires additional documentation...",
    billingCodes: [],
    author: "Jane Coordinator",
    signed: false,
  },
  {
    id: 3,
    patientName: "Emily Chen",
    patientId: "MRN-123456",
    patientAge: 28,
    date: "2025-08-25T14:45:00",
    type: "Therapy Note",
    category: "therapy",
    status: "completed",
    title: "CBT Session - Anxiety Management",
    content:
      "Patient showed significant progress in managing anxiety symptoms. Homework assignments completed successfully...",
    billingCodes: ["90837"],
    author: "Dr. Thompson",
    signed: true,
  },
  {
    id: 4,
    patientName: "Robert Wilson",
    patientId: "MRN-987654",
    patientAge: 67,
    date: "2025-08-25T11:20:00",
    type: "Nursing Note",
    category: "nursing",
    status: "completed",
    title: "Medication Administration",
    content:
      "Patient received prescribed medications as ordered. No adverse reactions observed. Vital signs stable...",
    billingCodes: [],
    author: "RN Patricia",
    signed: true,
  },
  {
    id: 5,
    patientName: "Sarah Johnson",
    patientId: "MRN-789012",
    patientAge: 34,
    date: "2025-08-24T16:00:00",
    type: "Physician Note",
    category: "physician",
    status: "draft",
    title: "Follow-up Visit",
    content:
      "Patient returns for follow-up of hypertension management. Blood pressure readings improved...",
    billingCodes: ["99212"],
    author: "Dr. Smith",
    signed: false,
  },
];

// Mock data for results
const mockResults = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientId: "MRN-789012",
    date: "2025-08-25T10:30:00",
    category: "Labs",
    type: "Complete Blood Count",
    status: "completed",
    result: "Normal",
    critical: false,
    values: "WBC: 6.5, RBC: 4.2, Hgb: 13.8, Hct: 41.2",
    referenceRange: "WBC: 4.5-11.0, RBC: 3.8-5.2, Hgb: 12.0-15.5, Hct: 36-46",
  },
  {
    id: 2,
    patientName: "John Martinez",
    patientId: "MRN-456789",
    date: "2025-08-24T14:15:00",
    category: "Imaging",
    type: "Chest X-Ray",
    status: "completed",
    result: "No acute findings",
    critical: false,
    values: "Clear lung fields, normal cardiac silhouette",
    referenceRange: null,
  },
  {
    id: 3,
    patientName: "Robert Wilson",
    patientId: "MRN-987654",
    date: "2025-08-26T09:00:00",
    category: "Vitals",
    type: "Blood Pressure",
    status: "completed",
    result: "Elevated",
    critical: true,
    values: "180/95 mmHg",
    referenceRange: "<120/80 mmHg",
  },
  {
    id: 4,
    patientName: "Emily Chen",
    patientId: "MRN-123456",
    date: "2025-08-25T08:45:00",
    category: "Labs",
    type: "Lipid Panel",
    status: "completed",
    result: "Borderline",
    critical: false,
    values: "Total: 220, LDL: 145, HDL: 38, Trig: 185",
    referenceRange: "Total: <200, LDL: <100, HDL: >40, Trig: <150",
  },
];

// All unique patients for dropdown
const allPatients = Array.from(
  new Set(
    [
      ...mockDocuments.map((d) => ({
        id: d.patientId,
        name: d.patientName,
        age: d.patientAge,
      })),
      ...mockResults.map((r) => ({
        id: r.patientId,
        name: r.patientName,
        age: 0,
      })),
    ].map((p) => JSON.stringify(p))
  )
).map((p) => JSON.parse(p));

// Custom components
const Badge = ({ children, className = "", variant = "default" }) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-white"
      : className || "bg-gray-100 text-gray-800";

  return <span className={`${baseClasses} ${variantClasses}`}>{children}</span>;
};

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-blue-800 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  className = "",
  type = "text",
  placeholder,
  value,
  onChange,
  ...props
}) => {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

const Select = ({ children, value, onChange, className = "" }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default function Documents() {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status, signed = false) => {
    if (status === "completed" && signed) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Signed
        </Badge>
      );
    } else if (status === "completed") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Completed
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Draft
        </Badge>
      );
    }
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      physician: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FileText,
      },
      case_management: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: User,
      },
      therapy: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Activity,
      },
      nursing: {
        color: "bg-pink-100 text-pink-800 border-pink-200",
        icon: Heart,
      },
    };

    const config = categoryConfig[category] || {
      color: "bg-gray-100 text-gray-800",
      icon: FileText,
    };
    const IconComponent = config.icon;
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const getResultBadge = (result, critical) => {
    if (critical) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Critical
        </Badge>
      );
    } else if (result === "Normal") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Normal
        </Badge>
      );
    } else if (result === "Borderline" || result === "Elevated") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {result}
        </Badge>
      );
    }
    return <Badge className="bg-gray-100 text-gray-800">{result}</Badge>;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Labs: TestTube,
      Imaging: Camera,
      Vitals: Activity,
    };
    return icons[category] || FileText;
  };

  // Filtered data
  const filteredDocuments = useMemo(() => {
    return mockDocuments
      .filter((doc) => {
        const matchesSearch =
          doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPatient =
          selectedPatient === "all" || doc.patientId === selectedPatient;
        const matchesType = typeFilter === "all" || doc.type === typeFilter;
        const matchesStatus =
          statusFilter === "all" || doc.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || doc.category === categoryFilter;

        return (
          matchesSearch &&
          matchesPatient &&
          matchesType &&
          matchesStatus &&
          matchesCategory
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchTerm, selectedPatient, typeFilter, statusFilter, categoryFilter]);

  const filteredResults = useMemo(() => {
    return mockResults
      .filter((result) => {
        const matchesSearch =
          result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPatient =
          selectedPatient === "all" || result.patientId === selectedPatient;
        const matchesCategory =
          categoryFilter === "all" || result.category === categoryFilter;

        return matchesSearch && matchesPatient && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchTerm, selectedPatient, categoryFilter]);

  // Group documents by category
  const groupedDocuments = useMemo(() => {
    const groups = filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {});
    return groups;
  }, [filteredDocuments]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups = filteredResults.reduce((acc, result) => {
      if (!acc[result.category]) acc[result.category] = [];
      acc[result.category].push(result);
      return acc;
    }, {});
    return groups;
  }, [filteredResults]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Documents & Results
              </h1>
              <p className="mt-2 text-gray-600">
                Manage clinical documentation and review results across all
                patients
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "documents", label: "Documents", icon: FileText },
                  { id: "results", label: "Results Review", icon: TrendingUp },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === id
                        ? "border-blue-500 text-blue-800"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={
                      activeTab === "documents"
                        ? "Search documents..."
                        : "Search results..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="min-w-0 flex-1 sm:w-48">
                    <Select
                      value={selectedPatient}
                      onChange={setSelectedPatient}
                    >
                      <option value="all">All Patients</option>
                      {allPatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </option>
                      ))}
                    </Select>
                  </div>

                  {activeTab === "documents" ? (
                    <>
                      <div className="min-w-0 flex-1 sm:w-40">
                        <Select value={typeFilter} onChange={setTypeFilter}>
                          <option value="all">All Types</option>
                          <option value="Physician Note">Physician Note</option>
                          <option value="Case Management Note">
                            Case Management
                          </option>
                          <option value="Therapy Note">Therapy Note</option>
                          <option value="Nursing Note">Nursing Note</option>
                        </Select>
                      </div>
                      <div className="min-w-0 flex-1 sm:w-32">
                        <Select value={statusFilter} onChange={setStatusFilter}>
                          <option value="all">All Status</option>
                          <option value="draft">Draft</option>
                          <option value="completed">Completed</option>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div className="min-w-0 flex-1 sm:w-40">
                      <Select
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                      >
                        <option value="all">All Categories</option>
                        <option value="Labs">Labs</option>
                        <option value="Imaging">Imaging</option>
                        <option value="Vitals">Vitals</option>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            {activeTab === "documents" ? (
              <div className="space-y-8">
                {Object.keys(groupedDocuments).length > 0 ? (
                  Object.entries(groupedDocuments).map(
                    ([category, documents]) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-semibold text-gray-900 capitalize">
                            {category.replace("_", " ")} Notes
                          </h2>
                          <Badge className="bg-gray-100 text-gray-700">
                            {documents.length}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-800" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-gray-900">
                                          {doc.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                          <span className="font-medium">
                                            {doc.patientName}
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span>{doc.patientId}</span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span>Age {doc.patientAge}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                      {getCategoryBadge(doc.category)}
                                      {getStatusBadge(doc.status, doc.signed)}
                                      <span className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(doc.date)}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        by {doc.author}
                                      </span>
                                    </div>

                                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                                      {doc.content}
                                    </p>

                                    {doc.billingCodes.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-600">
                                          Billing:
                                        </span>
                                        <div className="flex gap-1">
                                          {doc.billingCodes.map((code) => (
                                            <Badge
                                              key={code}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {code}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 ml-4">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    {!doc.signed && (
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <PenTool className="h-3 w-3 mr-1" />
                                        Sign
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No documents found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedResults).length > 0 ? (
                  Object.entries(groupedResults).map(([category, results]) => {
                    const CategoryIcon = getCategoryIcon(category);
                    return (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                          <h2 className="text-xl font-semibold text-gray-900">
                            {category}
                          </h2>
                          <Badge className="bg-gray-100 text-gray-700">
                            {results.length}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {results.map((result) => (
                            <div
                              key={result.id}
                              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          result.critical
                                            ? "bg-red-100"
                                            : "bg-blue-100"
                                        }`}
                                      >
                                        <CategoryIcon
                                          className={`h-5 w-5 ${
                                            result.critical
                                              ? "text-red-800"
                                              : "text-blue-800"
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-gray-900">
                                          {result.type}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                          <span className="font-medium">
                                            {result.patientName}
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span>{result.patientId}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                      {getResultBadge(
                                        result.result,
                                        result.critical
                                      )}
                                      <span className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(result.date)}
                                      </span>
                                      {result.critical && (
                                        <span className="flex items-center text-sm text-red-600 font-medium">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Critical Value
                                        </span>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-sm font-medium text-gray-600">
                                          Result:{" "}
                                        </span>
                                        <span className="text-sm text-gray-800">
                                          {result.values}
                                        </span>
                                      </div>
                                      {result.referenceRange && (
                                        <div>
                                          <span className="text-sm font-medium text-gray-600">
                                            Reference:{" "}
                                          </span>
                                          <span className="text-sm text-gray-600">
                                            {result.referenceRange}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 ml-4">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Full
                                    </Button>
                                    {result.critical && (
                                      <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Alert
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
