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
    await api.delete(`/patients/documents/${documentId}`);
    return documentId;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to delete document");
    }
  }
});
