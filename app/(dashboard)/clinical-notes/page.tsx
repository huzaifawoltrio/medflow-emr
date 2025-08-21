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
import { Search, Plus, FileText, Calendar, User } from "lucide-react";

const noteTemplates = [
  { id: "initial", name: "Initial Assessment", icon: FileText },
  { id: "progress", name: "Progress Note", icon: FileText },
  { id: "therapy", name: "Therapy Session", icon: FileText },
  { id: "medication", name: "Medication Review", icon: FileText },
  { id: "discharge", name: "Discharge Summary", icon: FileText },
  { id: "custom", name: "Custom Template", icon: Plus },
];

const sampleNotes = [
  {
    id: 1,
    patientName: "John Doe",
    patientId: "P001",
    date: "8/12/2024",
    type: "Follow-up",
    status: "completed",
    content:
      "Patient reports improved mood and sleep patterns. Continue current medication regimen.",
    billingCodes: ["99213", "90834"],
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    patientId: "P002",
    date: "8/11/2024",
    type: "Initial Assessment",
    status: "draft",
    content:
      "New patient presenting with anxiety symptoms. Comprehensive evaluation completed.",
    billingCodes: ["99204", "90791"],
  },
];

export default function ClinicalNotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    patientName: "",
    patientId: "",
    type: "",
    content: "",
    billingCodes: "",
    status: "draft",
  });

  const filteredNotes = sampleNotes.filter((note) => {
    const matchesSearch =
      note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      note.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || note.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateNote = () => {
    // Logic to create a new note
    setIsNewNoteOpen(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    // Logic to apply a template
    setIsNewNoteOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Clinical Notes
          </h1>
          <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Clinical Note</DialogTitle>
                <DialogDescription>
                  Document patient encounter and clinical findings.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      value={newNote.patientName}
                      onChange={(e) =>
                        setNewNote({ ...newNote, patientName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="P001"
                      value={newNote.patientId}
                      onChange={(e) =>
                        setNewNote({ ...newNote, patientId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Note Type</Label>
                  <Select
                    value={newNote.type}
                    onValueChange={(value) =>
                      setNewNote({ ...newNote, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initial Assessment">
                        Initial Assessment
                      </SelectItem>
                      <SelectItem value="Progress Note">
                        Progress Note
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Clinical Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter clinical notes..."
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCodes">Billing Codes</Label>
                  <Input
                    id="billingCodes"
                    placeholder="99213, 90834 (comma separated)"
                    value={newNote.billingCodes}
                    onChange={(e) =>
                      setNewNote({ ...newNote, billingCodes: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newNote.status}
                    onValueChange={(value) =>
                      setNewNote({
                        ...newNote,
                        status: value as "draft" | "completed",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewNoteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial">Initial</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="hover:shadow-md transition-shadow rounded-xl"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {note.patientName}{" "}
                          <span className="text-sm text-gray-500">
                            ({note.patientId})
                          </span>
                        </p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {note.date}
                          </span>
                          <span className="text-blue-600 font-medium">
                            {note.type}
                          </span>
                          <Badge
                            className={
                              note.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {note.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                      {note.content}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        Billing Codes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {note.billingCodes.map((code) => (
                          <Badge
                            key={code}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end md:self-start shrink-0">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      Sign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note Templates */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Note Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {noteTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 text-center hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <template.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{template.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
