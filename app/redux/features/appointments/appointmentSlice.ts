import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAppointments,
  createAppointment,
  Appointment,
  deleteAppointment,
} from "./appointmentActions";

// Interface for the appointment state
interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(
        fetchAppointments.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.appointments.push(action.payload);
        }
      )
      .addCase(
        createAppointment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAppointment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          // Filter out the deleted appointment using the ID from the payload
          state.appointments = state.appointments.filter(
            (appointment) => appointment.id !== action.payload
          );
        }
      )
      .addCase(
        deleteAppointment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default appointmentSlice.reducer;
