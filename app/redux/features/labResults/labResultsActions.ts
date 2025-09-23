// redux/features/labResults/labResultsActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define interfaces based on the API responses
export interface LabValues {
  hemoglobin?: number | null;
  glucose?: number | null;
  creatinine?: number | null;
  wbc?: number | null;
  alt?: number | null;
  total_cholesterol?: number | null;
}

export interface LabResult {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number | null;
  test_date: string;
  lab_values: LabValues;
  present_values: string[];
  values_count: number;
  status: "pending" | "final" | "cancelled";
  is_critical: boolean;
  lab_facility?: string | null;
  lab_order_number?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GraphLabResult {
  id: number;
  date: string;
  timestamp: number;
  values: LabValues;
  status: "pending" | "final" | "cancelled";
  is_critical: boolean;
}

export interface CreateLabResultData {
  patient_id: number;
  appointment_id?: number;
  test_date: string;
  hemoglobin?: number;
  glucose?: number;
  creatinine?: number;
  wbc?: number;
  alt?: number;
  total_cholesterol?: number;
  status?: "pending" | "final" | "cancelled";
  lab_facility?: string;
  lab_order_number?: string;
  notes?: string;
}

export interface LabResultsResponse {
  lab_results: LabResult[];
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
  filters_applied: {
    patient_id: number;
    status: string;
    critical_only: boolean;
    date_range: string | null;
    test_types: string[];
  };
  format: string;
}

export interface GraphLabResultsResponse {
  lab_results: GraphLabResult[];
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
  filters_applied: {
    patient_id: number;
    status: string;
    critical_only: boolean;
    date_range: string | null;
    test_types: string[];
  };
  format: string;
}

export interface CreateLabResultResponse {
  lab_result: LabResult;
  message: string;
  provided_values: string[];
}

export interface LabResultsFilters {
  patient_id?: number;
  status?: "all" | "pending" | "final" | "cancelled";
  critical_only?: boolean;
  start_date?: string;
  end_date?: string;
  test_types?: string[];
  page?: number;
  per_page?: number;
}

/**
 * Create a new lab result
 */
export const createLabResult = createAsyncThunk<
  CreateLabResultResponse,
  CreateLabResultData,
  { rejectValue: string }
>("labResults/create", async (labResultData, { rejectWithValue }) => {
  try {
    const response = await api.post<CreateLabResultResponse>(
      "/lab-results",
      labResultData
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to create lab result");
    }
  }
});

/**
 * Fetch lab results for a specific patient
 */
export const fetchPatientLabResults = createAsyncThunk<
  LabResultsResponse,
  { patientId: number; filters?: Omit<LabResultsFilters, "patient_id"> },
  { rejectValue: string }
>(
  "labResults/fetchPatientResults",
  async ({ patientId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.critical_only) {
        params.append("critical_only", "true");
      }
      if (filters.start_date) {
        params.append("start_date", filters.start_date);
      }
      if (filters.end_date) {
        params.append("end_date", filters.end_date);
      }
      if (filters.test_types && filters.test_types.length > 0) {
        filters.test_types.forEach((type) => params.append("test_types", type));
      }
      if (filters.page) {
        params.append("page", filters.page.toString());
      }
      if (filters.per_page) {
        params.append("per_page", filters.per_page.toString());
      }

      const queryString = params.toString();
      const url = `/patients/${patientId}/lab-results${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<LabResultsResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          error.message || "Failed to fetch patient lab results"
        );
      }
    }
  }
);

/**
 * Fetch lab results for graphing (patient-specific)
 */
export const fetchPatientLabResultsGraph = createAsyncThunk<
  GraphLabResultsResponse,
  { patientId: number; filters?: Omit<LabResultsFilters, "patient_id"> },
  { rejectValue: string }
>(
  "labResults/fetchPatientResultsGraph",
  async ({ patientId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.critical_only) {
        params.append("critical_only", "true");
      }
      if (filters.start_date) {
        params.append("start_date", filters.start_date);
      }
      if (filters.end_date) {
        params.append("end_date", filters.end_date);
      }
      if (filters.test_types && filters.test_types.length > 0) {
        filters.test_types.forEach((type) => params.append("test_types", type));
      }
      if (filters.page) {
        params.append("page", filters.page.toString());
      }
      if (filters.per_page) {
        params.append("per_page", filters.per_page.toString());
      }

      const queryString = params.toString();
      const url = `/patients/${patientId}/lab-results/graph${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<GraphLabResultsResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          error.message || "Failed to fetch patient lab results for graph"
        );
      }
    }
  }
);

/**
 * Fetch a specific lab result by ID
 */
export const fetchLabResultById = createAsyncThunk<
  LabResult,
  number,
  { rejectValue: string }
>("labResults/fetchById", async (labResultId, { rejectWithValue }) => {
  try {
    const response = await api.get<{ lab_result: LabResult }>(
      `/lab-results/${labResultId}`
    );
    return response.data.lab_result;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to fetch lab result");
    }
  }
});

/**
 * Update a lab result
 */
export const updateLabResult = createAsyncThunk<
  LabResult,
  { id: number; data: Partial<CreateLabResultData> },
  { rejectValue: string }
>("labResults/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<{ lab_result: LabResult }>(
      `/lab-results/${id}`,
      data
    );
    return response.data.lab_result;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to update lab result");
    }
  }
});

/**
 * Delete a lab result
 */
export const deleteLabResult = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("labResults/delete", async (labResultId, { rejectWithValue }) => {
  try {
    await api.delete(`/lab-results/${labResultId}`);
    return labResultId;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to delete lab result");
    }
  }
});

/**
 * Fetch critical lab results for doctor's patients
 */
export const fetchCriticalLabResults = createAsyncThunk<
  { lab_results: LabResult[]; total: number },
  { per_page?: number },
  { rejectValue: string }
>(
  "labResults/fetchCritical",
  async ({ per_page = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/doctors/my-patients/lab-results/critical?per_page=${per_page}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          error.message || "Failed to fetch critical lab results"
        );
      }
    }
  }
);

/**
 * Fetch recent lab results for doctor's patients
 */
export const fetchRecentLabResults = createAsyncThunk<
  { lab_results: LabResult[]; total: number },
  { per_page?: number },
  { rejectValue: string }
>("labResults/fetchRecent", async ({ per_page = 20 }, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/doctors/my-patients/lab-results/recent?per_page=${per_page}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(
        error.message || "Failed to fetch recent lab results"
      );
    }
  }
});

// Utility functions for lab results validation
export const validateLabResult = (
  data: Partial<CreateLabResultData>
): string[] => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.patient_id) {
    errors.push("Patient ID is required");
  }

  if (!data.test_date) {
    errors.push("Test date is required");
  }

  // At least one lab value should be provided
  const labValues = [
    data.hemoglobin,
    data.glucose,
    data.creatinine,
    data.wbc,
    data.alt,
    data.total_cholesterol,
  ];

  if (labValues.every((value) => value === undefined || value === null)) {
    errors.push("At least one lab value must be provided");
  }

  // Validate individual lab values ranges (basic validation)
  if (data.hemoglobin !== undefined && data.hemoglobin !== null) {
    if (data.hemoglobin < 5 || data.hemoglobin > 20) {
      errors.push("Hemoglobin must be between 5 and 20 g/dL");
    }
  }

  if (data.glucose !== undefined && data.glucose !== null) {
    if (data.glucose < 50 || data.glucose > 500) {
      errors.push("Glucose must be between 50 and 500 mg/dL");
    }
  }

  if (data.creatinine !== undefined && data.creatinine !== null) {
    if (data.creatinine < 0.5 || data.creatinine > 10) {
      errors.push("Creatinine must be between 0.5 and 10 mg/dL");
    }
  }

  if (data.wbc !== undefined && data.wbc !== null) {
    if (data.wbc < 1 || data.wbc > 50) {
      errors.push("WBC must be between 1 and 50 thousand/μL");
    }
  }

  if (data.alt !== undefined && data.alt !== null) {
    if (data.alt < 5 || data.alt > 200) {
      errors.push("ALT must be between 5 and 200 U/L");
    }
  }

  if (data.total_cholesterol !== undefined && data.total_cholesterol !== null) {
    if (data.total_cholesterol < 100 || data.total_cholesterol > 400) {
      errors.push("Total cholesterol must be between 100 and 400 mg/dL");
    }
  }

  return errors;
};

// Helper function to determine if lab values are critical
export const isLabValueCritical = (
  labValue: string,
  value: number
): boolean => {
  const criticalRanges: { [key: string]: { min: number; max: number } } = {
    hemoglobin: { min: 7, max: 18 },
    glucose: { min: 70, max: 200 },
    creatinine: { min: 0.6, max: 1.3 },
    wbc: { min: 4, max: 11 },
    alt: { min: 7, max: 56 },
    total_cholesterol: { min: 0, max: 240 },
  };

  const range = criticalRanges[labValue];
  if (!range) return false;

  return value < range.min || value > range.max;
};

// Helper function to format lab results for display
export const formatLabResult = (labResult: LabResult): Partial<LabResult> => {
  const formatted: Partial<LabResult> = { ...labResult };

  // Add any specific formatting logic here if needed
  // For example, rounding numbers, formatting dates, etc.

  return formatted;
};
