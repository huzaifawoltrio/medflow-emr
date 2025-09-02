// redux/features/patient/patientActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig";

// Define the type for the patient data
interface Patient {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  insurance_provider: string;
  policy_number: string;
  group_number: string;
  policy_holder_name: string;
  policy_holder_date_of_birth: string;
  relationship_to_patient: string;
  primary_care_physician: string;
  allergies: string;
  current_medications: string;
  previous_surgeries: string;
  family_medical_history: string;
  smoking_status: string;
  alcohol_consumption: string;
  exercise_frequency: string;
  chief_complaint: string;
  symptoms_duration: string;
  current_pain_level: number;
  additional_notes: string;
  profile_picture_url?: string;
}

// Extended interface for detailed patient data
interface DetailedPatient extends Patient {
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_login: string;
  previous_treatment_for_condition: string;
}

/**
 * Async thunk for fetching patients.
 * It returns an array of patients on success.
 */
export const fetchPatients = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>("patient/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/patients");
    return response.data.patients;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

/**
 * Async thunk for fetching detailed patients.
 * It returns an array of detailed patient objects on success.
 */
export const fetchDetailedPatients = createAsyncThunk<
  DetailedPatient[],
  void,
  { rejectValue: string }
>("patient/fetchDetailed", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/patients/detailed");
    return response.data.patients;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

/**
 * Async thunk for fetching a single patient by username.
 * It returns a single patient object on success.
 */
export const fetchPatientByUsername = createAsyncThunk<
  Patient,
  string, // The username will be passed as an argument
  { rejectValue: string }
>("patient/fetchByUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await api.get(`/patients/search/${username}`);
    return response.data.patient;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

/**
 * Async thunk for patient registration.
 * It takes patient data and returns a success message on success.
 * It handles API errors and rejects with a value.
 */
export const registerPatient = createAsyncThunk<
  any,
  Omit<Patient, "user_id">,
  { rejectValue: string }
>("patient/register", async (patientData, { rejectWithValue }) => {
  try {
    const response = await api.post("/patients/register", patientData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Export the DetailedPatient type for use in other files
export type { DetailedPatient };
