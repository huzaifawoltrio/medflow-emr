"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Search,
  FileText,
  Calendar,
  User,
  ChevronDown,
  Eye,
  Edit,
  PenTool,
  Activity,
  Heart,
  X,
  Download,
  MessageSquare,
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface Patient {
  id: string;
  name: string;
  age: number;
}

interface Document {
  id: number;
  patientName: string;
  patientId: string;
  patientAge: number;
  date: string;
  type: string;
  category: "physician" | "case_management" | "therapy" | "nursing";
  status: "completed" | "draft";
  title: string;
  content: string;
  billingCodes: string[];
  author: string;
  signed: boolean;
}

// --- MOCK DATA ---
const mockDocuments: Document[] = [
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
      "Patient presents for routine annual physical. Overall health good, vitals stable. Continue current medications, follow up in 6 months for routine check. Discussed importance of diet and exercise.",
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
      "Follow-up on insurance authorization for specialist referral. Patient requires additional documentation from primary care. Contacted insurance rep, awaiting callback. Plan to follow up with patient by EOD.",
    billingCodes: [],
    author: "Jane Coordinator",
    signed: false,
  },
];

const allPatients: Patient[] = Array.from(
  new Set(
    mockDocuments.map((d) =>
      JSON.stringify({
        id: d.patientId,
        name: d.patientName,
        age: d.patientAge,
      })
    )
  )
).map((p) => JSON.parse(p));

// --- UI COMPONENTS ---
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: any;
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-blue-800 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  const sizes = { default: "px-4 py-2 text-sm", sm: "px-3 py-1.5 text-xs" };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
const Input = ({ className = "", ...props }: React.ComponentProps<"input">) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${className}`}
    {...props}
  />
);
const Select = ({ children, ...props }: React.ComponentProps<"select">) => (
  <div className="relative">
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white"
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  </div>
);

// --- DOCUMENT MODAL COMPONENT ---
const DocumentDetailsModal = ({
  doc,
  isOpen,
  onClose,
}: {
  doc: Document | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !doc) return null;

  const categoryConfig = {
    physician: { color: "blue-100", textColor: "blue-700", icon: FileText },
    case_management: {
      color: "purple-100",
      textColor: "purple-700",
      icon: User,
    },
    therapy: { color: "green-100", textColor: "green-700", icon: Activity },
    nursing: { color: "pink-100", textColor: "pink-700", icon: Heart },
  };
  const config = categoryConfig[doc.category];
  const CategoryIcon = config.icon;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 "
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start rounded-2xl justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${config.color}`}
            >
              <CategoryIcon className={`h-6 w-6 text-${config.textColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
              <p className="text-sm text-gray-600">
                {doc.patientName} ({doc.patientId})
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Date</p>
              <p className="text-gray-800 font-semibold">
                {new Date(doc.date).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Author</p>
              <p className="text-gray-800 font-semibold">{doc.author}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Status</p>
              <p className="text-gray-800 font-semibold">
                {doc.signed ? "Signed" : "Draft"}
              </p>
            </div>
          </div>

          {/* Document Content */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Document Content
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {doc.content}
            </p>
          </div>

          {/* Billing Codes */}
          {doc.billingCodes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Billing Codes
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.billingCodes.map((code) => (
                  <Badge key={code} className="bg-gray-100 text-gray-700">
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center rounded-2xl justify-end gap-3 p-6 border-t mt-auto sticky bottom-0 bg-white">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Note
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  const getStatusBadge = (status: "completed" | "draft", signed: boolean) => {
    if (status === "completed" && signed)
      return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
    if (status === "completed")
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
  };
  const getCategoryBadge = (category: Document["category"]) => {
    const config = {
      physician: { color: "bg-blue-100 text-blue-800", icon: FileText },
      case_management: { color: "bg-purple-100 text-purple-800", icon: User },
      therapy: { color: "bg-green-100 text-green-800", icon: Activity },
      nursing: { color: "bg-pink-100 text-pink-800", icon: Heart },
    }[category] || { color: "bg-gray-100", icon: FileText };
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const filteredDocuments = useMemo(
    () =>
      mockDocuments
        .filter(
          (doc) =>
            (doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doc.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedPatient === "all" || doc.patientId === selectedPatient) &&
            (typeFilter === "all" || doc.type === typeFilter) &&
            (statusFilter === "all" || doc.status === statusFilter)
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [searchTerm, selectedPatient, typeFilter, statusFilter]
  );

  const groupedDocuments = useMemo(
    () =>
      filteredDocuments.reduce((acc, doc) => {
        if (!acc[doc.category]) acc[doc.category] = [];
        acc[doc.category].push(doc);
        return acc;
      }, {} as Record<string, Document[]>),
    [filteredDocuments]
  );

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="bg-gray-50 border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="mt-2 text-gray-600">
              Manage all clinical documentation
            </p>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="all">All Patients</option>
                  {allPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </Select>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option>Physician Note</option>
                  <option>Case Management Note</option>
                </Select>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option>Draft</option>
                  <option>Completed</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {Object.keys(groupedDocuments).length > 0 ? (
              Object.entries(groupedDocuments).map(([category, documents]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-xl font-semibold capitalize">
                    {category.replace("_", " ")} Notes
                  </h2>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-lg shadow-sm border p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-gray-600">
                              {doc.patientName} ({doc.patientId})
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              {getCategoryBadge(doc.category)}
                              {getStatusBadge(doc.status, doc.signed)}
                              <span className="text-sm text-gray-500">
                                {formatDate(doc.date)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-lg border">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      <DocumentDetailsModal
        doc={selectedDocument}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
}
