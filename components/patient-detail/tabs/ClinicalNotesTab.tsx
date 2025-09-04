// components/patient-detail/tabs/ClinicalNotesTab.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    notesLoading,
    createSuccess,
    updateSuccess,
    signSuccess,
    deleteSuccess,
    amendSuccess,
  } = useSelector((state: RootState) => state.clinicalNotes);

  const { user } = useSelector((state: RootState) => state.auth);

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

  // Load patient notes when component mounts
  useEffect(() => {
    if (patientId) {
      console.log("Loading clinical notes for patient:", patientId);
      dispatch(fetchPatientNotes({ patientId }));
    }
  }, [dispatch, patientId]);

  // Clear success states when component mounts
  useEffect(() => {
    dispatch(clearErrors());
    dispatch(clearSuccessStates());
  }, [dispatch]);

  // Handle success states
  useEffect(() => {
    if (createSuccess) {
      console.log("Clinical note created successfully");
      setIsNewNoteModalOpen(false);
      // Reload patient notes to get the latest list
      dispatch(fetchPatientNotes({ patientId }));
      dispatch(clearSuccessStates());
    }
  }, [createSuccess, dispatch, patientId]);

  useEffect(() => {
    if (updateSuccess) {
      console.log("Clinical note updated successfully");
      // Reload patient notes to get the updated list
      dispatch(fetchPatientNotes({ patientId }));
      dispatch(clearSuccessStates());
    }
  }, [updateSuccess, dispatch, patientId]);

  useEffect(() => {
    if (signSuccess) {
      console.log("Clinical note signed successfully");
      // Reload patient notes to get the updated list
      dispatch(fetchPatientNotes({ patientId }));
      dispatch(clearSuccessStates());
    }
  }, [signSuccess, dispatch, patientId]);

  useEffect(() => {
    if (deleteSuccess) {
      console.log("Clinical note deleted successfully");
      // Notes list will be automatically updated by the Redux store
      dispatch(clearSuccessStates());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (amendSuccess) {
      console.log("Clinical note amendment created successfully");
      // Reload patient notes to get the updated list
      dispatch(fetchPatientNotes({ patientId }));
      dispatch(clearSuccessStates());
    }
  }, [amendSuccess, dispatch, patientId]);

  // Permission checks - simplified for now, you can make these more sophisticated
  const canCreate = user?.role === "doctor";

  const canEdit = (note: ClinicalNote) => {
    // Can edit if it's a draft and belongs to current doctor
    return note.status === "draft" && note.doctor_id === user?.id;
  };

  const canDelete = (note: ClinicalNote) => {
    // Can delete if it's a draft and belongs to current doctor
    return note.status === "draft" && note.doctor_id === user?.id;
  };

  const canSign = (note: ClinicalNote) => {
    // Can sign if it's a draft and belongs to current doctor
    return note.status === "draft" && note.doctor_id === user?.id;
  };

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

  return (
    <>
      <ClinicalNotesList
        notes={notes}
        onView={handleViewNote}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onSign={handleSignNote}
        onUnsign={handleUnsignNote}
        setIsModalOpen={setIsNewNoteModalOpen}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        canSign={canSign}
      />

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
        />
      )}
    </>
  );
}
