// redux/features/medications/medicationActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define types for medication data
interface CreateMedicationRequest {
  patient_id: number;
  generic_name: string;
  brand_name?: string;
  strength: string;
  route_of_administration: string;
  frequency: string;
  sig_instructions: string;
  duration_days: string;
  quantity_prescribed: string;
  refills_allowed: string;
  indication: string;
  notes?: string;
  start_date: string;
  end_date?: string;
  status: "active" | "inactive" | "discontinued";
  priority: "routine" | "urgent" | "stat";
  appointment_id?: number;
}

interface UpdateMedicationRequest {
  generic_name?: string;
  brand_name?: string;
  strength?: string;
  route_of_administration?: string;
  frequency?: string;
  sig_instructions?: string;
  duration_days?: string;
  quantity_prescribed?: string;
  refills_allowed?: string;
  indication?: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
  status?: "active" | "inactive" | "discontinued";
  priority?: "routine" | "urgent" | "stat";
  change_reason: string;
}

interface Medication {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  generic_name: string;
  brand_name?: string;
  strength: string;
  route_of_administration: string;
  frequency: string;
  sig_instructions: string;
  duration_days: string;
  quantity_prescribed: string;
  refills_allowed: string;
  indication: string;
  notes?: string;
  start_date: string;
  end_date?: string;
  status: "active" | "inactive" | "discontinued";
  priority: "routine" | "urgent" | "stat";
  date_prescribed: string;
  discontinued_at?: string;
  discontinued_reason?: string;
  created_at: string;
  updated_at: string;
}

interface MedicationListResponse {
  medications: Medication[];
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
}

interface FetchMedicationsParams {
  patient_id?: number;
  status?: "active" | "inactive" | "discontinued";
  page?: number;
  per_page?: number;
}

/**
 * Create a new medication
 */
export const createMedication = createAsyncThunk<
  Medication,
  CreateMedicationRequest,
  { rejectValue: string }
>("medications/create", async (medicationData, { rejectWithValue }) => {
  try {
    const response = await api.post<Medication>("/medications", medicationData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to create medication");
    }
  }
});

/**
 * Fetch medications with optional filters
 */
export const fetchMedications = createAsyncThunk<
  MedicationListResponse,
  FetchMedicationsParams,
  { rejectValue: string }
>("medications/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.patient_id)
      queryParams.append("patient_id", params.patient_id.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const response = await api.get<MedicationListResponse>(
      `/medications?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to fetch medications");
    }
  }
});

/**
 * Fetch a single medication by ID
 */
export const fetchMedicationById = createAsyncThunk<
  Medication,
  number,
  { rejectValue: string }
>("medications/fetchById", async (medicationId, { rejectWithValue }) => {
  try {
    const response = await api.get<Medication>(`/medications/${medicationId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to fetch medication");
    }
  }
});

/**
 * Update a medication
 */
export const updateMedication = createAsyncThunk<
  Medication,
  { id: number; data: UpdateMedicationRequest },
  { rejectValue: string }
>("medications/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<Medication>(`/medications/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message || "Failed to update medication");
    }
  }
});

/**
 * Discontinue a medication
 */
export const discontinueMedication = createAsyncThunk<
  { id: number; message: string },
  { id: number; reason: string },
  { rejectValue: string }
>("medications/discontinue", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/medications/${id}`, {
      data: { reason },
    });
    return {
      id,
      message: response.data.message || "Medication discontinued successfully",
    };
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(
        error.message || "Failed to discontinue medication"
      );
    }
  }
});

/**
 * Fetch patient-specific medications
 */
export const fetchPatientMedications = createAsyncThunk<
  MedicationListResponse,
  number,
  { rejectValue: string }
>(
  "medications/fetchPatientMedications",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get<MedicationListResponse>(
        `/patients/${patientId}/medications`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          error.message || "Failed to fetch patient medications"
        );
      }
    }
  }
);

// Export types for use in other files
export type {
  Medication,
  CreateMedicationRequest,
  UpdateMedicationRequest,
  MedicationListResponse,
  FetchMedicationsParams,
};
