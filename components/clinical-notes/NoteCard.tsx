// src/components/clinical-notes/NoteCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { ClinicalNote } from "@/app/redux/features/clinicalNotes/clinicalNotesActions";
import { Loader2, User, Calendar } from "lucide-react";

interface NoteCardProps {
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
}

export const NoteCard = ({
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
}: NoteCardProps) => {
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
      "Progress Note": "Progress",
      "Biopsychosocial Assessment": "Bio-Psycho",
      "Risk Assessment": "Risk",
      "Treatment Plan": "Treatment",
      "Therapy Session Note": "Therapy",
      "Case Management Note": "Case Mgmt",
      "Discharge Summary": "Discharge",
      "Medication Review": "Med Review",
      "Crisis Intervention Note": "Crisis",
      "Consultation Note": "Consult",
      "Follow-up Note": "Follow-up",
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

  const getContentPreview = (content: any) => {
    if (!content) return "No content available";

    if (typeof content === "object") {
      const extractTextFromObject = (obj: any): string => {
        if (typeof obj === "string") return obj;
        if (Array.isArray(obj)) return obj.map(extractTextFromObject).join(" ");
        if (typeof obj === "object" && obj !== null) {
          return Object.values(obj).map(extractTextFromObject).join(" ");
        }
        return "";
      };

      const text = extractTextFromObject(content);
      return text.slice(0, 150) + (text.length > 150 ? "..." : "");
    }

    const text = content.toString();
    const cleanText = text.replace(/\s+/g, " ").trim();
    return cleanText.slice(0, 150) + (cleanText.length > 150 ? "..." : "");
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
              {getNoteTypeBadge(note.note_type_name || "")}
              {getStatusBadge(note.status)}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(note.created_at)}</span>
          </div>
        </div>

        {/* Template Info */}
        {note.template_name && (
          <div className="mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {note.template_name}
            </span>
          </div>
        )}

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
