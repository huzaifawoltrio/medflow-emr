// redux/features/patient/patientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerPatient,
  fetchPatients,
  fetchPatientByUsername,
} from "./patientActions";

interface Patient {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other patient fields as needed
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
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
      );
  },
});

export default patientSlice.reducer;
