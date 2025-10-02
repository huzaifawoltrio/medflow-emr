// app/redux/features/assessments/assessmentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getPatientAssessments,
  getPatientAssessmentSummary,
  getPatientAssessmentTrends,
  getPatientLatestAssessment,
} from "./assessmentActions";

export interface Assessment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  assessment_type: "phq9" | "gad7" | "pcl5";
  assessment_date: string;
  total_score: number;
  severity_level: string;
  interpretation: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentData {
  patient_id: number;
  assessment_type: "phq9" | "gad7" | "pcl5";
  total_score: number;
  assessment_date?: string;
}

export interface UpdateAssessmentData {
  total_score?: number;
  assessment_date?: string;
}

export interface AssessmentSummary {
  patient_id: number;
  total_assessments: number;
  by_type: {
    [key: string]: {
      latest: Assessment;
      assessment_info: any;
    };
  };
  attention_required: Assessment[];
}

export interface AssessmentTrends {
  patient_id: number;
  period_days: number;
  trends: {
    [key: string]: any;
  };
  graph_data: any[];
}

export interface FetchAssessmentsParams {
  patient_id?: number;
  assessment_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

interface AssessmentState {
  assessments: Assessment[];
  patientAssessments: { [patientId: number]: Assessment[] };
  patientSummary: AssessmentSummary | null;
  patientTrends: AssessmentTrends | null;
  selectedAssessment: Assessment | null;
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: AssessmentState = {
  assessments: [],
  patientAssessments: {},
  patientSummary: null,
  patientTrends: null,
  selectedAssessment: null,
  loading: false,
  error: null,
  pagination: null,
};

const assessmentSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    clearAssessments: (state) => {
      state.assessments = [];
      state.pagination = null;
    },
    clearPatientData: (state) => {
      state.patientAssessments = {};
      state.patientSummary = null;
      state.patientTrends = null;
    },
  },
  extraReducers: (builder) => {
    // Generic pending/rejected handlers
    const pendingHandler = (state: AssessmentState) => {
      state.loading = true;
      state.error = null;
    };
    const rejectedHandler = (
      state: AssessmentState,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // createAssessment
      .addCase(createAssessment.pending, pendingHandler)
      .addCase(
        createAssessment.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.loading = false;
          state.assessments.unshift(action.payload);
          const { patient_id } = action.payload;
          if (state.patientAssessments[patient_id]) {
            state.patientAssessments[patient_id].unshift(action.payload);
          }
        }
      )
      .addCase(createAssessment.rejected, rejectedHandler)

      // getAssessments
      .addCase(getAssessments.pending, pendingHandler)
      .addCase(getAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = action.payload.assessments;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAssessments.rejected, rejectedHandler)

      // getAssessmentById
      .addCase(getAssessmentById.pending, pendingHandler)
      .addCase(
        getAssessmentById.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.loading = false;
          state.selectedAssessment = action.payload;
        }
      )
      .addCase(getAssessmentById.rejected, rejectedHandler)

      // updateAssessment
      .addCase(updateAssessment.pending, pendingHandler)
      .addCase(
        updateAssessment.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.loading = false;
          const index = state.assessments.findIndex(
            (a) => a.id === action.payload.id
          );
          if (index !== -1) {
            state.assessments[index] = action.payload;
          }
          const { patient_id } = action.payload;
          if (state.patientAssessments[patient_id]) {
            const patientIndex = state.patientAssessments[patient_id].findIndex(
              (a) => a.id === action.payload.id
            );
            if (patientIndex !== -1) {
              state.patientAssessments[patient_id][patientIndex] =
                action.payload;
            }
          }
          if (state.selectedAssessment?.id === action.payload.id) {
            state.selectedAssessment = action.payload;
          }
        }
      )
      .addCase(updateAssessment.rejected, rejectedHandler)

      // deleteAssessment
      .addCase(deleteAssessment.pending, pendingHandler)
      .addCase(
        deleteAssessment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.assessments = state.assessments.filter(
            (a) => a.id !== action.payload
          );
          Object.keys(state.patientAssessments).forEach((patientId) => {
            state.patientAssessments[Number(patientId)] =
              state.patientAssessments[Number(patientId)].filter(
                (a) => a.id !== action.payload
              );
          });
        }
      )
      .addCase(deleteAssessment.rejected, rejectedHandler)

      // getPatientAssessments
      .addCase(getPatientAssessments.pending, pendingHandler)
      .addCase(getPatientAssessments.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.assessments.length > 0) {
          const patientId = action.payload.assessments[0].patient_id;
          state.patientAssessments[patientId] = action.payload.assessments;
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(getPatientAssessments.rejected, rejectedHandler)

      // getPatientAssessmentSummary
      .addCase(getPatientAssessmentSummary.pending, pendingHandler)
      .addCase(
        getPatientAssessmentSummary.fulfilled,
        (state, action: PayloadAction<AssessmentSummary>) => {
          state.loading = false;
          state.patientSummary = action.payload;
        }
      )
      .addCase(getPatientAssessmentSummary.rejected, rejectedHandler)

      // getPatientAssessmentTrends
      .addCase(getPatientAssessmentTrends.pending, pendingHandler)
      .addCase(
        getPatientAssessmentTrends.fulfilled,
        (state, action: PayloadAction<AssessmentTrends>) => {
          state.loading = false;
          state.patientTrends = action.payload;
        }
      )
      .addCase(getPatientAssessmentTrends.rejected, rejectedHandler)

      // getPatientLatestAssessment
      .addCase(getPatientLatestAssessment.pending, pendingHandler)
      .addCase(
        getPatientLatestAssessment.fulfilled,
        (state, action: PayloadAction<Assessment | null>) => {
          state.loading = false;
          if (action.payload) {
            // You might want a dedicated field for latest assessment
            // For now, just updating the selected one
            state.selectedAssessment = action.payload;
          }
        }
      )
      .addCase(getPatientLatestAssessment.rejected, rejectedHandler);
  },
});

export const { clearAssessments, clearPatientData } = assessmentSlice.actions;

export default assessmentSlice.reducer;
