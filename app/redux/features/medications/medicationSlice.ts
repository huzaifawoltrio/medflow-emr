// redux/features/medications/medicationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createMedication,
  fetchMedications,
  fetchMedicationById,
  updateMedication,
  discontinueMedication,
  fetchPatientMedications,
  Medication,
  MedicationListResponse,
} from "./medicationActions";

interface MedicationState {
  medications: Medication[];
  selectedMedication: Medication | null;
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  operationLoading: {
    create: boolean;
    update: boolean;
    discontinue: boolean;
    fetchById: boolean;
  };
}

const initialState: MedicationState = {
  medications: [],
  selectedMedication: null,
  pagination: null,
  loading: false,
  error: null,
  success: false,
  operationLoading: {
    create: false,
    update: false,
    discontinue: false,
    fetchById: false,
  },
};

const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedMedication: (
      state,
      action: PayloadAction<Medication | null>
    ) => {
      state.selectedMedication = action.payload;
    },
    resetMedicationState: (state) => {
      state.medications = [];
      state.selectedMedication = null;
      state.pagination = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.operationLoading = {
        create: false,
        update: false,
        discontinue: false,
        fetchById: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Medication
      .addCase(createMedication.pending, (state) => {
        state.operationLoading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createMedication.fulfilled,
        (state, action: PayloadAction<Medication>) => {
          state.operationLoading.create = false;
          state.success = true;
          // Add the new medication to the beginning of the list
          state.medications.unshift(action.payload);
        }
      )
      .addCase(
        createMedication.rejected,
        (state, action: PayloadAction<any>) => {
          state.operationLoading.create = false;
          state.error = action.payload;
        }
      )

      // Fetch Medications
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMedications.fulfilled,
        (state, action: PayloadAction<MedicationListResponse>) => {
          state.loading = false;
          state.medications = action.payload.medications;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(
        fetchMedications.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Medication by ID
      .addCase(fetchMedicationById.pending, (state) => {
        state.operationLoading.fetchById = true;
        state.error = null;
      })
      .addCase(
        fetchMedicationById.fulfilled,
        (state, action: PayloadAction<Medication>) => {
          state.operationLoading.fetchById = false;
          state.selectedMedication = action.payload;
        }
      )
      .addCase(
        fetchMedicationById.rejected,
        (state, action: PayloadAction<any>) => {
          state.operationLoading.fetchById = false;
          state.error = action.payload;
        }
      )

      // Update Medication
      .addCase(updateMedication.pending, (state) => {
        state.operationLoading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateMedication.fulfilled,
        (state, action: PayloadAction<Medication>) => {
          state.operationLoading.update = false;
          state.success = true;
          // Update the medication in the list
          const index = state.medications.findIndex(
            (med) => med.id === action.payload.id
          );
          if (index !== -1) {
            state.medications[index] = action.payload;
          }
          // Update selected medication if it's the same one
          if (state.selectedMedication?.id === action.payload.id) {
            state.selectedMedication = action.payload;
          }
        }
      )
      .addCase(
        updateMedication.rejected,
        (state, action: PayloadAction<any>) => {
          state.operationLoading.update = false;
          state.error = action.payload;
        }
      )

      // Discontinue Medication
      .addCase(discontinueMedication.pending, (state) => {
        state.operationLoading.discontinue = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        discontinueMedication.fulfilled,
        (state, action: PayloadAction<{ id: number; message: string }>) => {
          state.operationLoading.discontinue = false;
          state.success = true;
          // Update the medication status to discontinued
          const index = state.medications.findIndex(
            (med) => med.id === action.payload.id
          );
          if (index !== -1) {
            state.medications[index].status = "discontinued";
            state.medications[index].discontinued_at = new Date().toISOString();
          }
          // Update selected medication if it's the same one
          if (state.selectedMedication?.id === action.payload.id) {
            state.selectedMedication = {
              ...state.selectedMedication,
              status: "discontinued",
              discontinued_at: new Date().toISOString(),
            };
          }
        }
      )
      .addCase(
        discontinueMedication.rejected,
        (state, action: PayloadAction<any>) => {
          state.operationLoading.discontinue = false;
          state.error = action.payload;
        }
      )

      // Fetch Patient Medications
      .addCase(fetchPatientMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatientMedications.fulfilled,
        (state, action: PayloadAction<MedicationListResponse>) => {
          state.loading = false;
          state.medications = action.payload.medications;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(
        fetchPatientMedications.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearError,
  clearSuccess,
  setSelectedMedication,
  resetMedicationState,
} = medicationSlice.actions;

export default medicationSlice.reducer;
