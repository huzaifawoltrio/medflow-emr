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
  fetchNoteAmendments,
  signClinicalNote,
  deleteClinicalNote,
} from "../../../app/redux/features/clinicalNotes/clinicalNotesActions";
import { AppDispatch, RootState } from "../../../app/redux/store";
import { ToastService } from "@/services/toastService";

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
    deleting,
    signing,
  } = useSelector((state: RootState) => state.clinicalNotes);

  // Local state
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);

  const getPatientId = useCallback(() => {
    return (
      patientData?.personalInfo?.id ||
      patientData?.id ||
      patientData?.user_id ||
      patientData?.patient_id
    );
  }, [patientData]);

  const getPatientName = useCallback(() => {
    if (patientData?.personalInfo) {
      return `${patientData.personalInfo.firstName || ""} ${
        patientData.personalInfo.lastName || ""
      }`.trim();
    }
    if (patientData?.first_name && patientData?.last_name) {
      return `${patientData.first_name} ${patientData.last_name}`;
    }
    return patientData?.name || "Unknown Patient";
  }, [patientData]);

  const patientId = getPatientId();
  const patientName = getPatientName();

  // Load patient notes when patient ID changes
  useEffect(() => {
    if (patientId && patientId !== lastPatientId.current) {
      lastPatientId.current = patientId;
      dispatch(clearErrors());
      dispatch(clearSuccessStates());
      dispatch(fetchPatientNotes({ patientId }));
    }
  }, [dispatch, patientId]);

  // --- SOLUTION: Centralized Toast Notifications ---
  // This section handles all success and error toasts for consistency.
  useEffect(() => {
    if (createSuccess) {
      ToastService.success("Clinical note created successfully!");
      setIsNewNoteModalOpen(false); // Close modal on success
      dispatch(clearSuccessStates());
    }
    if (updateSuccess) {
      ToastService.success("Clinical note updated successfully!");
      dispatch(clearSuccessStates());
    }
    if (signSuccess) {
      ToastService.success("Clinical note signed successfully!");
      setIsViewModalOpen(false); // Close view modal if signing from there
      dispatch(clearSuccessStates());
    }
    if (deleteSuccess) {
      ToastService.success("Clinical note deleted successfully!");
      dispatch(clearSuccessStates());
    }
    if (amendSuccess) {
      ToastService.success("Amendment added successfully!");
      dispatch(clearSuccessStates());
      // Optionally reload amendments if view modal is open
      if (isViewModalOpen && selectedNote) {
        dispatch(fetchNoteAmendments(selectedNote.id));
      }
    }
  }, [
    createSuccess,
    updateSuccess,
    signSuccess,
    deleteSuccess,
    amendSuccess,
    dispatch,
    isViewModalOpen,
    selectedNote,
  ]);

  useEffect(() => {
    const anyError = notesError || noteTypesError || templatesError;
    if (anyError) {
      ToastService.error(`Error: ${anyError}`);
      dispatch(clearErrors());
    }
  }, [notesError, noteTypesError, templatesError, dispatch]);
  // --- END SOLUTION ---

  // Simplified permissions for demonstration
  const canCreate = true;
  const canEdit = (note: ClinicalNote) => note.status === "draft";
  const canDelete = (note: ClinicalNote) => note.status === "draft";
  const canSign = (note: ClinicalNote) => note.status === "draft";

  // Event handlers
  const handleNewNoteClick = useCallback(() => {
    setIsNewNoteModalOpen(true);
    if (setIsNewNoteOpen) setIsNewNoteOpen(true);
  }, [setIsNewNoteOpen]);

  const handleViewNote = useCallback((note: ClinicalNote) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  }, []);

  const handleEditNote = useCallback(
    (note: ClinicalNote) => {
      if (canEdit(note)) {
        // Implement edit modal logic here
        ToastService.error("Edit functionality is not yet implemented.");
        handleViewNote(note); // Fallback to view
      } else {
        ToastService.error("Signed notes cannot be edited.");
      }
    },
    [handleViewNote]
  );

  const handleDeleteNote = useCallback(
    async (noteId: number) => {
      if (window.confirm("Are you sure you want to delete this draft?")) {
        const toastId = ToastService.loading("Deleting note...");
        try {
          await dispatch(deleteClinicalNote(noteId)).unwrap();
          ToastService.dismiss(toastId);
          // Success is handled by the central useEffect
        } catch (err: any) {
          ToastService.dismiss(toastId);
          ToastService.error(err.message || "Failed to delete note.");
        }
      }
    },
    [dispatch]
  );

  const handleSignNote = useCallback(
    async (noteId: number) => {
      if (window.confirm("Sign this note? This action cannot be undone.")) {
        const toastId = ToastService.loading("Signing note...");
        try {
          await dispatch(signClinicalNote(noteId)).unwrap();
          ToastService.dismiss(toastId);
          // Success is handled by the central useEffect
        } catch (err: any) {
          ToastService.dismiss(toastId);
          ToastService.error(err.message || "Failed to sign note.");
        }
      }
    },
    [dispatch]
  );

  const handleUnsignNote = useCallback(async (noteId: number) => {
    ToastService.error(
      "Unsigning is not permitted for compliance reasons. Please add an amendment instead."
    );
  }, []);

  const handleCloseNewNoteModal = useCallback((open: boolean) => {
    setIsNewNoteModalOpen(open);
  }, []);

  const handleCloseViewModal = useCallback((open: boolean) => {
    setIsViewModalOpen(open);
    if (!open) setSelectedNote(null);
  }, []);

  // Show loading skeleton on initial data fetch
  if (notesLoading && notes.length === 0) {
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
            <span>Loading clinical notes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
            signing={signing}
            deleting={deleting}
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
