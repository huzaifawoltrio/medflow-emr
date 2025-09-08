"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchMyUploadedDocuments,
  deleteDocument,
  Document,
} from "@/app/redux/features/documents/documentActions";
import {
  clearError,
  clearDeleteError,
} from "@/app/redux/features/documents/documentSlice";
import { fetchPatients } from "@/app/redux/features/patients/patientActions";

import MainLayout from "@/components/layout/main-layout";
import UploadDocumentModal from "@/components/document/UploadDocumentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Upload,
  FileText,
  Star,
  Download,
  Trash2,
  List,
  LayoutGrid,
  Eye,
  User,
  FileImage,
  Folder,
  Cpu,
  Tags,
  Calendar,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define FileJson icon component since it doesn't exist in lucide-react
const FileJson = FileText;

// --- Types ---
type ViewType = "grid" | "list";
type TabType = "documents" | "structured";

// --- File type styles ---
const fileTypeStyles: {
  [key: string]: { icon: React.ElementType; color: string };
} = {
  pdf: { icon: FileText, color: "text-red-500" },
  doc: { icon: FileText, color: "text-blue-600" },
  docx: { icon: FileText, color: "text-blue-600" },
  txt: { icon: FileText, color: "text-gray-600" },
  jpg: { icon: FileImage, color: "text-green-500" },
  jpeg: { icon: FileImage, color: "text-green-500" },
  png: { icon: FileImage, color: "text-green-500" },
  gif: { icon: FileImage, color: "text-purple-500" },
  default: { icon: FileText, color: "text-gray-500" },
};

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "default";
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

// --- Components ---

// Updated Document Card Component (Grid View) with Redux integration
const DocumentCard = ({
  doc,
  onDelete,
}: {
  doc: Document;
  onDelete: (id: number) => void;
}) => {
  const fileExtension = getFileExtension(doc.file_name);
  const FileIcon = fileTypeStyles[fileExtension]?.icon || FileText;
  const iconColor = fileTypeStyles[fileExtension]?.color || "text-gray-500";
  const tags = doc.tags || [];
  const MAX_TAGS = 3;
  const remainingTags = tags.length - MAX_TAGS;

  const handleDownload = () => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    }
  };

  const handleView = () => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    }
  };

  return (
    <div className="bg-white text-gray-800 flex flex-col gap-4 rounded-xl border p-4 hover:shadow-lg transition-shadow h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <FileIcon className={`h-8 w-8 ${iconColor}`} />
        <button className="p-1">
          <Star className="h-5 w-5 cursor-pointer text-gray-300 hover:text-yellow-400" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow gap-4">
        <h3 className="font-medium text-sm truncate" title={doc.file_name}>
          {doc.file_name}
        </h3>

        <div className="space-y-2 text-xs text-gray-600 font-light">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{doc.uploader_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(doc.created_at)}</span>
          </div>
          <div>{formatFileSize(doc.file_size)}</div>
        </div>

        <p className="text-xs text-gray-600 font-light line-clamp-2">
          {doc.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, MAX_TAGS).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-100 text-gray-600 font-normal text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {remainingTags > 0 && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600 font-normal text-xs px-2 py-0.5"
              >
                +{remainingTags}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="ghost"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 h-9"
          onClick={handleView}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 w-9"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 h-9 w-9"
          onClick={() => onDelete(doc.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Document Row Component (List View) with Redux integration
const DocumentRow = ({
  doc,
  onDelete,
}: {
  doc: Document;
  onDelete: (id: number) => void;
}) => {
  const fileExtension = getFileExtension(doc.file_name);
  const FileIcon = fileTypeStyles[fileExtension]?.icon || FileText;
  const iconColor = fileTypeStyles[fileExtension]?.color || "text-gray-500";
  const tags = doc.tags || [];

  const handleDownload = () => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    }
  };

  const handleView = () => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
      <FileIcon className={`h-8 w-8 flex-shrink-0 ${iconColor}`} />
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-800">{doc.file_name}</h3>
        </div>
        <p className="text-sm text-gray-500">
          {doc.uploader_name} • {formatDate(doc.created_at)} •{" "}
          {formatFileSize(doc.file_size)}
        </p>
        <p className="text-sm text-gray-600 truncate mt-1">{doc.description}</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <Eye
          className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={handleView}
        />
        <Download
          className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={handleDownload}
        />
        <Trash2
          className="h-5 w-5 text-gray-500 hover:text-red-500 cursor-pointer"
          onClick={() => onDelete(doc.id)}
        />
      </div>
    </div>
  );
};

// Structured Folders View Component (placeholder for now)
const StructuredFoldersView = () => {
  const structuredFolders = [
    {
      title: "Initial Psych Evaluations",
      description: "Comprehensive initial psychiatric assessments",
      docCount: 12,
      category: "Clinical",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      title: "Progress Notes",
      description: "Session notes and treatment progress documentation",
      docCount: 45,
      category: "Clinical",
      categoryColor: "bg-blue-100 text-blue-800",
    },
    {
      title: "Laboratory Results",
      description: "Blood work, imaging, and diagnostic test results",
      docCount: 23,
      category: "Diagnostic",
      categoryColor: "bg-purple-100 text-purple-800",
    },
    {
      title: "Insurance Documents",
      description: "Insurance cards, authorization forms, claims",
      docCount: 16,
      category: "Administrative",
      categoryColor: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Structured Folders
        </h2>
        <Badge variant="secondary" className="bg-gray-200 text-gray-600">
          <Cpu className="h-4 w-4 mr-2" />
          Auto-organized by AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structuredFolders.map((folder, index) => (
          <Card
            key={index}
            className="flex flex-col h-full hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <Folder className="w-8 h-8 text-blue-800" />
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-300"
                >
                  <Star className="w-3 h-3 mr-1.5 fill-green-500 text-green-500" />
                  Smart
                </Badge>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{folder.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {folder.description}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {folder.docCount} documents
                </p>
                <Badge
                  className={`px-2.5 py-1 text-xs font-medium ${folder.categoryColor}`}
                >
                  {folder.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Smart Tagging & Organization
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <Tags className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Automatic Tagging</h4>
              <p className="text-sm text-gray-500 mt-1">
                Documents are automatically tagged based on content analysis,
                document type, and patient information.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">
                Smart Folder Organization
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Files are automatically sorted into appropriate folders based on
                document type and clinical context.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function FileManagement() {
  const dispatch = useAppDispatch();
  const { myUploadedDocuments, loading, deleting, error, deleteError } =
    useAppSelector((state) => state.documents);
  const { patients } = useAppSelector((state) => state.patient);

  // Local state
  const [view, setView] = useState<ViewType>("grid");
  const [activeTab, setActiveTab] = useState<TabType>("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Get documents from paginated response
  const documents = myUploadedDocuments?.documents || [];
  const totalCount = myUploadedDocuments?.total_count || 0;

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchMyUploadedDocuments({}));
    if (patients.length === 0) {
      dispatch(fetchPatients());
    }
  }, [dispatch, patients.length]);

  // Handle document deletion
  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await dispatch(deleteDocument(documentId));
      // Refresh the documents list after deletion
      dispatch(fetchMyUploadedDocuments({}));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchMyUploadedDocuments({}));
  };

  // Clear errors
  const handleClearError = () => {
    dispatch(clearError());
    dispatch(clearDeleteError());
  };

  // Filter documents based on search and tags
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.uploader_name &&
        doc.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.patient_name &&
        doc.patient_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Get all unique tags from documents
  const allTags = Array.from(
    new Set(documents.flatMap((doc) => doc.tags || []))
  );

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
          <Button
            className="bg-blue-800 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" /> Upload Document
          </Button>
        </div>

        {/* Error Alerts */}
        {(error || deleteError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>{error || deleteError}</span>
              <Button variant="ghost" size="sm" onClick={handleClearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "documents"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Documents ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("structured")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "structured"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Structured Folders
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "documents" && (
          <>
            {/* Search and Filter Section */}
            <div className="py-6">
              <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center mb-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search documents by name, patient, or content..."
                    className="pl-10 pr-4 py-2 bg-transparent w-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded-lg bg-white">
                    <Button
                      variant={view === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setView("grid")}
                      className={view === "grid" ? "bg-gray-100" : ""}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={view === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setView("list")}
                      className={view === "list" ? "bg-gray-100" : ""}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    Filter by tags:
                  </span>
                  <div className="inline-flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedTags.includes(tag)
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "hover:bg-gray-100 bg-white border-gray-300 text-gray-600"
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="ml-4 text-gray-500"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
                <span className="ml-2 text-gray-600">Loading documents...</span>
              </div>
            )}

            {/* Documents Display */}
            {!loading && (
              <>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {documents.length === 0
                        ? "No documents yet"
                        : "No matching documents"}
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {documents.length === 0
                        ? "Upload your first document to get started."
                        : "Try adjusting your search or filter criteria."}
                    </p>
                    {documents.length === 0 && (
                      <Button
                        className="mt-4 bg-blue-800 hover:bg-blue-700"
                        onClick={() => setIsUploadModalOpen(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-600">
                        Showing {filteredDocuments.length} of {totalCount}{" "}
                        documents
                      </p>
                      {deleting && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Deleting document...
                        </div>
                      )}
                    </div>

                    {view === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDocuments.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onDelete={handleDeleteDocument}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredDocuments.map((doc) => (
                          <DocumentRow
                            key={doc.id}
                            doc={doc}
                            onDelete={handleDeleteDocument}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "structured" && <StructuredFoldersView />}

        {/* Upload Modal */}
        <UploadDocumentModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
