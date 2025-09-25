import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAppointments,
  createAppointment,
  deleteAppointment,
  fetchDailyAppointments,
  fetchTodaysAppointments,
  Appointment,
  DailyAppointmentsResponse,
  DateRangeAppointmentsResponse,
  DailyAppointment,
} from "./appointmentActions";

// Enhanced interface for the appointment state
interface AppointmentState {
  appointments: Appointment[];
  dailyAppointments: DailyAppointment[];
  dateRangeAppointments: Record<string, DailyAppointment[]>;
  currentDate: string | null;
  doctorName: string | null;
  totalDailyAppointments: number;
  loading: boolean;
  dailyLoading: boolean;
  dateRangeLoading: boolean;
  error: string | null;
  success: boolean; // <-- Added success state
}

const initialState: AppointmentState = {
  appointments: [],
  dailyAppointments: [],
  dateRangeAppointments: {},
  currentDate: null,
  doctorName: null,
  totalDailyAppointments: 0,
  loading: false,
  dailyLoading: false,
  dateRangeLoading: false,
  error: null,
  success: false, // <-- Initialize success state
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    // Clear daily appointments
    clearDailyAppointments: (state) => {
      state.dailyAppointments = [];
      state.currentDate = null;
      state.totalDailyAppointments = 0;
    },
    // Clear date range appointments
    clearDateRangeAppointments: (state) => {
      state.dateRangeAppointments = {};
    },
    // Clear all errors
    clearError: (state) => {
      state.error = null;
    },
    // Clear success state
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing reducers for fetchAppointments, createAppointment, deleteAppointment
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
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
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.success = true;
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
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        deleteAppointment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.success = true;
          state.appointments = state.appointments.filter(
            (appointment) => appointment.id !== action.payload
          );
          // Also remove from daily appointments if present
          state.dailyAppointments = state.dailyAppointments.filter(
            (appointment) => appointment.id !== action.payload
          );
          state.totalDailyAppointments = state.dailyAppointments.length;
        }
      )
      .addCase(
        deleteAppointment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Daily appointments reducers
      .addCase(fetchDailyAppointments.pending, (state) => {
        state.dailyLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDailyAppointments.fulfilled,
        (state, action: PayloadAction<DailyAppointmentsResponse>) => {
          state.dailyLoading = false;
          state.dailyAppointments = action.payload.appointments;
          state.currentDate = action.payload.date;
          state.doctorName = action.payload.doctor_name;
          state.totalDailyAppointments = action.payload.total_appointments;
        }
      )
      .addCase(
        fetchDailyAppointments.rejected,
        (state, action: PayloadAction<any>) => {
          state.dailyLoading = false;
          state.error = action.payload;
        }
      )

      // Today's appointments reducers (same as daily)
      .addCase(fetchTodaysAppointments.pending, (state) => {
        state.dailyLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTodaysAppointments.fulfilled,
        (state, action: PayloadAction<DailyAppointmentsResponse>) => {
          state.dailyLoading = false;
          state.dailyAppointments = action.payload.appointments;
          state.currentDate = action.payload.date;
          state.doctorName = action.payload.doctor_name;
          state.totalDailyAppointments = action.payload.total_appointments;
        }
      )
      .addCase(
        fetchTodaysAppointments.rejected,
        (state, action: PayloadAction<any>) => {
          state.dailyLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearDailyAppointments,
  clearDateRangeAppointments,
  clearError,
  clearSuccess, // <-- Export the new action
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
