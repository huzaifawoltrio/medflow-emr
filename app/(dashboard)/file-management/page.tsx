"use client";

import { useState } from "react";

// For this standalone example, we assume they resolve correctly.
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Calendar, // Added Calendar icon
} from "lucide-react";

// --- Mock Components for Standalone Demo ---
// In a real app, you would import these from your UI library.

// Define FileJson icon component since it doesn't exist in lucide-react
const FileJson = FileText;

// --- Placeholder Data ---

// Data for Documents
const documents = [
  {
    id: 1,
    name: "John_Doe_Initial_Assessment.pdf",
    title: "John_Doe_Initial_Assessment.pdf",
    patient: "John Doe",
    user: "John Doe",
    date: "8/10/2025",
    size: "2.4 MB",
    description:
      "Initial psychiatric evaluation with comprehensive mental status exam.",
    tags: ["assessment", "intake", "depression", "anxiety"],
    isStarred: true,
    fileType: "pdf",
  },
  {
    id: 2,
    name: "Lab_Results_CBC_20250812.pdf",
    title: "Lab_Results_CBC_20250812.pdf",
    patient: "Sarah Johnson",
    user: "Sarah Johnson",
    date: "8/12/2025",
    size: "1.2 MB",
    description: "Complete blood count results.",
    tags: ["lab", "blood-work", "cbc", "routine"],
    isStarred: false,
    fileType: "sheet",
  },
  {
    id: 3,
    name: "Insurance_Card_Front.jpg",
    title: "Insurance_Card_Front.jpg",
    patient: "Mike Wilson",
    user: "Mike Wilson",
    date: "8/11/2025",
    size: "856 KB",
    description: "Front side of insurance card.",
    tags: ["insurance", "card", "verification"],
    isStarred: false,
    fileType: "image",
  },
  {
    id: 4,
    name: "Progress_Notes_Session_5.pdf",
    title: "Progress_Notes_Session_5.pdf",
    patient: "John Doe",
    user: "John Doe",
    date: "8/09/2025",
    size: "802 KB",
    description: "Therapy session progress note showing improvement.",
    tags: ["progress", "therapy", "session", "improvement"],
    isStarred: false,
    fileType: "doc",
  },
];

// Data for Structured Folders
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
  {
    title: "Prescriptions",
    description: "Medication lists, prescription records",
    docCount: 34,
    category: "Medication",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    title: "Consent Forms",
    description: "Treatment consent, release forms, HIPAA agreements",
    docCount: 67,
    category: "Legal",
    categoryColor: "bg-red-100 text-red-800",
  },
];

// Tags for filtering
const filterTags = [
  "assessment",
  "intake",
  "depression",
  "anxiety",
  "lab",
  "blood-work",
  "cbc",
  "routine",
  "insurance",
  "card",
  "verification",
  "progress",
  "therapy",
  "session",
  "improvement",
];

// --- Types ---

type Document = {
  id: number;
  name: string;
  title: string;
  patient: string;
  user: string;
  date: string;
  size: string;
  description: string;
  tags: string[];
  isStarred: boolean;
  fileType: string;
};

// --- Reusable Components ---

const fileTypeStyles: {
  [key: string]: { icon: React.ElementType; color: string };
} = {
  pdf: { icon: FileText, color: "text-red-500" },
  sheet: { icon: FileJson, color: "text-green-500" },
  image: { icon: FileImage, color: "text-blue-800" },
  doc: { icon: FileText, color: "text-blue-800" },
};

// UPDATED Document Card Component (Grid View)
const DocumentCard = ({ doc }: { doc: Document }) => {
  const FileIcon = fileTypeStyles[doc.fileType]?.icon || FileText;
  const iconColor = fileTypeStyles[doc.fileType]?.color || "text-gray-500";
  const MAX_TAGS = 3;
  const remainingTags = doc.tags.length - MAX_TAGS;

  return (
    <div className="bg-white text-gray-800 flex flex-col gap-4 rounded-xl border p-4 hover:shadow-lg transition-shadow h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <FileIcon className={`h-8 w-8 ${iconColor}`} />
        <button className="p-1">
          <Star
            className={`h-5 w-5 cursor-pointer ${
              doc.isStarred
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow gap-4">
        <h3 className="font-medium text-sm truncate" title={doc.title}>
          {doc.title}
        </h3>

        <div className="space-y-2 text-xs text-gray-600 font-light">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{doc.user}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{doc.date}</span>
          </div>
          <div>{doc.size}</div>
        </div>

        <p className="text-xs text-gray-600 font-light line-clamp-2">
          {doc.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {doc.tags.slice(0, MAX_TAGS).map((tag) => (
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
      </div>

      {/* Card Footer */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="ghost"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 h-9"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 w-9"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 h-9 w-9"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Document Row Component (List View)
const DocumentRow = ({ doc }: { doc: Document }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
    <FileText
      className={`h-8 w-8 flex-shrink-0 ${
        fileTypeStyles[doc.fileType]?.color || "text-gray-500"
      }`}
    />
    <div className="flex-grow">
      <div className="flex items-center space-x-2">
        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
        {doc.isStarred && (
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
        )}
      </div>
      <p className="text-sm text-gray-500">
        {doc.patient} • {doc.date} • {doc.size}
      </p>
      <p className="text-sm text-gray-600 truncate mt-1">{doc.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {doc.tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-600"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
      <Download className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
      <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500 cursor-pointer" />
    </div>
  </div>
);

// --- New Components for Structured Folders View ---

// Folder Card Component
const FolderCard = ({ folder }: { folder: (typeof structuredFolders)[0] }) => (
  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
    <CardContent className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4">
        <Folder className="w-8 h-8 text-blue-800" />
        <Badge variant="outline" className="text-green-600 border-green-300">
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
        <p className="text-sm text-gray-600">{folder.docCount} documents</p>
        <Badge
          className={`px-2.5 py-1 text-xs font-medium ${folder.categoryColor}`}
        >
          {folder.category}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Structured Folders View Component
const StructuredFoldersView = () => (
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
        <FolderCard key={index} folder={folder} />
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

// --- Main Page Component ---

export default function FileManagement() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"documents" | "structured">(
    "documents"
  );

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
          <Button className="bg-blue-800 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
            <Upload className="h-4 w-4 mr-2" /> Upload Document
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "documents"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Documents
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

        {/* Conditional Content based on Active Tab */}
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
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="text-sm border-gray-300 bg-white"
                  >
                    All Folders
                  </Button>
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
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  Filter by tags:
                </span>
                <div className="inline-flex flex-wrap gap-2">
                  {filterTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100 bg-white border-gray-300 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents View */}
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "structured" && <StructuredFoldersView />}
      </div>
    </MainLayout>
  );
}
