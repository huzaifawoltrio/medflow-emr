// components/patient-detail/tabs/ClinicalNotesTab.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Plus, AlertTriangle } from "lucide-react";
import { ClinicalNotesList } from "../../clinical-notes/ClinicalNotesList";
import { ClinicalNotesModal } from "../../clinical-notes/ClinicalNotesModal";
import { ClinicalNoteViewModal } from "../../clinical-notes/ClinicalNoteViewModal";
import { ClinicalNote } from "../../../app/redux/features/clinicalNotes/clinicalNotesActions";
import {
  clearSuccessStates,
  clearErrors,
} from "../../../app/redux/features/clinicalNotes/clinicalNotesSlice";
import {
  fetchPatientNotes,
  fetchNoteTypes,
  fetchNoteTemplates,
  signClinicalNote,
  deleteClinicalNote,
} from "../../../app/redux/features/clinicalNotes/clinicalNotesActions";
import { AppDispatch, RootState } from "../../../app/redux/store";

interface ClinicalNotesTabProps {
  patientData: any;
  setIsNewNoteOpen?: (open: boolean) => void;
}

export function ClinicalNotesTab({
  patientData,
  setIsNewNoteOpen,
}: ClinicalNotesTabProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    notes,
    noteTypes,
    templates,
    notesLoading,
    noteTypesLoading,
    templatesLoading,
    notesError,
    noteTypesError,
    templatesError,
    createSuccess,
    updateSuccess,
    signSuccess,
    deleteSuccess,
    amendSuccess,
    creating,
    deleting,
    signing,
    amending,
  } = useSelector((state: RootState) => state.clinicalNotes);

  // Local state
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);

  // Extract patient information from patientData with better error handling
  const getPatientId = () => {
    const id =
      patientData?.personalInfo?.id ||
      patientData?.id ||
      patientData?.user_id ||
      patientData?.patient_id;
    console.log("Extracted patient ID:", id, "from patientData:", patientData);
    return id || 1; // Fallback to 1 if not available
  };

  const getPatientName = () => {
    let name = "Unknown Patient";

    if (patientData?.personalInfo) {
      name = `${patientData.personalInfo.firstName || ""} ${
        patientData.personalInfo.lastName || ""
      }`.trim();
    } else if (patientData?.first_name && patientData?.last_name) {
      name = `${patientData.first_name} ${patientData.last_name}`;
    } else if (patientData?.name) {
      name = patientData.name;
    }

    console.log("Extracted patient name:", name);
    return name;
  };

  const patientId = getPatientId();
  const patientName = getPatientName();

  // Load initial data when component mounts
  useEffect(() => {
    console.log("ClinicalNotesTab mounted, loading data...");

    // Clear any previous errors and success states
    dispatch(clearErrors());
    dispatch(clearSuccessStates());

    // Load patient notes if we have a patient ID
    if (patientId) {
      console.log("Loading clinical notes for patient:", patientId);
      dispatch(fetchPatientNotes({ patientId }));
    }

    // Load note types and templates for filtering and creation
    console.log("Loading note types and templates...");
    dispatch(fetchNoteTypes());
    dispatch(fetchNoteTemplates());
  }, [dispatch, patientId]);

  // Handle success states
  useEffect(() => {
    if (createSuccess) {
      console.log("Clinical note created successfully");
      setIsNewNoteModalOpen(false);
      // Reload patient notes to get the latest list
      if (patientId) {
        dispatch(fetchPatientNotes({ patientId }));
      }
      // Clear success state after a delay
      setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
    }
  }, [createSuccess, dispatch, patientId]);

  useEffect(() => {
    if (updateSuccess) {
      console.log("Clinical note updated successfully");
      // Reload patient notes to get the updated list
      if (patientId) {
        dispatch(fetchPatientNotes({ patientId }));
      }
      // Clear success state after a delay
      setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
    }
  }, [updateSuccess, dispatch, patientId]);

  useEffect(() => {
    if (signSuccess) {
      console.log("Clinical note signed successfully");
      // Reload patient notes to get the updated list
      if (patientId) {
        dispatch(fetchPatientNotes({ patientId }));
      }
      // Clear success state after a delay
      setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
    }
  }, [signSuccess, dispatch, patientId]);

  useEffect(() => {
    if (deleteSuccess) {
      console.log("Clinical note deleted successfully");
      // Notes list will be automatically updated by the Redux store
      // Clear success state after a delay
      setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (amendSuccess) {
      console.log("Clinical note amendment created successfully");
      // Reload patient notes to get the updated list
      if (patientId) {
        dispatch(fetchPatientNotes({ patientId }));
      }
      // Clear success state after a delay
      setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
    }
  }, [amendSuccess, dispatch, patientId]);

  // Simplified permissions - just allow everything for authenticated users
  const canCreate = true;
  const canEdit = (note: ClinicalNote) => true;
  const canDelete = (note: ClinicalNote) => note.status === "draft";
  const canSign = (note: ClinicalNote) => note.status === "draft";

  // Event handlers
  const handleNewNoteClick = () => {
    console.log("Opening new note modal for patient:", patientId);
    setIsNewNoteModalOpen(true);
    // Also call the prop callback if provided (for backward compatibility)
    if (setIsNewNoteOpen) {
      setIsNewNoteOpen(true);
    }
  };

  const handleViewNote = (note: ClinicalNote) => {
    console.log("Opening note view modal for note:", note.id, note);
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const handleEditNote = (note: ClinicalNote) => {
    // For now, we'll just view the note. You can implement edit functionality later
    console.log(
      "Edit functionality not yet implemented, viewing note instead:",
      note.id
    );
    handleViewNote(note);
  };

  const handleDeleteNote = async (noteId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      console.log("Deleting note:", noteId);
      try {
        await dispatch(deleteClinicalNote(noteId)).unwrap();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleSignNote = async (noteId: number) => {
    if (
      window.confirm(
        "Are you sure you want to sign this note? Once signed, it cannot be edited."
      )
    ) {
      console.log("Signing note:", noteId);
      try {
        await dispatch(signClinicalNote(noteId)).unwrap();
      } catch (error) {
        console.error("Error signing note:", error);
      }
    }
  };

  const handleUnsignNote = async (noteId: number) => {
    // This functionality would need to be implemented in the backend
    console.log("Unsign functionality not yet implemented for note:", noteId);
    alert(
      "Unsign functionality is not yet implemented. Once signed, notes cannot be unsigned for regulatory compliance."
    );
  };

  const handleCloseNewNoteModal = (open: boolean) => {
    console.log("New note modal state changed:", open);
    setIsNewNoteModalOpen(open);
    if (!open) {
      dispatch(clearErrors());
    }
  };

  const handleCloseViewModal = (open: boolean) => {
    console.log("View note modal state changed:", open);
    setIsViewModalOpen(open);
    if (!open) {
      setSelectedNote(null);
      dispatch(clearErrors());
    }
  };

  // Error state
  const hasErrors = notesError || noteTypesError || templatesError;

  // Loading states
  const isInitialLoading =
    (notesLoading && notes.length === 0) ||
    (noteTypesLoading && noteTypes.length === 0) ||
    (templatesLoading && templates.length === 0);

  // Show loading state for initial load
  if (isInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg">Loading clinical notes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (hasErrors) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {notesError && <div>Notes: {notesError}</div>}
                {noteTypesError && <div>Note Types: {noteTypesError}</div>}
                {templatesError && <div>Templates: {templatesError}</div>}
              </div>
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button
              onClick={() => {
                dispatch(clearErrors());
                dispatch(fetchPatientNotes({ patientId }));
                dispatch(fetchNoteTypes());
                dispatch(fetchNoteTemplates());
              }}
              className="mt-4"
            >
              Retry Loading
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show success messages
  const successMessages = [];
  if (createSuccess) successMessages.push("Note created successfully!");
  if (updateSuccess) successMessages.push("Note updated successfully!");
  if (signSuccess) successMessages.push("Note signed successfully!");
  if (deleteSuccess) successMessages.push("Note deleted successfully!");
  if (amendSuccess) successMessages.push("Amendment added successfully!");

  return (
    <div className="space-y-6">
      {/* Success Messages */}
      {successMessages.map((message, index) => (
        <Alert key={index} className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Patient Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Clinical Notes for {patientName}
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              Patient ID: {patientId}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Total Notes: {notes.length} | Note Types Available:{" "}
            {noteTypes.length} | Templates Available: {templates.length}
          </div>
        </CardContent>
      </Card>

      {/* Main Notes List */}
      <Card>
        <CardContent className="p-6">
          <ClinicalNotesList
            notes={notes}
            onView={handleViewNote}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onSign={handleSignNote}
            onUnsign={handleUnsignNote}
            setIsModalOpen={handleNewNoteClick}
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
            canSign={canSign}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ClinicalNotesModal
        isOpen={isNewNoteModalOpen}
        onOpenChange={handleCloseNewNoteModal}
        patientId={patientId}
        patientName={patientName}
      />

      {selectedNote && (
        <ClinicalNoteViewModal
          isOpen={isViewModalOpen}
          onOpenChange={handleCloseViewModal}
          note={selectedNote}
          patientName={patientName}
        />
      )}
    </div>
  );
}
