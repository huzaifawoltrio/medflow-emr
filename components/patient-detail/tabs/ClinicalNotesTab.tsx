// components/patient-detail/tabs/ClinicalNotesTab.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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

  // Use ref to track if initial load has been done
  const initialLoadDone = useRef(false);
  const lastPatientId = useRef<number | null>(null);

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
  const getPatientId = useCallback(() => {
    const id =
      patientData?.personalInfo?.id ||
      patientData?.id ||
      patientData?.user_id ||
      patientData?.patient_id;
    console.log("Extracted patient ID:", id, "from patientData:", patientData);
    return id || 1; // Fallback to 1 if not available
  }, [patientData]);

  const getPatientName = useCallback(() => {
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
  }, [patientData]);

  const patientId = getPatientId();
  const patientName = getPatientName();

  // REMOVED: The duplicate API calls for note types and templates
  // These will be loaded by the ClinicalNotesList component instead
  // No longer loading note types and templates here to avoid duplicates

  // Load patient notes only when patient ID changes
  useEffect(() => {
    if (patientId && patientId !== lastPatientId.current) {
      console.log("Patient ID changed, loading notes for patient:", patientId);
      lastPatientId.current = patientId;

      // Clear any previous errors and success states
      dispatch(clearErrors());
      dispatch(clearSuccessStates());

      dispatch(fetchPatientNotes({ patientId }));
    }
  }, [dispatch, patientId]);

  // Handle success states - reload notes only when necessary
  useEffect(() => {
    if (createSuccess) {
      console.log("Clinical note created successfully");
      setIsNewNoteModalOpen(false);
      // Note is already added to the store by the reducer, no need to reload
      // Clear success state after a delay
      const timeout = setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [createSuccess, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      console.log("Clinical note updated successfully");
      // Note is already updated in the store by the reducer, no need to reload
      // Clear success state after a delay
      const timeout = setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (signSuccess) {
      console.log("Clinical note signed successfully");
      // Note is already updated in the store by the reducer, no need to reload
      // Clear success state after a delay
      const timeout = setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [signSuccess, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      console.log("Clinical note deleted successfully");
      // Note is already removed from the store by the reducer, no need to reload
      // Clear success state after a delay
      const timeout = setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (amendSuccess) {
      console.log("Clinical note amendment created successfully");
      // For amendments, we might want to reload to get the updated note status
      if (patientId && patientId === lastPatientId.current) {
        dispatch(fetchPatientNotes({ patientId }));
      }
      // Clear success state after a delay
      const timeout = setTimeout(() => {
        dispatch(clearSuccessStates());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [amendSuccess, dispatch, patientId]);

  // Simplified permissions - just allow everything for authenticated users
  const canCreate = true;
  const canEdit = (note: ClinicalNote) => true;
  const canDelete = (note: ClinicalNote) => note.status === "draft";
  const canSign = (note: ClinicalNote) => note.status === "draft";

  // Event handlers
  const handleNewNoteClick = useCallback(() => {
    console.log("Opening new note modal for patient:", patientId);
    setIsNewNoteModalOpen(true);
    // Also call the prop callback if provided (for backward compatibility)
    if (setIsNewNoteOpen) {
      setIsNewNoteOpen(true);
    }
  }, [patientId, setIsNewNoteOpen]);

  const handleViewNote = useCallback((note: ClinicalNote) => {
    console.log("Opening note view modal for note:", note.id, note);
    setSelectedNote(note);
    setIsViewModalOpen(true);
  }, []);

  const handleEditNote = useCallback(
    (note: ClinicalNote) => {
      // For now, we'll just view the note. You can implement edit functionality later
      console.log(
        "Edit functionality not yet implemented, viewing note instead:",
        note.id
      );
      handleViewNote(note);
    },
    [handleViewNote]
  );

  const handleDeleteNote = useCallback(
    async (noteId: number) => {
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
    },
    [dispatch]
  );

  const handleSignNote = useCallback(
    async (noteId: number) => {
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
    },
    [dispatch]
  );

  const handleUnsignNote = useCallback(async (noteId: number) => {
    // This functionality would need to be implemented in the backend
    console.log("Unsign functionality not yet implemented for note:", noteId);
    alert(
      "Unsign functionality is not yet implemented. Once signed, notes cannot be unsigned for regulatory compliance."
    );
  }, []);

  const handleCloseNewNoteModal = useCallback(
    (open: boolean) => {
      console.log("New note modal state changed:", open);
      setIsNewNoteModalOpen(open);
      if (!open) {
        dispatch(clearErrors());
      }
    },
    [dispatch]
  );

  const handleCloseViewModal = useCallback(
    (open: boolean) => {
      console.log("View note modal state changed:", open);
      setIsViewModalOpen(open);
      if (!open) {
        setSelectedNote(null);
        dispatch(clearErrors());
      }
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(clearErrors());
    if (patientId) {
      dispatch(fetchPatientNotes({ patientId }));
    }
    // Let ClinicalNotesList handle note types and templates loading
  }, [dispatch, patientId]);

  // Error state - only for notes loading since note types/templates are handled by ClinicalNotesList
  const hasErrors = notesError;

  // Loading states - only for notes since note types/templates are handled by ClinicalNotesList
  const isInitialLoading = notesLoading && notes.length === 0;

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
              </div>
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={handleRetry} className="mt-4">
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
