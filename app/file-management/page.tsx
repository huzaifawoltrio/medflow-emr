"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, Eye, Download, Trash2, FileText, ImageIcon, File, Star } from "lucide-react"

const documents = [
  {
    id: 1,
    name: "John_Doe_Initial_Assessment.pdf",
    patient: "John Doe",
    date: "8/10/2024",
    size: "2.4 MB",
    type: "pdf",
    description: "Initial psychiatric evaluation with comprehensive mental status exam",
    tags: ["assessment", "intake", "depression"],
    starred: true,
  },
  {
    id: 2,
    name: "Lab_Results_CBC_20240812.pdf",
    patient: "Sarah Johnson",
    date: "8/12/2024",
    size: "1.2 MB",
    type: "pdf",
    description: "Complete blood count results",
    tags: ["lab", "blood-work", "cbc"],
    starred: false,
  },
  {
    id: 3,
    name: "Insurance_Card_Front.jpg",
    patient: "Mike Wilson",
    date: "8/11/2024",
    size: "856 KB",
    type: "image",
    description: "Front side of insurance card",
    tags: ["insurance", "card", "verification"],
    starred: false,
  },
  {
    id: 4,
    name: "Progress_Note_Session_5.pdf",
    patient: "John Doe",
    date: "8/9/2024",
    size: "892 KB",
    type: "pdf",
    description: "Therapy session progress note showing improvement",
    tags: ["progress", "therapy", "session"],
    starred: false,
  },
]

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
]

export default function FileManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">File Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="structured">Structured Folders</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents by name, patient, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {filterTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select value="all" onValueChange={() => {}}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Folders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Folders</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(doc.type)}
                      {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{doc.name}</h3>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="flex items-center gap-1">
                        <span>👤</span> {doc.patient}
                      </p>
                      <p className="flex items-center gap-1">
                        <span>📅</span> {doc.date}
                      </p>
                      <p>{doc.size}</p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {doc.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{doc.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-center gap-2 pt-2 border-t">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="structured">
          <div className="text-center py-12 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Structured folders view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
