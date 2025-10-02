// app/redux/features/assessments/assessmentActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";
import type {
  Assessment,
  CreateAssessmentData,
  UpdateAssessmentData,
  AssessmentSummary,
  AssessmentTrends,
  FetchAssessmentsParams,
} from "./assessmentSlice";

// Create a new assessment
export const createAssessment = createAsyncThunk<
  Assessment,
  CreateAssessmentData,
  { rejectValue: string }
>("assessments/create", async (assessmentData, { rejectWithValue }) => {
  try {
    const response = await api.post("/assessments", assessmentData);
    return response.data.assessment;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to create assessment"
    );
  }
});

// Fetch a list of assessments
export const getAssessments = createAsyncThunk<
  { assessments: Assessment[]; pagination: any },
  FetchAssessmentsParams,
  { rejectValue: string }
>("assessments/getAssessments", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get("/assessments", { params });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch assessments"
    );
  }
});

// Fetch a single assessment by ID
export const getAssessmentById = createAsyncThunk<
  Assessment,
  number,
  { rejectValue: string }
>(
  "assessments/getAssessmentById",
  async (assessmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assessments/${assessmentId}`);
      return response.data.assessment;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch assessment details"
      );
    }
  }
);

// Update an existing assessment
export const updateAssessment = createAsyncThunk<
  Assessment,
  { assessmentId: number; data: UpdateAssessmentData },
  { rejectValue: string }
>("assessments/update", async ({ assessmentId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/assessments/${assessmentId}`, data);
    return response.data.assessment;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to update assessment"
    );
  }
});

// Delete an assessment
export const deleteAssessment = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("assessments/delete", async (assessmentId, { rejectWithValue }) => {
  try {
    await api.delete(`/assessments/${assessmentId}`);
    return assessmentId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete assessment"
    );
  }
});

// --- Patient-specific Assessment Actions ---

// Fetch all assessments for a specific patient
export const getPatientAssessments = createAsyncThunk<
  { assessments: Assessment[]; pagination: any },
  { patientId: number; params?: FetchAssessmentsParams },
  { rejectValue: string }
>(
  "assessments/getPatientAssessments",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patients/${patientId}/assessments`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch patient assessments"
      );
    }
  }
);

// Fetch assessment summary for a patient
export const getPatientAssessmentSummary = createAsyncThunk<
  AssessmentSummary,
  number,
  { rejectValue: string }
>(
  "assessments/getPatientAssessmentSummary",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/patients/${patientId}/assessments/summary`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch assessment summary"
      );
    }
  }
);

// Fetch assessment trends for a patient
export const getPatientAssessmentTrends = createAsyncThunk<
  AssessmentTrends,
  { patientId: number; days?: number; assessment_type?: string },
  { rejectValue: string }
>(
  "assessments/getPatientAssessmentTrends",
  async ({ patientId, ...params }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/patients/${patientId}/assessments/trends`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch assessment trends"
      );
    }
  }
);

// Fetch the latest assessment for a patient
export const getPatientLatestAssessment = createAsyncThunk<
  Assessment | null,
  number,
  { rejectValue: string }
>(
  "assessments/getPatientLatestAssessment",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/patients/${patientId}/assessments/latest`
      );
      // The endpoint returns a paginated list with one item
      return response.data.assessments?.[0] || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch latest assessment"
      );
    }
  }
);
