// components/patient-detail/tabs/ClinicalNotesTab.tsx
import React, { useState } from "react";
import { ClinicalNotesList } from "../../clinical-notes/ClinicalNotesList";
import { ClinicalNotesModal } from "../../clinical-notes/ClinicalNotesModal";
import { ClinicalNoteViewModal } from "../../clinical-notes/ClinicalNoteViewModal";
import { NOTE_TEMPLATES } from "../../clinical-notes/DynamicFormRenderer";

// Define the ClinicalNote interface
interface ClinicalNote {
  id: number;
  patient_id: number;
  doctor_id: number;
  title: string;
  content: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
  signed_at?: string;
  doctor_name: string;
  note_type: string;
  providerType: string;
}

interface ClinicalNotesTabProps {
  patientData: any;
  setIsNewNoteOpen?: (open: boolean) => void;
}

// Mock data for clinical notes
const mockNotes: ClinicalNote[] = [
  {
    id: 1,
    patient_id: 101,
    doctor_id: 201,
    title: "Initial Psychiatric Evaluation - John Doe - 5/15/2023",
    content: {
      chief_complaint:
        "Patient presents with anxiety and depressive symptoms for the past 3 months.",
      history:
        "Symptoms began after job loss. Reports difficulty sleeping and loss of appetite.",
      appearance: "Well-groomed, cooperative, maintains eye contact",
      mood: "Dysphoric mood with congruent affect",
    },
    status: "signed",
    created_at: "2023-05-15T10:30:00Z",
    updated_at: "2023-05-15T11:45:00Z",
    signed_at: "2023-05-15T11:45:00Z",
    doctor_name: "Dr. Sarah Johnson",
    note_type: "Initial Evaluation",
    providerType: "physician",
  },
  {
    id: 2,
    patient_id: 101,
    doctor_id: 201,
    title: "Follow-up Note - John Doe - 5/22/2023",
    content: {
      chief_complaint:
        "Patient reports improvement in sleep patterns but mild anxiety in social situations.",
      observations: "Appears more relaxed, better eye contact",
      clinical_status:
        "Showing gradual improvement with current treatment plan",
      treatment_plan: "Continue current medication, schedule therapy sessions",
    },
    status: "draft",
    created_at: "2023-05-22T14:15:00Z",
    updated_at: "2023-05-22T14:45:00Z",
    doctor_name: "Dr. Sarah Johnson",
    note_type: "Follow-up",
    providerType: "physician",
  },
  {
    id: 3,
    patient_id: 101,
    doctor_id: 202,
    title: "Therapy Session Notes - John Doe - 5/20/2023",
    content: {
      subjective:
        "Focused on cognitive behavioral techniques for anxiety management",
      objective: "Patient practiced thought challenging exercises effectively",
      assessment: "Good engagement and understanding of techniques",
      plan: "Homework assigned: Daily mood tracking and relaxation techniques",
    },
    status: "signed",
    created_at: "2023-05-20T09:00:00Z",
    updated_at: "2023-05-20T09:45:00Z",
    signed_at: "2023-05-20T09:45:00Z",
    doctor_name: "Jennifer Lee, LCSW",
    note_type: "Therapy Session",
    providerType: "social work",
  },
];

// Mock user data
const mockUser = {
  id: 201,
  role: "doctor",
  name: "Dr. Sarah Johnson",
};

export function ClinicalNotesTab({
  patientData,
  setIsNewNoteOpen,
}: ClinicalNotesTabProps) {
  const [notes, setNotes] = useState<ClinicalNote[]>(mockNotes);
  const [user] = useState(mockUser);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [signing, setSigning] = useState(false);

  // Extract patient information from patientData
  const getPatientId = () => {
    const id =
      patientData?.personalInfo?.id ||
      patientData?.id ||
      patientData?.user_id ||
      patientData?.patient_id;
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

    return name;
  };

  const patientId = getPatientId();
  const patientName = getPatientName();

  // Permission checks
  const canCreate = user?.role === "doctor";

  const canEdit = (note: ClinicalNote) => {
    return note.status === "draft" && note.doctor_id === user?.id;
  };

  const canDelete = (note: ClinicalNote) => {
    return note.status === "draft" && note.doctor_id === user?.id;
  };

  const canSign = (note: ClinicalNote) => {
    return note.status === "draft" && note.doctor_id === user?.id;
  };

  // Event handlers
  const handleNewNoteClick = () => {
    setIsNewNoteModalOpen(true);
    if (setIsNewNoteOpen) {
      setIsNewNoteOpen(true);
    }
  };

  const handleViewNote = (note: ClinicalNote) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const handleEditNote = (note: ClinicalNote) => {
    handleViewNote(note);
  };

  const handleDeleteNote = (noteId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      setDeleting(true);
      // Simulate API call
      setTimeout(() => {
        setNotes(notes.filter((note) => note.id !== noteId));
        setDeleting(false);
      }, 500);
    }
  };

  const handleSignNote = (noteId: number) => {
    if (
      window.confirm(
        "Are you sure you want to sign this note? Once signed, it cannot be edited."
      )
    ) {
      setSigning(true);
      // Simulate API call
      setTimeout(() => {
        setNotes(
          notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  status: "signed",
                  signed_at: new Date().toISOString(),
                }
              : note
          )
        );
        setSigning(false);
      }, 500);
    }
  };

  const handleUnsignNote = (noteId: number) => {
    alert(
      "Unsign functionality is not yet implemented. Once signed, notes cannot be unsigned for regulatory compliance."
    );
  };

  const handleCloseNewNoteModal = (open: boolean) => {
    setIsNewNoteModalOpen(open);
  };

  const handleCloseViewModal = (open: boolean) => {
    setIsViewModalOpen(open);
    if (!open) {
      setSelectedNote(null);
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
