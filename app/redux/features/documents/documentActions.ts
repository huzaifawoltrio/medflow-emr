// redux/features/documents/documentActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define the type for the document data
export interface Document {
  id: number;
  patient_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  description: string;
  tags: string[];
  uploaded_by: number;
  uploader_name: string;
  created_at: string;
  patient_name?: string;
}

// Define the type for upload document form data
export interface UploadDocumentData {
  file: File;
  patient_id: number;
  description: string;
  tags: string;
}

// Define the type for the upload response
interface UploadDocumentResponse {
  document: Document;
  message: string;
}

// Define the type for search parameters
export interface DocumentSearchParams {
  patient_id?: number;
  file_type?: string;
  tags?: string;
  q?: string;
}

// Define the type for doctor's documents search parameters
export interface DoctorDocumentsSearchParams {
  page?: number;
  per_page?: number;
  file_type?: string;
  tags?: string;
  q?: string;
  patient_id?: number;
}

// Define the type for paginated response
export interface PaginatedDocumentsResponse {
  documents: Document[];
  count: number;
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  filters: {
    file_type: string | null;
    patient_id: number | null;
    search_query: string | null;
    tags: string | null;
  };
}

/**
 * Async thunk for uploading a patient document.
 * It takes form data and returns the uploaded document on success.
 */
export const uploadPatientDocument = createAsyncThunk<
  Document,
  UploadDocumentData,
  { rejectValue: string }
>("documents/upload", async (uploadData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("patient_id", uploadData.patient_id.toString());
    formData.append("description", uploadData.description);
    formData.append("tags", uploadData.tags);

    const response = await api.post<UploadDocumentResponse>(
      "/patients/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.document;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to upload document");
    }
  }
});

/**
 * Async thunk for fetching all documents for a patient.
 */
export const fetchPatientDocuments = createAsyncThunk<
  Document[],
  number, // patient_id
  { rejectValue: string }
>("documents/fetchByPatient", async (patientId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/patients/${patientId}/documents`);
    return response.data.documents;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to fetch documents");
    }
  }
});

/**
 * Async thunk for fetching all documents (for doctors).
 */
export const fetchAllDocuments = createAsyncThunk<
  Document[],
  void,
  { rejectValue: string }
>("documents/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/patients/documents");
    return response.data.documents;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to fetch documents");
    }
  }
});

/**
 * Async thunk for deleting a document.
 */
export const deleteDocument = createAsyncThunk<
  number, // document id
  number, // document id
  { rejectValue: string }
>("documents/delete", async (documentId, { rejectWithValue }) => {
  try {
    await api.delete(`/documents/${documentId}`);
    return documentId;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to delete document");
    }
  }
});

/**
 * Async thunk for searching documents.
 */
export const searchDocuments = createAsyncThunk<
  Document[],
  DocumentSearchParams,
  { rejectValue: string }
>("documents/search", async (searchParams, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(
      `/documents/search?${queryParams.toString()}`
    );
    return response.data.documents;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to search documents");
    }
  }
});

/**
 * Async thunk for fetching documents uploaded by the current doctor.
 */
export const fetchMyUploadedDocuments = createAsyncThunk<
  PaginatedDocumentsResponse,
  DoctorDocumentsSearchParams,
  { rejectValue: string }
>(
  "documents/fetchMyUploaded",
  async (searchParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/doctors/my-documents?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          error.message || "Failed to fetch my uploaded documents"
        );
      }
    }
  }
);
