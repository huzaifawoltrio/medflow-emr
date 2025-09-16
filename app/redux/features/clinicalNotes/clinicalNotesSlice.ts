// redux/features/clinicalNotes/clinicalNotesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNoteTypes,
  fetchNoteType,
  fetchNoteTemplates,
  fetchNoteTemplate,
  createClinicalNote,
  updateClinicalNote,
  signClinicalNote,
  fetchPatientNotes,
  fetchClinicalNote,
  deleteClinicalNote,
  amendClinicalNote,
  fetchNoteAmendments,
  searchClinicalNotes,
  filterNotesByTypeAndTemplate,
  NoteType,
  NoteTemplate,
  ClinicalNote,
  NoteAmendment,
} from "./clinicalNotesActions";

interface ClinicalNotesState {
  // Note Types
  noteTypes: NoteType[];
  selectedNoteType: NoteType | null;
  noteTypesLoading: boolean;
  noteTypesError: string | null;

  // Templates
  templates: NoteTemplate[];
  selectedTemplate: NoteTemplate | null;
  templatesLoading: boolean;
  templatesError: string | null;

  // Notes
  notes: ClinicalNote[];
  selectedNote: ClinicalNote | null;
  notesLoading: boolean;
  notesError: string | null;

  // Pagination for patient notes
  notesPagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  } | null;

  // Amendments
  amendments: NoteAmendment[];
  amendmentsLoading: boolean;
  amendmentsError: string | null;

  // Search results
  searchResults: ClinicalNote[];
  searchCount: number;
  searchLoading: boolean;
  searchError: string | null;

  // Filter results
  filteredResults: ClinicalNote[];
  filteredCount: number;
  filterLoading: boolean;
  filterError: string | null;

  // UI states
  creating: boolean;
  updating: boolean;
  signing: boolean;
  deleting: boolean;
  amending: boolean;

  // Success states
  createSuccess: boolean;
  updateSuccess: boolean;
  signSuccess: boolean;
  deleteSuccess: boolean;
  amendSuccess: boolean;
}

const initialState: ClinicalNotesState = {
  noteTypes: [],
  selectedNoteType: null,
  noteTypesLoading: false,
  noteTypesError: null,

  templates: [],
  selectedTemplate: null,
  templatesLoading: false,
  templatesError: null,

  notes: [],
  selectedNote: null,
  notesLoading: false,
  notesError: null,
  notesPagination: null,

  amendments: [],
  amendmentsLoading: false,
  amendmentsError: null,

  searchResults: [],
  searchCount: 0,
  searchLoading: false,
  searchError: null,

  filteredResults: [],
  filteredCount: 0,
  filterLoading: false,
  filterError: null,

  creating: false,
  updating: false,
  signing: false,
  deleting: false,
  amending: false,

  createSuccess: false,
  updateSuccess: false,
  signSuccess: false,
  deleteSuccess: false,
  amendSuccess: false,
};

const clinicalNotesSlice = createSlice({
  name: "clinicalNotes",
  initialState,
  reducers: {
    // Clear success states
    clearSuccessStates: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.signSuccess = false;
      state.deleteSuccess = false;
      state.amendSuccess = false;
    },

    // Clear errors
    clearErrors: (state) => {
      state.noteTypesError = null;
      state.templatesError = null;
      state.notesError = null;
      state.amendmentsError = null;
      state.searchError = null;
      state.filterError = null;
    },

    // Clear selected items
    clearSelectedNoteType: (state) => {
      state.selectedNoteType = null;
    },

    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    },

    clearSelectedNote: (state) => {
      state.selectedNote = null;
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchCount = 0;
      state.searchError = null;
    },

    // Clear filter results
    clearFilterResults: (state) => {
      state.filteredResults = [];
      state.filteredCount = 0;
      state.filterError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Note Types
      .addCase(fetchNoteTypes.pending, (state) => {
        state.noteTypesLoading = true;
        state.noteTypesError = null;
      })
      .addCase(
        fetchNoteTypes.fulfilled,
        (state, action: PayloadAction<NoteType[]>) => {
          state.noteTypesLoading = false;
          state.noteTypes = action.payload;
        }
      )
      .addCase(fetchNoteTypes.rejected, (state, action: PayloadAction<any>) => {
        state.noteTypesLoading = false;
        state.noteTypesError = action.payload;
      })

      // Fetch Single Note Type
      .addCase(fetchNoteType.pending, (state) => {
        state.noteTypesLoading = true;
        state.noteTypesError = null;
      })
      .addCase(
        fetchNoteType.fulfilled,
        (state, action: PayloadAction<NoteType>) => {
          state.noteTypesLoading = false;
          state.selectedNoteType = action.payload;
        }
      )
      .addCase(fetchNoteType.rejected, (state, action: PayloadAction<any>) => {
        state.noteTypesLoading = false;
        state.noteTypesError = action.payload;
      })

      // Fetch Templates
      .addCase(fetchNoteTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(
        fetchNoteTemplates.fulfilled,
        (state, action: PayloadAction<NoteTemplate[]>) => {
          state.templatesLoading = false;
          state.templates = action.payload;
        }
      )
      .addCase(
        fetchNoteTemplates.rejected,
        (state, action: PayloadAction<any>) => {
          state.templatesLoading = false;
          state.templatesError = action.payload;
        }
      )

      // Fetch Single Template
      .addCase(fetchNoteTemplate.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(
        fetchNoteTemplate.fulfilled,
        (state, action: PayloadAction<NoteTemplate>) => {
          state.templatesLoading = false;
          state.selectedTemplate = action.payload;
        }
      )
      .addCase(
        fetchNoteTemplate.rejected,
        (state, action: PayloadAction<any>) => {
          state.templatesLoading = false;
          state.templatesError = action.payload;
        }
      )

      // Create Note
      .addCase(createClinicalNote.pending, (state) => {
        state.creating = true;
        state.notesError = null;
        state.createSuccess = false;
      })
      .addCase(
        createClinicalNote.fulfilled,
        (state, action: PayloadAction<ClinicalNote>) => {
          state.creating = false;
          state.createSuccess = true;
          // Add the new note to the beginning of the notes array
          state.notes.unshift(action.payload);
        }
      )
      .addCase(
        createClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.creating = false;
          state.notesError = action.payload;
        }
      )

      // Update Note
      .addCase(updateClinicalNote.pending, (state) => {
        state.updating = true;
        state.notesError = null;
        state.updateSuccess = false;
      })
      .addCase(
        updateClinicalNote.fulfilled,
        (state, action: PayloadAction<ClinicalNote>) => {
          state.updating = false;
          state.updateSuccess = true;
          // Update the note in the notes array
          const index = state.notes.findIndex(
            (note) => note.id === action.payload.id
          );
          if (index !== -1) {
            state.notes[index] = action.payload;
          }
          // Update selected note if it's the same one
          if (
            state.selectedNote &&
            state.selectedNote.id === action.payload.id
          ) {
            state.selectedNote = action.payload;
          }
        }
      )
      .addCase(
        updateClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.updating = false;
          state.notesError = action.payload;
        }
      )

      // Sign Note
      .addCase(signClinicalNote.pending, (state) => {
        state.signing = true;
        state.notesError = null;
        state.signSuccess = false;
      })
      .addCase(
        signClinicalNote.fulfilled,
        (state, action: PayloadAction<ClinicalNote>) => {
          state.signing = false;
          state.signSuccess = true;
          // Update the note in the notes array
          const index = state.notes.findIndex(
            (note) => note.id === action.payload.id
          );
          if (index !== -1) {
            state.notes[index] = action.payload;
          }
          // Update selected note if it's the same one
          if (
            state.selectedNote &&
            state.selectedNote.id === action.payload.id
          ) {
            state.selectedNote = action.payload;
          }
        }
      )
      .addCase(
        signClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.signing = false;
          state.notesError = action.payload;
        }
      )

      // Fetch Patient Notes
      .addCase(fetchPatientNotes.pending, (state) => {
        state.notesLoading = true;
        state.notesError = null;
      })
      .addCase(fetchPatientNotes.fulfilled, (state, action) => {
        state.notesLoading = false;
        state.notes = action.payload.notes;
        state.notesPagination = action.payload.pagination;
      })
      .addCase(
        fetchPatientNotes.rejected,
        (state, action: PayloadAction<any>) => {
          state.notesLoading = false;
          state.notesError = action.payload;
        }
      )

      // Fetch Single Note
      .addCase(fetchClinicalNote.pending, (state) => {
        state.notesLoading = true;
        state.notesError = null;
      })
      .addCase(
        fetchClinicalNote.fulfilled,
        (state, action: PayloadAction<ClinicalNote>) => {
          state.notesLoading = false;
          state.selectedNote = action.payload;
        }
      )
      .addCase(
        fetchClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.notesLoading = false;
          state.notesError = action.payload;
        }
      )

      // Delete Note
      .addCase(deleteClinicalNote.pending, (state) => {
        state.deleting = true;
        state.notesError = null;
        state.deleteSuccess = false;
      })
      .addCase(
        deleteClinicalNote.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          state.deleteSuccess = true;
          // Remove the note from the notes array
          state.notes = state.notes.filter(
            (note) => note.id !== action.payload
          );
          // Clear selected note if it was deleted
          if (state.selectedNote && state.selectedNote.id === action.payload) {
            state.selectedNote = null;
          }
        }
      )
      .addCase(
        deleteClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.deleting = false;
          state.notesError = action.payload;
        }
      )

      // Amend Note
      .addCase(amendClinicalNote.pending, (state) => {
        state.amending = true;
        state.amendmentsError = null;
        state.amendSuccess = false;
      })
      .addCase(amendClinicalNote.fulfilled, (state, action) => {
        state.amending = false;
        state.amendSuccess = true;
      })
      .addCase(
        amendClinicalNote.rejected,
        (state, action: PayloadAction<any>) => {
          state.amending = false;
          state.amendmentsError = action.payload;
        }
      )

      // Fetch Amendments
      .addCase(fetchNoteAmendments.pending, (state) => {
        state.amendmentsLoading = true;
        state.amendmentsError = null;
      })
      .addCase(
        fetchNoteAmendments.fulfilled,
        (state, action: PayloadAction<NoteAmendment[]>) => {
          state.amendmentsLoading = false;
          state.amendments = action.payload;
        }
      )
      .addCase(
        fetchNoteAmendments.rejected,
        (state, action: PayloadAction<any>) => {
          state.amendmentsLoading = false;
          state.amendmentsError = action.payload;
        }
      )

      // Search Notes
      .addCase(searchClinicalNotes.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchClinicalNotes.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.notes;
        state.searchCount = action.payload.count;
      })
      .addCase(
        searchClinicalNotes.rejected,
        (state, action: PayloadAction<any>) => {
          state.searchLoading = false;
          state.searchError = action.payload;
        }
      )

      // Filter Notes
      .addCase(filterNotesByTypeAndTemplate.pending, (state) => {
        state.filterLoading = true;
        state.filterError = null;
      })
      .addCase(filterNotesByTypeAndTemplate.fulfilled, (state, action) => {
        state.filterLoading = false;
        state.filteredResults = action.payload.notes;
        state.filteredCount = action.payload.count;
      })
      .addCase(
        filterNotesByTypeAndTemplate.rejected,
        (state, action: PayloadAction<any>) => {
          state.filterLoading = false;
          state.filterError = action.payload;
        }
      );
  },
});

export const {
  clearSuccessStates,
  clearErrors,
  clearSelectedNoteType,
  clearSelectedTemplate,
  clearSelectedNote,
  clearSearchResults,
  clearFilterResults,
} = clinicalNotesSlice.actions;

export default clinicalNotesSlice.reducer;
