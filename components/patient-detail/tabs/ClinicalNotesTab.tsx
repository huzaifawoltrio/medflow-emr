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
    createSuccess,
    updateSuccess,
    signSuccess,
    deleteSuccess,
    amendSuccess,
  } = useSelector((state: RootState) => state.clinicalNotes);

  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);

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
      dispatch(clearSuccessStates());
    }
  }, [createSuccess, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      console.log("Clinical note updated successfully");
      dispatch(clearSuccessStates());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (signSuccess) {
      console.log("Clinical note signed successfully");
      dispatch(clearSuccessStates());
    }
  }, [signSuccess, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      console.log("Clinical note deleted successfully");
      dispatch(clearSuccessStates());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (amendSuccess) {
      console.log("Clinical note amendment created successfully");
      dispatch(clearSuccessStates());
    }
  }, [amendSuccess, dispatch]);

  const handleNewNoteClick = () => {
    console.log("Opening new note modal for patient:", getPatientId());
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

  return (
    <>
      <ClinicalNotesList
        patientId={patientId}
        onNewNoteClick={handleNewNoteClick}
        onViewNote={handleViewNote}
        onEditNote={handleEditNote}
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
