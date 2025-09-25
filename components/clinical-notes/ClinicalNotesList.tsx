"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Search, Plus, Loader2 } from "lucide-react";
import {
  ClinicalNote,
  fetchNoteTypes,
  fetchNoteTemplates,
} from "@/app/redux/features/clinicalNotes/clinicalNotesActions";
import { AppDispatch, RootState } from "@/app/redux/store";
import { NoteCard } from "./NoteCard";

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
  const dispatch = useDispatch<AppDispatch>();
  const {
    noteTypes,
    templates,
    notesLoading,
    notesError,
    deleting,
    signing,
    noteTypesLoading,
    templatesLoading,
  } = useSelector((state: RootState) => state.clinicalNotes);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterNoteTypeId, setFilterNoteTypeId] = useState<string>("all");
  const [filterTemplateId, setFilterTemplateId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Use refs to track if we've already loaded the data to prevent infinite loops
  const noteTypesLoaded = useRef(false);
  const templatesLoaded = useRef(false);

  // Load note types and templates only once on mount - FIXED
  useEffect(() => {
    // Only dispatch if we haven't loaded and aren't currently loading
    if (
      !noteTypesLoaded.current &&
      noteTypes.length === 0 &&
      !noteTypesLoading
    ) {
      console.log("Loading note types for the first time");
      noteTypesLoaded.current = true;
      dispatch(fetchNoteTypes());
    }
  }, [dispatch, noteTypes.length, noteTypesLoading]);

  useEffect(() => {
    // Only dispatch if we haven't loaded and aren't currently loading
    if (
      !templatesLoaded.current &&
      templates.length === 0 &&
      !templatesLoading
    ) {
      console.log("Loading templates for the first time");
      templatesLoaded.current = true;
      dispatch(fetchNoteTemplates());
    }
  }, [dispatch, templates.length, templatesLoading]);

  // Get shortened labels for the filter buttons
  const getTypeLabel = (type: any) => {
    if (!type || !type.name) return "";

    const labelMap: Record<string, string> = {
      "Initial Psychiatric Evaluation": "Initial Eval",
      "Progress Note": "Progress",
      "Biopsychosocial Assessment": "Biopsychosocial",
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
    return labelMap[type.name] || type.name;
  };

  console.log("the notes are", notes);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        note.title?.toLowerCase().includes(searchLower) ||
        note.note_type_name?.toLowerCase().includes(searchLower) ||
        note.template_name?.toLowerCase().includes(searchLower);

      const matchesNoteType =
        filterNoteTypeId === "all" ||
        note.note_type_id?.toString() === filterNoteTypeId;

      const matchesTemplate =
        filterTemplateId === "all" ||
        note.template_id?.toString() === filterTemplateId;

      const matchesStatus =
        filterStatus === "all" || note.status === filterStatus;

      return (
        matchesSearch && matchesNoteType && matchesTemplate && matchesStatus
      );
    });
  }, [notes, searchTerm, filterNoteTypeId, filterTemplateId, filterStatus]);

  // Show loading state
  if (notesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button
              className="bg-blue-700 hover:bg-blue-800"
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
  if (notesError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Clinical Notes</h2>
          {canCreate && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
          )}
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Error loading clinical notes: {notesError}
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
            variant={filterNoteTypeId === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterNoteTypeId("all")}
            className={`text-xs font-medium transition-colors ${
              filterNoteTypeId === "all"
                ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            All Types
          </Button>
          {noteTypes.map((type) => (
            <Button
              key={type.id}
              variant={
                filterNoteTypeId === type.id.toString() ? "default" : "outline"
              }
              size="sm"
              onClick={() => setFilterNoteTypeId(type.id.toString())}
              className={`text-xs font-medium transition-colors ${
                filterNoteTypeId === type.id.toString()
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
            {searchTerm ||
            filterNoteTypeId !== "all" ||
            filterTemplateId !== "all" ||
            filterStatus !== "all"
              ? "No matching notes found"
              : "No clinical notes yet"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchTerm ||
            filterNoteTypeId !== "all" ||
            filterTemplateId !== "all" ||
            filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first clinical note"}
          </p>

          {searchTerm ||
          filterNoteTypeId !== "all" ||
          filterTemplateId !== "all" ||
          filterStatus !== "all" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterNoteTypeId("all");
                setFilterTemplateId("all");
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
