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
  MoreHorizontal,
  View,
  Download,
  Trash2,
  List,
  LayoutGrid,
} from "lucide-react";

// Placeholder data for documents
const documents = [
  {
    id: 1,
    name: "John_Doe_Initial_Assessment.pdf",
    patient: "John Doe",
    date: "8/10/2024",
    size: "2.4 MB",
    description:
      "Initial psychiatric evaluation with comprehensive mental status exam.",
    tags: ["assessment", "intake", "depression", "+1"],
    isStarred: true,
    iconColor: "text-red-500",
  },
  {
    id: 2,
    name: "Lab_Results_CBC_20240812.pdf",
    patient: "Sarah Johnson",
    date: "8/12/2024",
    size: "1.2 MB",
    description: "Complete blood count results.",
    tags: ["lab", "blood-work", "cbc", "+1"],
    isStarred: false,
    iconColor: "text-yellow-500",
  },
  {
    id: 3,
    name: "Insurance_Card_Front.jpg",
    patient: "Mike Wilson",
    date: "8/11/2024",
    size: "856 KB",
    description: "Front side of insurance card.",
    tags: ["insurance", "card", "verification"],
    isStarred: false,
    iconColor: "text-blue-500",
  },
  {
    id: 4,
    name: "Progress_Notes_Session_5.pdf",
    patient: "John Doe",
    date: "8/09/2024",
    size: "802 KB",
    description: "Therapy session progress note showing improvement.",
    tags: ["progress", "therapy", "session", "+1"],
    isStarred: false,
    iconColor: "text-blue-500",
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

const DocumentCard = ({ doc }) => (
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <FileText className={`h-6 w-6 ${doc.iconColor}`} />
        <div className="flex items-center space-x-2">
          <Star
            className={`h-5 w-5 ${
              doc.isStarred ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <h3 className="font-semibold mt-3 text-gray-800">{doc.name}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {doc.patient} • {doc.date} • {doc.size}
      </p>
      <p className="text-sm text-gray-600 mt-2">{doc.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {doc.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex justify-end items-center mt-4 space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <View className="h-4 w-4 mr-1" /> View
        </Button>
        <Download className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
      </div>
    </CardContent>
  </Card>
);

export default function FileManagement() {
  const [view, setView] = useState("grid"); // 'grid' or 'list'

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
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents by name, patient, or content..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-sm">
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
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : ""
          } gap-6`}
        >
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
