import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../lib/axiosConfig";

// Interface for the raw appointment data from the API
export interface Appointment {
  id: number;
  appointment_datetime: string;
  duration: number;
  services: string[];
  status: string;
  patient_id: number;
  doctor_id: number;
  appointment_fee: number;
  billing_type: string;
  location: string;
  repeat: boolean;
}

// Interface for the parameters to fetch appointments (start and end dates)
interface FetchAppointmentsParams {
  startDate: string;
  endDate: string;
}

/**
 * Async thunk for fetching appointments within a date range.
 * It returns an array of appointments on success.
 */
export const fetchAppointments = createAsyncThunk<
  Appointment[],
  FetchAppointmentsParams,
  { rejectValue: string }
>(
  "appointments/fetchAll",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      // Assumes the API can take start and end date query params
      // e.g., /api/appointments?start=2025-08-24&end=2025-08-30
      const response = await api.get("/appointments", {
        params: { start: startDate, end: endDate },
      });
      // Assuming the API returns an array under an 'appointments' key
      console.log("appointments are", response.data);
      return response.data.appointments;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message || "Failed to fetch appointments");
      }
    }
  }
);
