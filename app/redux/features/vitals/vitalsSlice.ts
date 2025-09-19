// redux/features/vitals/vitalsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createVitalSigns,
  fetchVitalSigns,
  fetchVitalSignsById,
  updateVitalSigns,
  deleteVitalSigns,
  fetchPatientVitalSigns,
  fetchPatientVitalsSummary,
  fetchPatientVitalsTrends,
  fetchPatientLatestVitals,
  fetchAppointmentVitalSigns,
  createAppointmentVitalSigns,
  fetchVitalsOptions,
  fetchVitalsAlerts,
  fetchRecentVitals,
} from "./vitalsActions";

// Import types instead of re-declaring them
import type {
  VitalSigns,
  VitalsSummary,
  VitalsTrendData,
  VitalsOptions,
  VitalsAlert,
} from "./vitalsActions";

interface VitalsState {
  // Main vitals data
  vitalSignsList: VitalSigns[];
  selectedVitalSigns: VitalSigns | null;

  // Patient-specific data
  patientVitals: { [patientId: number]: VitalSigns[] };
  patientSummaries: { [patientId: number]: VitalsSummary };
  patientTrends: { [patientId: number]: VitalsTrendData[] };
  patientLatestVitals: { [patientId: number]: VitalSigns | null };

  // Appointment-specific data
  appointmentVitals: { [appointmentId: number]: VitalSigns[] };

  // Options and configuration
  vitalsOptions: VitalsOptions | null;

  // Dashboard data
  vitalsAlerts: VitalsAlert[];
  recentVitals: VitalSigns[];

  // Pagination and filtering
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };

  // Loading states
  loading: {
    main: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    patient: boolean;
    summary: boolean;
    trends: boolean;
    latest: boolean;
    appointment: boolean;
    options: boolean;
    alerts: boolean;
    recent: boolean;
  };

  // Error states
  error: {
    main: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    patient: string | null;
    summary: string | null;
    trends: string | null;
    latest: string | null;
    appointment: string | null;
    options: string | null;
    alerts: string | null;
    recent: string | null;
  };

  // Success states
  success: {
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
}

const initialState: VitalsState = {
  vitalSignsList: [],
  selectedVitalSigns: null,
  patientVitals: {},
  patientSummaries: {},
  patientTrends: {},
  patientLatestVitals: {},
  appointmentVitals: {},
  vitalsOptions: null,
  vitalsAlerts: [],
  recentVitals: [],
  pagination: {
    total: 0,
    page: 1,
    per_page: 20,
  },
  loading: {
    main: false,
    creating: false,
    updating: false,
    deleting: false,
    patient: false,
    summary: false,
    trends: false,
    latest: false,
    appointment: false,
    options: false,
    alerts: false,
    recent: false,
  },
  error: {
    main: null,
    creating: null,
    updating: null,
    deleting: null,
    patient: null,
    summary: null,
    trends: null,
    latest: null,
    appointment: null,
    options: null,
    alerts: null,
    recent: null,
  },
  success: {
    creating: false,
    updating: false,
    deleting: false,
  },
};

const vitalsSlice = createSlice({
  name: "vitals",
  initialState,
  reducers: {
    // Clear specific errors
    clearError: (state, action: PayloadAction<keyof VitalsState["error"]>) => {
      state.error[action.payload] = null;
    },

    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof VitalsState["error"]] = null;
      });
    },

    // Clear success states
    clearSuccess: (
      state,
      action: PayloadAction<keyof VitalsState["success"]>
    ) => {
      state.success[action.payload] = false;
    },

    // Clear all success states
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach((key) => {
        state.success[key as keyof VitalsState["success"]] = false;
      });
    },

    // Clear selected vital signs
    clearSelectedVitalSigns: (state) => {
      state.selectedVitalSigns = null;
    },

    // Clear patient-specific data
    clearPatientData: (state, action: PayloadAction<number>) => {
      const patientId = action.payload;
      delete state.patientVitals[patientId];
      delete state.patientSummaries[patientId];
      delete state.patientTrends[patientId];
      delete state.patientLatestVitals[patientId];
    },

    // Clear appointment-specific data
    clearAppointmentData: (state, action: PayloadAction<number>) => {
      const appointmentId = action.payload;
      delete state.appointmentVitals[appointmentId];
    },

    // Reset entire state
    resetVitalsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Create Vital Signs
      .addCase(createVitalSigns.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        state.success.creating = false;
      })
      .addCase(createVitalSigns.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.success.creating = true;
        // Add to the beginning of the list
        state.vitalSignsList.unshift(action.payload);

        // Update patient vitals if exists
        const patientId = action.payload.patient_id;
        if (state.patientVitals[patientId]) {
          state.patientVitals[patientId].unshift(action.payload);
        }

        // Update appointment vitals if exists
        if (
          action.payload.appointment_id &&
          state.appointmentVitals[action.payload.appointment_id]
        ) {
          state.appointmentVitals[action.payload.appointment_id].unshift(
            action.payload
          );
        }

        // Update latest vitals
        state.patientLatestVitals[patientId] = action.payload;

        // Add to recent vitals
        state.recentVitals.unshift(action.payload);
        if (state.recentVitals.length > 20) {
          state.recentVitals.pop();
        }
      })
      .addCase(createVitalSigns.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      })

      // Fetch All Vital Signs
      .addCase(fetchVitalSigns.pending, (state) => {
        state.loading.main = true;
        state.error.main = null;
      })
      .addCase(fetchVitalSigns.fulfilled, (state, action) => {
        state.loading.main = false;
        state.vitalSignsList = action.payload.vital_signs;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          per_page: action.payload.per_page,
        };
      })
      .addCase(fetchVitalSigns.rejected, (state, action) => {
        state.loading.main = false;
        state.error.main = action.payload as string;
      })

      // Fetch Vital Signs by ID
      .addCase(fetchVitalSignsById.pending, (state) => {
        state.loading.main = true;
        state.error.main = null;
      })
      .addCase(fetchVitalSignsById.fulfilled, (state, action) => {
        state.loading.main = false;
        state.selectedVitalSigns = action.payload;
      })
      .addCase(fetchVitalSignsById.rejected, (state, action) => {
        state.loading.main = false;
        state.error.main = action.payload as string;
      })

      // Update Vital Signs
      .addCase(updateVitalSigns.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
        state.success.updating = false;
      })
      .addCase(updateVitalSigns.fulfilled, (state, action) => {
        state.loading.updating = false;
        state.success.updating = true;

        // Update in main list
        const index = state.vitalSignsList.findIndex(
          (v) => v.id === action.payload.id
        );
        if (index !== -1) {
          state.vitalSignsList[index] = action.payload;
        }

        // Update selected vital signs
        if (state.selectedVitalSigns?.id === action.payload.id) {
          state.selectedVitalSigns = action.payload;
        }

        // Update in patient vitals
        const patientId = action.payload.patient_id;
        if (state.patientVitals[patientId]) {
          const patientIndex = state.patientVitals[patientId].findIndex(
            (v) => v.id === action.payload.id
          );
          if (patientIndex !== -1) {
            state.patientVitals[patientId][patientIndex] = action.payload;
          }
        }

        // Update in appointment vitals
        if (
          action.payload.appointment_id &&
          state.appointmentVitals[action.payload.appointment_id]
        ) {
          const appointmentIndex = state.appointmentVitals[
            action.payload.appointment_id
          ].findIndex((v) => v.id === action.payload.id);
          if (appointmentIndex !== -1) {
            state.appointmentVitals[action.payload.appointment_id][
              appointmentIndex
            ] = action.payload;
          }
        }
      })
      .addCase(updateVitalSigns.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload as string;
      })

      // Delete Vital Signs
      .addCase(deleteVitalSigns.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
        state.success.deleting = false;
      })
      .addCase(deleteVitalSigns.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.success.deleting = true;

        const deletedId = action.payload;

        // Remove from main list
        state.vitalSignsList = state.vitalSignsList.filter(
          (v) => v.id !== deletedId
        );

        // Clear selected if it was deleted
        if (state.selectedVitalSigns?.id === deletedId) {
          state.selectedVitalSigns = null;
        }

        // Remove from patient vitals
        Object.keys(state.patientVitals).forEach((patientId) => {
          state.patientVitals[Number(patientId)] = state.patientVitals[
            Number(patientId)
          ].filter((v) => v.id !== deletedId);
        });

        // Remove from appointment vitals
        Object.keys(state.appointmentVitals).forEach((appointmentId) => {
          state.appointmentVitals[Number(appointmentId)] =
            state.appointmentVitals[Number(appointmentId)].filter(
              (v) => v.id !== deletedId
            );
        });

        // Remove from recent vitals
        state.recentVitals = state.recentVitals.filter(
          (v) => v.id !== deletedId
        );
      })
      .addCase(deleteVitalSigns.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload as string;
      })

      // Fetch Patient Vital Signs
      .addCase(fetchPatientVitalSigns.pending, (state) => {
        state.loading.patient = true;
        state.error.patient = null;
      })
      .addCase(fetchPatientVitalSigns.fulfilled, (state, action) => {
        state.loading.patient = false;
        const patientId = action.payload.patient_id;
        state.patientVitals[patientId] = action.payload.vital_signs;
      })
      .addCase(fetchPatientVitalSigns.rejected, (state, action) => {
        state.loading.patient = false;
        state.error.patient = action.payload as string;
      })

      // Fetch Patient Vitals Summary
      .addCase(fetchPatientVitalsSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchPatientVitalsSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.patientSummaries[action.payload.patient_id] = action.payload;
      })
      .addCase(fetchPatientVitalsSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload as string;
      })

      // Fetch Patient Vitals Trends
      .addCase(fetchPatientVitalsTrends.pending, (state) => {
        state.loading.trends = true;
        state.error.trends = null;
      })
      .addCase(fetchPatientVitalsTrends.fulfilled, (state, action) => {
        state.loading.trends = false;
        const patientId = action.payload.patient_id;
        state.patientTrends[patientId] = action.payload.trends;
      })
      .addCase(fetchPatientVitalsTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error.trends = action.payload as string;
      })

      // Fetch Patient Latest Vitals
      .addCase(fetchPatientLatestVitals.pending, (state) => {
        state.loading.latest = true;
        state.error.latest = null;
      })
      .addCase(fetchPatientLatestVitals.fulfilled, (state, action) => {
        state.loading.latest = false;
        const { patient_id, vital_signs } = action.payload;
        state.patientLatestVitals[patient_id] = vital_signs;
      })
      .addCase(fetchPatientLatestVitals.rejected, (state, action) => {
        state.loading.latest = false;
        state.error.latest = action.payload as string;
      })

      // Fetch Appointment Vital Signs
      .addCase(fetchAppointmentVitalSigns.pending, (state) => {
        state.loading.appointment = true;
        state.error.appointment = null;
      })
      .addCase(fetchAppointmentVitalSigns.fulfilled, (state, action) => {
        state.loading.appointment = false;
        const { appointment_id, vital_signs } = action.payload;
        state.appointmentVitals[appointment_id] = vital_signs;
      })
      .addCase(fetchAppointmentVitalSigns.rejected, (state, action) => {
        state.loading.appointment = false;
        state.error.appointment = action.payload as string;
      })

      // Create Appointment Vital Signs
      .addCase(createAppointmentVitalSigns.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        state.success.creating = false;
      })
      .addCase(createAppointmentVitalSigns.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.success.creating = true;

        // Add to main list
        state.vitalSignsList.unshift(action.payload);

        // Add to appointment vitals
        if (action.payload.appointment_id) {
          if (!state.appointmentVitals[action.payload.appointment_id]) {
            state.appointmentVitals[action.payload.appointment_id] = [];
          }
          state.appointmentVitals[action.payload.appointment_id].unshift(
            action.payload
          );
        }

        // Add to patient vitals
        const patientId = action.payload.patient_id;
        if (!state.patientVitals[patientId]) {
          state.patientVitals[patientId] = [];
        }
        state.patientVitals[patientId].unshift(action.payload);

        // Update latest vitals
        state.patientLatestVitals[patientId] = action.payload;
      })
      .addCase(createAppointmentVitalSigns.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      })

      // Fetch Vitals Options
      .addCase(fetchVitalsOptions.pending, (state) => {
        state.loading.options = true;
        state.error.options = null;
      })
      .addCase(fetchVitalsOptions.fulfilled, (state, action) => {
        state.loading.options = false;
        state.vitalsOptions = action.payload;
      })
      .addCase(fetchVitalsOptions.rejected, (state, action) => {
        state.loading.options = false;
        state.error.options = action.payload as string;
      })

      // Fetch Vitals Alerts
      .addCase(fetchVitalsAlerts.pending, (state) => {
        state.loading.alerts = true;
        state.error.alerts = null;
      })
      .addCase(fetchVitalsAlerts.fulfilled, (state, action) => {
        state.loading.alerts = false;
        state.vitalsAlerts = action.payload;
      })
      .addCase(fetchVitalsAlerts.rejected, (state, action) => {
        state.loading.alerts = false;
        state.error.alerts = action.payload as string;
      })

      // Fetch Recent Vitals
      .addCase(fetchRecentVitals.pending, (state) => {
        state.loading.recent = true;
        state.error.recent = null;
      })
      .addCase(fetchRecentVitals.fulfilled, (state, action) => {
        state.loading.recent = false;
        state.recentVitals = action.payload.vital_signs;
      })
      .addCase(fetchRecentVitals.rejected, (state, action) => {
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
  clearSelectedVitalSigns,
  clearPatientData,
  clearAppointmentData,
  resetVitalsState,
} = vitalsSlice.actions;

// Selectors
export const selectVitalsState = (state: { vitals: VitalsState }) =>
  state.vitals;

export const selectVitalSignsList = (state: { vitals: VitalsState }) =>
  state.vitals.vitalSignsList;

export const selectSelectedVitalSigns = (state: { vitals: VitalsState }) =>
  state.vitals.selectedVitalSigns;

export const selectPatientVitals = (
  state: { vitals: VitalsState },
  patientId: number
) => state.vitals.patientVitals[patientId] || [];

export const selectPatientSummary = (
  state: { vitals: VitalsState },
  patientId: number
) => state.vitals.patientSummaries[patientId];

export const selectPatientTrends = (
  state: { vitals: VitalsState },
  patientId: number
) => state.vitals.patientTrends[patientId] || [];

export const selectPatientLatestVitals = (
  state: { vitals: VitalsState },
  patientId: number
) => state.vitals.patientLatestVitals[patientId];

export const selectAppointmentVitals = (
  state: { vitals: VitalsState },
  appointmentId: number
) => state.vitals.appointmentVitals[appointmentId] || [];

export const selectVitalsOptions = (state: { vitals: VitalsState }) =>
  state.vitals.vitalsOptions;

export const selectVitalsAlerts = (state: { vitals: VitalsState }) =>
  state.vitals.vitalsAlerts;

export const selectRecentVitals = (state: { vitals: VitalsState }) =>
  state.vitals.recentVitals;

export const selectVitalsPagination = (state: { vitals: VitalsState }) =>
  state.vitals.pagination;

export const selectVitalsLoading = (state: { vitals: VitalsState }) =>
  state.vitals.loading;

export const selectVitalsError = (state: { vitals: VitalsState }) =>
  state.vitals.error;

export const selectVitalsSuccess = (state: { vitals: VitalsState }) =>
  state.vitals.success;

// Complex selectors
export const selectVitalsByPatientId = (
  state: { vitals: VitalsState },
  patientId: number
) =>
  state.vitals.vitalSignsList.filter((vital) => vital.patient_id === patientId);

export const selectVitalsByAppointmentId = (
  state: { vitals: VitalsState },
  appointmentId: number
) =>
  state.vitals.vitalSignsList.filter(
    (vital) => vital.appointment_id === appointmentId
  );

export const selectCriticalVitalsAlerts = (state: { vitals: VitalsState }) =>
  state.vitals.vitalsAlerts.filter((alert) => alert.severity === "critical");

export const selectHighPriorityVitalsAlerts = (state: {
  vitals: VitalsState;
}) =>
  state.vitals.vitalsAlerts.filter(
    (alert) => alert.severity === "critical" || alert.severity === "high"
  );

export const selectIsVitalsLoading = (state: { vitals: VitalsState }) =>
  Object.values(state.vitals.loading).some((loading) => loading);

export const selectHasVitalsError = (state: { vitals: VitalsState }) =>
  Object.values(state.vitals.error).some((error) => error !== null);

export default vitalsSlice.reducer;
