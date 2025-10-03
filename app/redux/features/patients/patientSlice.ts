// redux/features/patient/patientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerPatient,
  fetchPatients,
  fetchPatientByUsername,
  fetchDetailedPatients,
  fetchMyDoctors, // Import the new action
  DetailedPatient,
  Doctor, // Import the new type
  assignPatientToDoctor,
  getPatientDoctors,
} from "./patientActions";

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
  created_at?: string; // Optional field
}

interface PatientState {
  patients: Patient[];
  detailedPatients: DetailedPatient[];
  selectedPatient: Patient | null;
  doctors: Doctor[]; // Add doctors to the state
  patientDoctors: Doctor[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PatientState = {
  patients: [],
  detailedPatients: [],
  selectedPatient: null,
  doctors: [], // Initialize doctors array
  patientDoctors: [],
  loading: false,
  error: null,
  success: false,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerPatient.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(
        registerPatient.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(fetchPatients.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDetailedPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDetailedPatients.fulfilled,
        (state, action: PayloadAction<DetailedPatient[]>) => {
          state.loading = false;
          state.detailedPatients = action.payload;
        }
      )
      .addCase(
        fetchDetailedPatients.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(fetchPatientByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPatient = null;
      })
      .addCase(
        fetchPatientByUsername.fulfilled,
        (state, action: PayloadAction<Patient>) => {
          state.loading = false;
          state.selectedPatient = action.payload;
        }
      )
      .addCase(
        fetchPatientByUsername.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Add reducers for fetchMyDoctors
      .addCase(fetchMyDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyDoctors.fulfilled,
        (state, action: PayloadAction<Doctor[]>) => {
          state.loading = false;
          state.doctors = action.payload;
        }
      )
      .addCase(fetchMyDoctors.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignPatientToDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPatientToDoctor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignPatientToDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to assign patient";
      })
      .addCase(getPatientDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDoctors = action.payload;
      })
      .addCase(getPatientDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get patient doctors";
      });
  },
});

export default patientSlice.reducer;
