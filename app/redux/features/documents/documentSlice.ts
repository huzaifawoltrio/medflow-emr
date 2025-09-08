// redux/features/documents/documentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadPatientDocument,
  fetchPatientDocuments,
  fetchAllDocuments,
  deleteDocument,
  fetchMyUploadedDocuments,
  Document,
  PaginatedDocumentsResponse,
} from "./documentActions";

interface DocumentState {
  documents: Document[];
  myUploadedDocuments: PaginatedDocumentsResponse | null;
  loading: boolean;
  uploading: boolean;
  deleting: boolean;
  error: string | null;
  uploadError: string | null;
  deleteError: string | null;
  success: boolean;
  uploadSuccess: boolean;
}

const initialState: DocumentState = {
  documents: [],
  myUploadedDocuments: null,
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
  uploadError: null,
  deleteError: null,
  success: false,
  uploadSuccess: false,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.uploadError = null;
      state.uploadSuccess = false;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUploadState: (state) => {
      state.uploading = false;
      state.uploadError = null;
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload document cases
      .addCase(uploadPatientDocument.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(
        uploadPatientDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.uploading = false;
          state.uploadSuccess = true;
          // Add the new document to the beginning of the array
          state.documents.unshift(action.payload);

          // Also add to myUploadedDocuments if it exists
          if (state.myUploadedDocuments) {
            state.myUploadedDocuments.documents.unshift(action.payload);
            state.myUploadedDocuments.count += 1;
            state.myUploadedDocuments.total_count += 1;
          }
        }
      )
      .addCase(
        uploadPatientDocument.rejected,
        (state, action: PayloadAction<any>) => {
          state.uploading = false;
          state.uploadError = action.payload;
        }
      )
      // Fetch all documents cases
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllDocuments.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.loading = false;
          state.documents = action.payload;
          state.success = true;
        }
      )
      .addCase(
        fetchAllDocuments.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Fetch patient documents cases
      .addCase(fetchPatientDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatientDocuments.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.loading = false;
          state.documents = action.payload;
          state.success = true;
        }
      )
      .addCase(
        fetchPatientDocuments.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Fetch my uploaded documents cases
      .addCase(fetchMyUploadedDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyUploadedDocuments.fulfilled,
        (state, action: PayloadAction<PaginatedDocumentsResponse>) => {
          state.loading = false;
          state.myUploadedDocuments = action.payload;
          state.success = true;
        }
      )
      .addCase(
        fetchMyUploadedDocuments.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Delete document cases
      .addCase(deleteDocument.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteDocument.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          // Remove the deleted document from the documents array
          state.documents = state.documents.filter(
            (doc) => doc.id !== action.payload
          );

          // Also remove from myUploadedDocuments if it exists
          if (state.myUploadedDocuments) {
            const originalCount = state.myUploadedDocuments.documents.length;
            state.myUploadedDocuments.documents =
              state.myUploadedDocuments.documents.filter(
                (doc) => doc.id !== action.payload
              );
            const newCount = state.myUploadedDocuments.documents.length;

            // Update counts if a document was actually removed
            if (newCount < originalCount) {
              state.myUploadedDocuments.count = newCount;
              state.myUploadedDocuments.total_count -= 1;
            }
          }
        }
      )
      .addCase(deleteDocument.rejected, (state, action: PayloadAction<any>) => {
        state.deleting = false;
        state.deleteError = action.payload;
      });
  },
});

export const {
  clearUploadError,
  clearDeleteError,
  clearError,
  resetUploadState,
} = documentSlice.actions;
export default documentSlice.reducer;
