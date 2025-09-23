// redux/features/labResults/labResultsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createLabResult,
  fetchPatientLabResults,
  fetchPatientLabResultsGraph,
  fetchLabResultById,
  updateLabResult,
  deleteLabResult,
  fetchCriticalLabResults,
  fetchRecentLabResults,
  LabResult,
  GraphLabResult,
  LabResultsResponse,
  GraphLabResultsResponse,
  CreateLabResultResponse,
  LabResultsFilters,
} from "./labResultsActions";

interface LabResultsState {
  // Main lab results data
  labResults: LabResult[];
  selectedLabResult: LabResult | null;

  // Patient-specific data
  patientLabResults: { [patientId: number]: LabResult[] };
  patientGraphResults: { [patientId: number]: GraphLabResult[] };

  // Dashboard data
  criticalLabResults: LabResult[];
  recentLabResults: LabResult[];

  // Pagination and filtering
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  } | null;

  graphPagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  } | null;

  // Applied filters
  appliedFilters: LabResultsFilters;

  // Loading states
  loading: {
    main: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    patient: boolean;
    graph: boolean;
    critical: boolean;
    recent: boolean;
    single: boolean;
  };

  // Error states
  error: {
    main: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    patient: string | null;
    graph: string | null;
    critical: string | null;
    recent: string | null;
    single: string | null;
  };

  // Success states
  success: {
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
}

const initialState: LabResultsState = {
  labResults: [],
  selectedLabResult: null,
  patientLabResults: {},
  patientGraphResults: {},
  criticalLabResults: [],
  recentLabResults: [],
  pagination: null,
  graphPagination: null,
  appliedFilters: {},
  loading: {
    main: false,
    creating: false,
    updating: false,
    deleting: false,
    patient: false,
    graph: false,
    critical: false,
    recent: false,
    single: false,
  },
  error: {
    main: null,
    creating: null,
    updating: null,
    deleting: null,
    patient: null,
    graph: null,
    critical: null,
    recent: null,
    single: null,
  },
  success: {
    creating: false,
    updating: false,
    deleting: false,
  },
};

const labResultsSlice = createSlice({
  name: "labResults",
  initialState,
  reducers: {
    // Clear specific errors
    clearError: (
      state,
      action: PayloadAction<keyof LabResultsState["error"]>
    ) => {
      state.error[action.payload] = null;
    },

    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof LabResultsState["error"]] = null;
      });
    },

    // Clear success states
    clearSuccess: (
      state,
      action: PayloadAction<keyof LabResultsState["success"]>
    ) => {
      state.success[action.payload] = false;
    },

    // Clear all success states
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach((key) => {
        state.success[key as keyof LabResultsState["success"]] = false;
      });
    },

    // Clear selected lab result
    clearSelectedLabResult: (state) => {
      state.selectedLabResult = null;
    },

    // Clear patient-specific data
    clearPatientData: (state, action: PayloadAction<number>) => {
      const patientId = action.payload;
      delete state.patientLabResults[patientId];
      delete state.patientGraphResults[patientId];
    },

    // Set applied filters
    setAppliedFilters: (state, action: PayloadAction<LabResultsFilters>) => {
      state.appliedFilters = action.payload;
    },

    // Clear applied filters
    clearAppliedFilters: (state) => {
      state.appliedFilters = {};
    },

    // Reset entire state
    resetLabResultsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Create Lab Result
      .addCase(createLabResult.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        state.success.creating = false;
      })
      .addCase(
        createLabResult.fulfilled,
        (state, action: PayloadAction<CreateLabResultResponse>) => {
          state.loading.creating = false;
          state.success.creating = true;
          const labResult = action.payload.lab_result;

          // Add to the beginning of the main list
          state.labResults.unshift(labResult);

          // Add to patient lab results if exists
          const patientId = labResult.patient_id;
          if (state.patientLabResults[patientId]) {
            state.patientLabResults[patientId].unshift(labResult);
          }

          // Add to recent lab results
          state.recentLabResults.unshift(labResult);
          if (state.recentLabResults.length > 20) {
            state.recentLabResults.pop();
          }

          // Add to critical lab results if it's critical
          if (labResult.is_critical) {
            state.criticalLabResults.unshift(labResult);
            if (state.criticalLabResults.length > 20) {
              state.criticalLabResults.pop();
            }
          }
        }
      )
      .addCase(createLabResult.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      })

      // Fetch Patient Lab Results
      .addCase(fetchPatientLabResults.pending, (state) => {
        state.loading.patient = true;
        state.error.patient = null;
      })
      .addCase(
        fetchPatientLabResults.fulfilled,
        (state, action: PayloadAction<LabResultsResponse>) => {
          state.loading.patient = false;
          const patientId = action.payload.filters_applied.patient_id;

          // Store patient lab results
          state.patientLabResults[patientId] = action.payload.lab_results;
          state.pagination = action.payload.pagination;

          // Update applied filters
          state.appliedFilters = {
            ...state.appliedFilters,
            patient_id: patientId,
            status:
              action.payload.filters_applied.status === "all"
                ? undefined
                : (action.payload.filters_applied.status as any),
            critical_only:
              action.payload.filters_applied.critical_only || undefined,
          };
        }
      )
      .addCase(fetchPatientLabResults.rejected, (state, action) => {
        state.loading.patient = false;
        state.error.patient = action.payload as string;
      })

      // Fetch Patient Lab Results Graph
      .addCase(fetchPatientLabResultsGraph.pending, (state) => {
        state.loading.graph = true;
        state.error.graph = null;
      })
      .addCase(
        fetchPatientLabResultsGraph.fulfilled,
        (state, action: PayloadAction<GraphLabResultsResponse>) => {
          state.loading.graph = false;
          const patientId = action.payload.filters_applied.patient_id;

          // Store patient graph results
          state.patientGraphResults[patientId] = action.payload.lab_results;
          state.graphPagination = action.payload.pagination;
        }
      )
      .addCase(fetchPatientLabResultsGraph.rejected, (state, action) => {
        state.loading.graph = false;
        state.error.graph = action.payload as string;
      })

      // Fetch Lab Result by ID
      .addCase(fetchLabResultById.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(
        fetchLabResultById.fulfilled,
        (state, action: PayloadAction<LabResult>) => {
          state.loading.single = false;
          state.selectedLabResult = action.payload;
        }
      )
      .addCase(fetchLabResultById.rejected, (state, action) => {
        state.loading.single = false;
        state.error.single = action.payload as string;
      })

      // Update Lab Result
      .addCase(updateLabResult.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
        state.success.updating = false;
      })
      .addCase(
        updateLabResult.fulfilled,
        (state, action: PayloadAction<LabResult>) => {
          state.loading.updating = false;
          state.success.updating = true;

          // Update in main list
          const index = state.labResults.findIndex(
            (lr) => lr.id === action.payload.id
          );
          if (index !== -1) {
            state.labResults[index] = action.payload;
          }

          // Update selected lab result
          if (state.selectedLabResult?.id === action.payload.id) {
            state.selectedLabResult = action.payload;
          }

          // Update in patient lab results
          const patientId = action.payload.patient_id;
          if (state.patientLabResults[patientId]) {
            const patientIndex = state.patientLabResults[patientId].findIndex(
              (lr) => lr.id === action.payload.id
            );
            if (patientIndex !== -1) {
              state.patientLabResults[patientId][patientIndex] = action.payload;
            }
          }

          // Update in critical lab results
          const criticalIndex = state.criticalLabResults.findIndex(
            (lr) => lr.id === action.payload.id
          );
          if (criticalIndex !== -1) {
            if (action.payload.is_critical) {
              state.criticalLabResults[criticalIndex] = action.payload;
            } else {
              // Remove from critical if no longer critical
              state.criticalLabResults.splice(criticalIndex, 1);
            }
          } else if (action.payload.is_critical) {
            // Add to critical if now critical
            state.criticalLabResults.unshift(action.payload);
          }

          // Update in recent lab results
          const recentIndex = state.recentLabResults.findIndex(
            (lr) => lr.id === action.payload.id
          );
          if (recentIndex !== -1) {
            state.recentLabResults[recentIndex] = action.payload;
          }
        }
      )
      .addCase(updateLabResult.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload as string;
      })

      // Delete Lab Result
      .addCase(deleteLabResult.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
        state.success.deleting = false;
      })
      .addCase(
        deleteLabResult.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading.deleting = false;
          state.success.deleting = true;

          const deletedId = action.payload;

          // Remove from main list
          state.labResults = state.labResults.filter(
            (lr) => lr.id !== deletedId
          );

          // Clear selected if it was deleted
          if (state.selectedLabResult?.id === deletedId) {
            state.selectedLabResult = null;
          }

          // Remove from patient lab results
          Object.keys(state.patientLabResults).forEach((patientId) => {
            state.patientLabResults[Number(patientId)] =
              state.patientLabResults[Number(patientId)].filter(
                (lr) => lr.id !== deletedId
              );
          });

          // Remove from critical lab results
          state.criticalLabResults = state.criticalLabResults.filter(
            (lr) => lr.id !== deletedId
          );

          // Remove from recent lab results
          state.recentLabResults = state.recentLabResults.filter(
            (lr) => lr.id !== deletedId
          );
        }
      )
      .addCase(deleteLabResult.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload as string;
      })

      // Fetch Critical Lab Results
      .addCase(fetchCriticalLabResults.pending, (state) => {
        state.loading.critical = true;
        state.error.critical = null;
      })
      .addCase(fetchCriticalLabResults.fulfilled, (state, action) => {
        state.loading.critical = false;
        state.criticalLabResults = action.payload.lab_results;
      })
      .addCase(fetchCriticalLabResults.rejected, (state, action) => {
        state.loading.critical = false;
        state.error.critical = action.payload as string;
      })

      // Fetch Recent Lab Results
      .addCase(fetchRecentLabResults.pending, (state) => {
        state.loading.recent = true;
        state.error.recent = null;
      })
      .addCase(fetchRecentLabResults.fulfilled, (state, action) => {
        state.loading.recent = false;
        state.recentLabResults = action.payload.lab_results;
      })
      .addCase(fetchRecentLabResults.rejected, (state, action) => {
        state.loading.recent = false;
        state.error.recent = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearAllErrors,
  clearSuccess,
  clearAllSuccess,
  clearSelectedLabResult,
  clearPatientData,
  setAppliedFilters,
  clearAppliedFilters,
  resetLabResultsState,
} = labResultsSlice.actions;

// Selectors
export const selectLabResultsState = (state: { labResults: LabResultsState }) =>
  state.labResults;

export const selectLabResults = (state: { labResults: LabResultsState }) =>
  state.labResults.labResults;

export const selectSelectedLabResult = (state: {
  labResults: LabResultsState;
}) => state.labResults.selectedLabResult;

export const selectPatientLabResults = (
  state: { labResults: LabResultsState },
  patientId: number
) => state.labResults.patientLabResults[patientId] || [];

export const selectPatientGraphResults = (
  state: { labResults: LabResultsState },
  patientId: number
) => state.labResults.patientGraphResults[patientId] || [];

export const selectCriticalLabResults = (state: {
  labResults: LabResultsState;
}) => state.labResults.criticalLabResults;

export const selectRecentLabResults = (state: {
  labResults: LabResultsState;
}) => state.labResults.recentLabResults;

export const selectLabResultsPagination = (state: {
  labResults: LabResultsState;
}) => state.labResults.pagination;

export const selectLabResultsGraphPagination = (state: {
  labResults: LabResultsState;
}) => state.labResults.graphPagination;

export const selectAppliedFilters = (state: { labResults: LabResultsState }) =>
  state.labResults.appliedFilters;

export const selectLabResultsLoading = (state: {
  labResults: LabResultsState;
}) => state.labResults.loading;

export const selectLabResultsError = (state: { labResults: LabResultsState }) =>
  state.labResults.error;

export const selectLabResultsSuccess = (state: {
  labResults: LabResultsState;
}) => state.labResults.success;

// Complex selectors
export const selectLabResultsByPatientId = (
  state: { labResults: LabResultsState },
  patientId: number
) =>
  state.labResults.labResults.filter(
    (labResult) => labResult.patient_id === patientId
  );

export const selectCriticalLabResultsByPatientId = (
  state: { labResults: LabResultsState },
  patientId: number
) =>
  state.labResults.criticalLabResults.filter(
    (labResult) => labResult.patient_id === patientId
  );

export const selectLabResultsByStatus = (
  state: { labResults: LabResultsState },
  status: "pending" | "final" | "cancelled"
) =>
  state.labResults.labResults.filter(
    (labResult) => labResult.status === status
  );

export const selectPendingLabResults = (state: {
  labResults: LabResultsState;
}) =>
  state.labResults.labResults.filter(
    (labResult) => labResult.status === "pending"
  );

export const selectFinalLabResults = (state: { labResults: LabResultsState }) =>
  state.labResults.labResults.filter(
    (labResult) => labResult.status === "final"
  );

export const selectIsLabResultsLoading = (state: {
  labResults: LabResultsState;
}) => Object.values(state.labResults.loading).some((loading) => loading);

export const selectHasLabResultsError = (state: {
  labResults: LabResultsState;
}) => Object.values(state.labResults.error).some((error) => error !== null);

export const selectLabResultsWithCriticalValues = (state: {
  labResults: LabResultsState;
}) => state.labResults.labResults.filter((labResult) => labResult.is_critical);

// Get specific lab values across all results for a patient (for trending)
export const selectPatientLabValueTrend = (
  state: { labResults: LabResultsState },
  patientId: number,
  labValueName: keyof LabResult["lab_values"]
) => {
  const patientResults = state.labResults.patientLabResults[patientId] || [];
  return patientResults
    .filter(
      (result) =>
        result.lab_values[labValueName] !== null &&
        result.lab_values[labValueName] !== undefined
    )
    .map((result) => ({
      date: result.test_date,
      value: result.lab_values[labValueName],
      id: result.id,
      is_critical: result.is_critical,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Get latest lab result for a patient
export const selectLatestLabResultForPatient = (
  state: { labResults: LabResultsState },
  patientId: number
) => {
  const patientResults = state.labResults.patientLabResults[patientId] || [];
  if (patientResults.length === 0) return null;

  return patientResults.reduce((latest, current) => {
    const latestDate = new Date(latest.test_date);
    const currentDate = new Date(current.test_date);
    return currentDate > latestDate ? current : latest;
  });
};

export default labResultsSlice.reducer;
