"use client";

import { useState, useMemo } from "react"; // Use the dedicated patient layout
import {
  Search,
  FileText,
  Calendar,
  User,
  ChevronDown,
  Eye,
  Activity,
  Heart,
  X,
  Download,
  MessageSquare,
} from "lucide-react";
import { useAppSelector } from "@/app/redux/hooks";

// --- TYPESCRIPT INTERFACES ---
interface Document {
  id: number;
  date: string;
  type: string;
  category: "physician" | "case_management" | "therapy" | "nursing";
  status: "completed" | "draft";
  title: string;
  content: string;
  author: string;
  signed: boolean;
}

// --- MOCK DATA (Filtered for a single patient) ---
const mockPatientDocuments: Document[] = [
  {
    id: 1,
    date: "2025-08-26T09:30:00",
    type: "Physician Note",
    category: "physician",
    status: "completed",
    title: "Annual Physical Exam",
    content:
      "Patient presents for routine annual physical. Overall health good, vitals stable. Continue current medications, follow up in 6 months for routine check. Discussed importance of diet and exercise.",
    author: "Dr. Smith",
    signed: true,
  },
  {
    id: 4,
    date: "2025-08-09T11:00:00",
    type: "Therapy Note",
    category: "therapy",
    status: "completed",
    title: "Progress Notes - Session 5",
    content:
      "Therapy session progress note showing improvement in anxiety symptoms. Patient is engaging well with cognitive behavioral therapy techniques.",
    author: "Dr. Brown",
    signed: true,
  },
];

// --- UI COMPONENTS (Simplified for brevity) ---
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

// --- DOCUMENT MODAL COMPONENT (Patient-Centric) ---
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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${config.color}`}
            >
              <CategoryIcon className={`h-6 w-6 text-${config.textColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
              <p className="text-sm text-gray-600">Authored by {doc.author}</p>
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
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Document Content
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {doc.content}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t mt-auto sticky bottom-0 bg-white">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function PatientDocumentsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

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
        <Icon className="h-3 w-3 mr-1.5" />
        {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const filteredDocuments = useMemo(
    () =>
      mockPatientDocuments
        .filter(
          (doc) =>
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (typeFilter === "all" || doc.type === typeFilter)
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [searchTerm, typeFilter]
  );

  return (
    <>
      <div className="min-h-screen">
        <div className="bg-gray-50 border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold">My Documents</h1>
            <p className="mt-2 text-gray-600">
              Access your clinical notes, lab results, and other documents.
            </p>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Document Types</option>
                <option>Physician Note</option>
                <option>Therapy Note</option>
                <option>Case Management Note</option>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2">
                        {getCategoryBadge(doc.category)}
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {formatDate(doc.date)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1.5" />
                          Authored by {doc.author}
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
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-lg border">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your uploaded and clinical documents will appear here.
                </p>
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
    </>
  );
}
