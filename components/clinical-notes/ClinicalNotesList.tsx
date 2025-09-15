"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Loader2,
  User,
  Calendar,
} from "lucide-react";

// Define the ClinicalNote interface
interface ClinicalNote {
  id: number;
  patient_id: number;
  doctor_id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  signed_at?: string;
  doctor_name: string;
  note_type: string;
  providerType: string;
}

interface ClinicalNotesListProps {
  notes: ClinicalNote[];
  onView: (note: ClinicalNote) => void;
  onEdit: (note: ClinicalNote) => void;
  onDelete: (noteId: number) => void;
  onSign: (noteId: number) => void;
  onUnsign: (noteId: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  canCreate: boolean;
  canEdit: (note: ClinicalNote) => boolean;
  canDelete: (note: ClinicalNote) => boolean;
  canSign: (note: ClinicalNote) => boolean;
}

// Note Card Component
const NoteCard = ({
  note,
  onView,
  onEdit,
  onDelete,
  onSign,
  onUnsign,
  canEdit,
  canDelete,
  canSign,
  signing,
  deleting,
}: {
  note: ClinicalNote;
  onView: (note: ClinicalNote) => void;
  onEdit: (note: ClinicalNote) => void;
  onDelete: (noteId: number) => void;
  onSign: (noteId: number) => void;
  onUnsign: (noteId: number) => void;
  canEdit: (note: ClinicalNote) => boolean;
  canDelete: (note: ClinicalNote) => boolean;
  canSign: (note: ClinicalNote) => boolean;
  signing: boolean;
  deleting: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Lock className="mr-1 h-3 w-3" />
            Signed
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="border-yellow-400 text-yellow-600"
          >
            Draft
          </Badge>
        );
      case "amended":
        return (
          <Badge
            variant="outline"
            className="border-orange-400 text-orange-600"
          >
            Amended
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getNoteTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      "Initial Psychiatric Evaluation": "Psych Eval",
      "Follow-up Note": "Follow-up",
      "Biopsychosocial Assessment": "Bio-Psycho",
      "Risk Assessment": "Risk",
      "Treatment Plan": "Treatment",
      "Group Therapy Session": "Group",
    };

    const badgeText = typeMap[type] || type;
    return (
      <Badge variant="secondary" className="text-xs">
        {badgeText}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getContentPreview = (content: string) => {
    if (!content) return "No content available";

    // Simple content preview - in a real app, you might want to parse the structured content
    const text = content.toString();
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const previewLines = lines.slice(0, 3);
    return previewLines.join(" ") || "No content available";
  };

  return (
    <div className="border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {note.title || "Untitled Note"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {getNoteTypeBadge(note.note_type)}
              {getStatusBadge(note.status)}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center mr-4">
            <User className="h-4 w-4 mr-1" />
            <span className="truncate">{note.doctor_name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(note.created_at)}</span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm line-clamp-3">
            {getContentPreview(note.content)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(note)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Full Note
          </Button>

          <div className="flex gap-1">
            {canEdit(note) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(note)}
                title="Edit Note"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {canSign(note) ? (
              note.status === "signed" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUnsign(note.id)}
                  title="Unsign Note"
                  disabled={signing}
                >
                  <Unlock className="h-4 w-4 text-orange-500" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSign(note.id)}
                  title="Sign Note"
                  disabled={signing}
                >
                  <Lock className="h-4 w-4 text-green-500" />
                </Button>
              )
            ) : null}

            {canDelete(note) && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDelete(note.id)}
                title="Delete Note"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ClinicalNotesList({
  notes = [],
  onView,
  onEdit,
  onDelete,
  onSign,
  onUnsign,
  setIsModalOpen,
  canCreate,
  canEdit,
  canDelete,
  canSign,
}: ClinicalNotesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [signing, setSigning] = useState(false);

  // Predefined note types from NOTE_TEMPLATES
  const noteTypes = [
    "Initial Psychiatric Evaluation",
    "Follow-up Note",
    "Biopsychosocial Assessment",
    "Risk Assessment",
    "Treatment Plan",
    "Therapy Session",
  ];

  // Get shortened labels for the buttons - updated to handle actual data
  const getTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      "Initial Psychiatric Evaluation": "Initial Eval",
      "Follow-up Note": "Follow-up",
      "Biopsychosocial Assessment": "Biopsychosocial",
      "Risk Assessment": "Risk",
      "Treatment Plan": "Treatment",
      "Therapy Session": "Therapy",
      "Therapy Session Notes": "Therapy", // Handle variations
      "Initial Evaluation": "Initial Eval", // Handle variations
      "Follow-up": "Follow-up", // Handle variations
    };
    return labelMap[type] || type;
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        note.title?.toLowerCase().includes(searchLower) ||
        note.note_type?.toLowerCase().includes(searchLower) ||
        (typeof note.content === "string" &&
          note.content.toLowerCase().includes(searchLower));

      const matchesType = filterType === "all" || note.note_type === filterType;
      const matchesStatus =
        filterStatus === "all" || note.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notes, searchTerm, filterType, filterStatus]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button
              className="bg-blue-950"
              onClick={() => setIsModalOpen(true)}
              disabled
            >
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-lg">Loading clinical notes...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Error loading clinical notes: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {canCreate && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>
      </div>

      {/* Note Type Filter Buttons */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className={`text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            All Types
          </Button>
          {noteTypes.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className={`text-xs font-medium transition-colors ${
                filterType === type
                  ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {getTypeLabel(type)}
            </Button>
          ))}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium mr-2">
            Status:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              All Statuses
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("draft")}
              className={`text-xs font-medium transition-colors ${
                filterStatus === "draft"
                  ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Draft
            </Button>
            <Button
              variant={filterStatus === "signed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("signed")}
              className={`text-xs font-medium transition-colors ${
                filterStatus === "signed"
                  ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Signed
            </Button>
            <Button
              variant={filterStatus === "amended" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("amended")}
              className={`text-xs font-medium transition-colors ${
                filterStatus === "amended"
                  ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Amended
            </Button>
          </div>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onSign={onSign}
              onUnsign={onUnsign}
              canEdit={canEdit}
              canDelete={canDelete}
              canSign={canSign}
              signing={signing}
              deleting={deleting}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "No matching notes found"
              : "No clinical notes yet"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first clinical note"}
          </p>

          {searchTerm || filterType !== "all" || filterStatus !== "all" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            canCreate && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-700 hover:bg-blue-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Note
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
