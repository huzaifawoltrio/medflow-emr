"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
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
} from "lucide-react";

// Define FileJson icon component since it doesn't exist in lucide-react
const FileJson = FileText;

// Placeholder data for documents
const documents = [
  {
    id: 1,
    name: "John_Doe_Initial_Assessment.pdf",
    title: "John_Doe_Initial_Assessment.pdf",
    patient: "John Doe",
    user: "John Doe",
    date: "8/10/2024",
    size: "2.4 MB",
    description:
      "Initial psychiatric evaluation with comprehensive mental status exam.",
    tags: ["assessment", "intake", "depression", "anxiety"],
    isStarred: true,
    iconColor: "text-red-500",
    fileType: "pdf",
  },
  {
    id: 2,
    name: "Lab_Results_CBC_20240812.pdf",
    title: "Lab_Results_CBC_20240812.pdf",
    patient: "Sarah Johnson",
    user: "Sarah Johnson",
    date: "8/12/2024",
    size: "1.2 MB",
    description: "Complete blood count results.",
    tags: ["lab", "blood-work", "cbc", "routine"],
    isStarred: false,
    iconColor: "text-green-500",
    fileType: "pdf",
  },
  {
    id: 3,
    name: "Insurance_Card_Front.jpg",
    title: "Insurance_Card_Front.jpg",
    patient: "Mike Wilson",
    user: "Mike Wilson",
    date: "8/11/2024",
    size: "856 KB",
    description: "Front side of insurance card.",
    tags: ["insurance", "card", "verification"],
    isStarred: false,
    iconColor: "text-blue-500",
    fileType: "image",
  },
  {
    id: 4,
    name: "Progress_Notes_Session_5.pdf",
    title: "Progress_Notes_Session_5.pdf",
    patient: "John Doe",
    user: "John Doe",
    date: "8/09/2024",
    size: "802 KB",
    description: "Therapy session progress note showing improvement.",
    tags: ["progress", "therapy", "session", "improvement"],
    isStarred: false,
    iconColor: "text-blue-500",
    fileType: "pdf",
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
  iconColor: string;
  fileType: string;
};

const fileTypeStyles: {
  [key: string]: { icon: React.ElementType; color: string };
} = {
  pdf: { icon: FileText, color: "text-red-500" },
  sheet: { icon: FileJson, color: "text-green-500" },
  image: { icon: FileImage, color: "text-blue-500" },
  doc: { icon: FileText, color: "text-blue-500" },
};

// Reusable Document Card Component
const DocumentCard = ({ doc }: { doc: Document }) => {
  const FileIcon = fileTypeStyles[doc.fileType]?.icon || FileText;
  const iconColor = fileTypeStyles[doc.fileType]?.color || "text-gray-500";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Card Header */}
      <div className="p-4 flex justify-between items-start">
        <FileIcon className={`h-6 w-6 ${iconColor}`} />
        <Star
          className={`h-5 w-5 cursor-pointer ${
            doc.isStarred
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 hover:text-yellow-400"
          }`}
        />
      </div>

      {/* Card Content */}
      <div className="px-4 pb-4 flex-grow">
        <h3 className="font-semibold text-gray-800 truncate" title={doc.title}>
          {doc.title}
        </h3>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1.5" />
            <span>{doc.user}</span>
          </div>
          <p>{doc.date}</p>
          <p>{doc.size}</p>
        </div>
        <p className="mt-3 text-sm text-gray-600 line-clamp-1">
          {doc.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t mt-auto flex justify-between items-center">
        <div className="flex-1"></div> {/* Spacer */}
        <div className="flex-1 flex justify-center">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DocumentRow = ({ doc }: { doc: Document }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
    <FileText className={`h-8 w-8 flex-shrink-0 ${doc.iconColor}`} />
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

export default function FileManagement() {
  const [view, setView] = useState<"grid" | "list">("grid"); // 'grid' or 'list'

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
            <Upload className="h-4 w-4 mr-2" /> Upload Document
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            Documents
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Structured Folders
          </button>
        </div>

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
              <Button variant="outline" className="text-sm border-gray-200">
                All Folders
              </Button>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("list")}
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
                  className="cursor-pointer hover:bg-gray-100 bg-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

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
      </div>
    </MainLayout>
  );
}
