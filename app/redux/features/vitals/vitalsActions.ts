// redux/features/vitals/vitalsActions.ts (Improved Version)
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define types for vital signs data
export interface VitalSigns {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  systolic_bp?: string;
  diastolic_bp?: string;
  heart_rate?: string;
  temperature?: string;
  temperature_unit?: string;
  respiratory_rate?: string;
  oxygen_saturation?: string;
  weight?: string;
  weight_unit?: string;
  height?: string;
  height_unit?: string;
  bmi?: string;
  pain_level?: number;
  pain_location?: string;
  pain_description?: string;
  notes?: string;
  recorded_date: string;
  created_at: string;
  updated_at: string;
  // Formatted fields
  blood_pressure?: string;
  temperature_formatted?: string;
  heart_rate_formatted?: string;
  respiratory_rate_formatted?: string;
  oxygen_saturation_formatted?: string;
}

export interface CreateVitalSignsData {
  patient_id: number;
  appointment_id?: number;
  systolic_bp?: string;
  diastolic_bp?: string;
  heart_rate?: string;
  temperature?: string;
  temperature_unit?: string;
  respiratory_rate?: string;
  oxygen_saturation?: string;
  weight?: string;
  weight_unit?: string;
  height?: string;
  height_unit?: string;
  pain_level?: number;
  pain_location?: string;
  pain_description?: string;
  notes?: string;
  recorded_date?: string;
}

export interface VitalsFilters {
  patient_id?: number;
  appointment_id?: number;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  page?: number;
}

export interface VitalsSummary {
  patient_id: number;
  total_records: number;
  latest_vitals: VitalSigns;
  averages: {
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    temperature?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    weight?: number;
    bmi?: number;
  };
  trends: {
    [key: string]: "increasing" | "decreasing" | "stable";
  };
}

export interface VitalsTrendData {
  date: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  bmi?: number;
  pain_level?: number;
}

export interface VitalsOptions {
  temperature_units: string[];
  weight_units: string[];
  height_units: string[];
  vital_ranges: {
    [key: string]: {
      normal_min: number;
      normal_max: number;
      critical_min: number;
      critical_max: number;
    };
  };
}

export interface VitalsAlert {
  id: number;
  patient_id: number;
  patient_name: string;
  vital_type: string;
  value: number;
  severity: "critical" | "high" | "low";
  recorded_date: string;
}

/**
 * Create new vital signs record
 */
export const createVitalSigns = createAsyncThunk<
  VitalSigns,
  CreateVitalSignsData,
  { rejectValue: string }
>("vitals/create", async (vitalsData, { rejectWithValue }) => {
  try {
    const response = await api.post("/vital-signs", vitalsData);
    return response.data.vital_signs;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to create vital signs"
    );
  }
});

/**
 * Fetch vital signs with optional filters
 */
export const fetchVitalSigns = createAsyncThunk<
  { vital_signs: VitalSigns[]; total: number; page: number; per_page: number },
  VitalsFilters,
  { rejectValue: string }
>("vitals/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/vital-signs?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch vital signs"
    );
  }
});

/**
 * Fetch vital signs by ID
 */
export const fetchVitalSignsById = createAsyncThunk<
  VitalSigns,
  number,
  { rejectValue: string }
>("vitals/fetchById", async (vitalSignsId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/vital-signs/${vitalSignsId}`);
    return response.data.vital_signs;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch vital signs"
    );
  }
});

/**
 * Update vital signs record
 */
export const updateVitalSigns = createAsyncThunk<
  VitalSigns,
  { id: number; data: Partial<CreateVitalSignsData> },
  { rejectValue: string }
>("vitals/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/vital-signs/${id}`, data);
    return response.data.vital_signs;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to update vital signs"
    );
  }
});

/**
 * Delete vital signs record
 */
export const deleteVitalSigns = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("vitals/delete", async (vitalSignsId, { rejectWithValue }) => {
  try {
    await api.delete(`/vital-signs/${vitalSignsId}`);
    return vitalSignsId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete vital signs"
    );
  }
});

/**
 * Fetch patient vital signs
 */
export const fetchPatientVitalSigns = createAsyncThunk<
  { vital_signs: VitalSigns[]; total: number; patient_id: number },
  { patientId: number; filters?: Omit<VitalsFilters, "patient_id"> },
  { rejectValue: string }
>(
  "vitals/fetchPatientVitals",
  async ({ patientId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(
        `/patients/${patientId}/vital-signs?${params.toString()}`
      );
      return {
        ...response.data,
        patient_id: patientId, // Include patient_id for proper state management
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch patient vital signs"
      );
    }
  }
);

/**
 * Fetch patient vitals summary
 */
export const fetchPatientVitalsSummary = createAsyncThunk<
  VitalsSummary,
  number,
  { rejectValue: string }
>("vitals/fetchPatientSummary", async (patientId, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/patients/${patientId}/vital-signs/summary`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient vitals summary"
    );
  }
});

/**
 * Fetch patient vitals trends
 */
export const fetchPatientVitalsTrends = createAsyncThunk<
  { trends: VitalsTrendData[]; patient_id: number },
  { patientId: number; startDate?: string; endDate?: string },
  { rejectValue: string }
>(
  "vitals/fetchPatientTrends",
  async ({ patientId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await api.get(
        `/patients/${patientId}/vital-signs/trends?${params.toString()}`
      );
      return {
        trends: response.data.trends,
        patient_id: patientId,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch patient vitals trends"
      );
    }
  }
);

/**
 * Fetch latest patient vital signs
 */
export const fetchPatientLatestVitals = createAsyncThunk<
  { vital_signs: VitalSigns | null; patient_id: number },
  number,
  { rejectValue: string }
>("vitals/fetchPatientLatest", async (patientId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/patients/${patientId}/vital-signs/latest`);
    return {
      vital_signs: response.data.vital_signs?.[0] || null,
      patient_id: patientId,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch latest vital signs"
    );
  }
});

/**
 * Fetch appointment vital signs
 */
export const fetchAppointmentVitalSigns = createAsyncThunk<
  { vital_signs: VitalSigns[]; appointment_id: number },
  number,
  { rejectValue: string }
>(
  "vitals/fetchAppointmentVitals",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/appointments/${appointmentId}/vital-signs`
      );
      return {
        vital_signs: response.data.vital_signs,
        appointment_id: appointmentId,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch appointment vital signs"
      );
    }
  }
);

/**
 * Create vital signs for appointment
 */
export const createAppointmentVitalSigns = createAsyncThunk<
  VitalSigns,
  { appointmentId: number; data: Omit<CreateVitalSignsData, "appointment_id"> },
  { rejectValue: string }
>(
  "vitals/createAppointmentVitals",
  async ({ appointmentId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/appointments/${appointmentId}/vital-signs`,
        data
      );
      return response.data.vital_signs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create appointment vital signs"
      );
    }
  }
);

/**
 * Fetch vitals options (units, ranges, etc.)
 */
export const fetchVitalsOptions = createAsyncThunk<
  VitalsOptions,
  void,
  { rejectValue: string }
>("vitals/fetchOptions", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/vital-signs/options");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch vitals options"
    );
  }
});

/**
 * Fetch vitals alerts for doctor
 */
export const fetchVitalsAlerts = createAsyncThunk<
  VitalsAlert[],
  void,
  { rejectValue: string }
>("vitals/fetchAlerts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/doctors/my-patients/vital-signs/alerts");
    return response.data.alerts;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch vitals alerts"
    );
  }
});

/**
 * Fetch recent vital signs for doctor's patients
 */
export const fetchRecentVitals = createAsyncThunk<
  { vital_signs: VitalSigns[]; total: number },
  { per_page?: number },
  { rejectValue: string }
>("vitals/fetchRecent", async ({ per_page = 20 }, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/doctors/my-patients/vital-signs/recent?per_page=${per_page}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch recent vital signs"
    );
  }
});

// Utility functions for vital signs validation
export const validateVitalSigns = (
  data: Partial<CreateVitalSignsData>
): string[] => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.patient_id) {
    errors.push("Patient ID is required");
  }

  // Basic range validation
  if (
    data.systolic_bp &&
    (parseInt(data.systolic_bp) < 50 || parseInt(data.systolic_bp) > 250)
  ) {
    errors.push("Systolic blood pressure must be between 50 and 250 mmHg");
  }

  if (
    data.diastolic_bp &&
    (parseInt(data.diastolic_bp) < 30 || parseInt(data.diastolic_bp) > 150)
  ) {
    errors.push("Diastolic blood pressure must be between 30 and 150 mmHg");
  }

  if (
    data.heart_rate &&
    (parseInt(data.heart_rate) < 30 || parseInt(data.heart_rate) > 200)
  ) {
    errors.push("Heart rate must be between 30 and 200 bpm");
  }

  if (data.temperature && data.temperature_unit) {
    const temp = parseFloat(data.temperature);
    if (
      data.temperature_unit.toLowerCase() === "f" &&
      (temp < 80 || temp > 110)
    ) {
      errors.push(
        "Temperature (Fahrenheit) must be between 80 and 110 degrees"
      );
    } else if (
      data.temperature_unit.toLowerCase() === "c" &&
      (temp < 26 || temp > 43)
    ) {
      errors.push("Temperature (Celsius) must be between 26 and 43 degrees");
    }
  }

  if (
    data.respiratory_rate &&
    (parseInt(data.respiratory_rate) < 5 ||
      parseInt(data.respiratory_rate) > 40)
  ) {
    errors.push("Respiratory rate must be between 5 and 40 breaths per minute");
  }

  if (
    data.oxygen_saturation &&
    (parseInt(data.oxygen_saturation) < 70 ||
      parseInt(data.oxygen_saturation) > 100)
  ) {
    errors.push("Oxygen saturation must be between 70 and 100 percent");
  }

  if (data.pain_level && (data.pain_level < 0 || data.pain_level > 10)) {
    errors.push("Pain level must be between 0 and 10");
  }

  return errors;
};

// Helper function to format vital signs for display
export const formatVitalSigns = (vitals: VitalSigns): Partial<VitalSigns> => {
  const formatted: Partial<VitalSigns> = { ...vitals };

  // Format blood pressure
  if (vitals.systolic_bp && vitals.diastolic_bp) {
    formatted.blood_pressure = `${vitals.systolic_bp}/${vitals.diastolic_bp}`;
  }

  // Format temperature
  if (vitals.temperature && vitals.temperature_unit) {
    formatted.temperature_formatted = `${vitals.temperature}°${vitals.temperature_unit}`;
  }

  // Format heart rate
  if (vitals.heart_rate) {
    formatted.heart_rate_formatted = `${vitals.heart_rate} bpm`;
  }

  // Format respiratory rate
  if (vitals.respiratory_rate) {
    formatted.respiratory_rate_formatted = `${vitals.respiratory_rate} rpm`;
  }

  // Format oxygen saturation
  if (vitals.oxygen_saturation) {
    formatted.oxygen_saturation_formatted = `${vitals.oxygen_saturation}%`;
  }

  return formatted;
};
