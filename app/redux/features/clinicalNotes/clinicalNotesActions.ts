// redux/features/clinicalNotes/clinicalNotesActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define interfaces based on your backend models
export interface NoteTemplate {
  id: number;
  name: string;
  description: string;
  note_type: string;
  schema: {
    sections: Array<{
      title: string;
      fields: Array<{
        name: string;
        label: string;
        type: "text" | "textarea" | "number" | "date" | "object" | "select";
        required?: boolean;
        placeholder?: string;
        rows?: number;
        fields?: Array<{
          name: string;
          label: string;
          type: string;
          placeholder?: string;
        }>;
        options?: Array<{
          value: string;
          label: string;
        }>;
      }>;
    }>;
  };
  version: string;
  specialty: string | null;
  created_at: string;
}

export interface ClinicalNote {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  template_id: number;
  title: string;
  note_type: string;
  content: Record<string, any>;
  status: "draft" | "signed" | "amended";
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  signed_at: string | null;
  template_name: string | null;
}

export interface CreateNoteData {
  patient_id: number;
  template_id: number;
  title: string;
  content: Record<string, any>;
  appointment_id?: number;
}

export interface NoteAmendment {
  id: number;
  amendment_text: string;
  reason: string;
  amended_by: number;
  created_at: string;
}

/**
 * Fetch all note templates
 */
export const fetchNoteTemplates = createAsyncThunk<
  NoteTemplate[],
  void,
  { rejectValue: string }
>("clinicalNotes/fetchTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/clinical-notes/templates");
    return response.data.templates;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to fetch templates");
  }
});

/**
 * Fetch a specific note template by ID
 */
export const fetchNoteTemplate = createAsyncThunk<
  NoteTemplate,
  number,
  { rejectValue: string }
>("clinicalNotes/fetchTemplate", async (templateId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/clinical-notes/templates/${templateId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to fetch template");
  }
});

/**
 * Create a new clinical note
 */
export const createClinicalNote = createAsyncThunk<
  ClinicalNote,
  CreateNoteData,
  { rejectValue: string }
>("clinicalNotes/create", async (noteData, { rejectWithValue }) => {
  try {
    const response = await api.post("/clinical-notes", noteData);
    return response.data.note;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to create note");
  }
});

/**
 * Update an existing clinical note
 */
export const updateClinicalNote = createAsyncThunk<
  ClinicalNote,
  { noteId: number; data: Partial<CreateNoteData> },
  { rejectValue: string }
>("clinicalNotes/update", async ({ noteId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/clinical-notes/${noteId}`, data);
    return response.data.note;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to update note");
  }
});

/**
 * Sign a clinical note
 */
export const signClinicalNote = createAsyncThunk<
  ClinicalNote,
  number,
  { rejectValue: string }
>("clinicalNotes/sign", async (noteId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/clinical-notes/${noteId}/sign`);
    return response.data.note;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to sign note");
  }
});

/**
 * Fetch clinical notes for a specific patient
 */
export const fetchPatientNotes = createAsyncThunk<
  { notes: ClinicalNote[]; pagination: any },
  { patientId: number; page?: number; perPage?: number; type?: string },
  { rejectValue: string }
>(
  "clinicalNotes/fetchPatientNotes",
  async ({ patientId, page = 1, perPage = 20, type }, { rejectWithValue }) => {
    try {
      const params: any = { page, per_page: perPage };
      if (type) params.type = type;

      const response = await api.get(`/patients/${patientId}/clinical-notes`, {
        params,
      });
      return {
        notes: response.data.notes,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || "Failed to fetch patient notes");
    }
  }
);

/**
 * Fetch a specific clinical note with full content
 */
export const fetchClinicalNote = createAsyncThunk<
  ClinicalNote,
  number,
  { rejectValue: string }
>("clinicalNotes/fetchNote", async (noteId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/clinical-notes/${noteId}`);
    return response.data.note;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to fetch note");
  }
});

/**
 * Delete a clinical note (only drafts)
 */
export const deleteClinicalNote = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("clinicalNotes/delete", async (noteId, { rejectWithValue }) => {
  try {
    await api.delete(`/clinical-notes/${noteId}`);
    return noteId;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to delete note");
  }
});

/**
 * Add amendment to a signed note
 */
export const amendClinicalNote = createAsyncThunk<
  { amendment_id: number },
  { noteId: number; amendmentText: string; reason: string },
  { rejectValue: string }
>(
  "clinicalNotes/amend",
  async ({ noteId, amendmentText, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/clinical-notes/${noteId}/amend`, {
        amendment_text: amendmentText,
        reason,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || "Failed to amend note");
    }
  }
);

/**
 * Fetch amendments for a clinical note
 */
export const fetchNoteAmendments = createAsyncThunk<
  NoteAmendment[],
  number,
  { rejectValue: string }
>("clinicalNotes/fetchAmendments", async (noteId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/clinical-notes/${noteId}/amendments`);
    return response.data.amendments;
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to fetch amendments");
  }
});

/**
 * Search clinical notes
 */
export const searchClinicalNotes = createAsyncThunk<
  { notes: ClinicalNote[]; count: number },
  {
    query?: string;
    patientId?: number;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  },
  { rejectValue: string }
>("clinicalNotes/search", async (searchParams, { rejectWithValue }) => {
  try {
    const params: any = {};
    if (searchParams.query) params.q = searchParams.query;
    if (searchParams.patientId) params.patient_id = searchParams.patientId;
    if (searchParams.type) params.type = searchParams.type;
    if (searchParams.status) params.status = searchParams.status;
    if (searchParams.dateFrom) params.date_from = searchParams.dateFrom;
    if (searchParams.dateTo) params.date_to = searchParams.dateTo;

    const response = await api.get("/clinical-notes/search", { params });
    return {
      notes: response.data.notes,
      count: response.data.count,
    };
  } catch (error: any) {
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    }
    return rejectWithValue(error.message || "Failed to search notes");
  }
});
