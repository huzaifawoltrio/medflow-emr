// redux/features/googleCalendar/googleCalendarSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  googleCalendarService,
  CreateMeetingRequest,
  Meeting,
  CreateMeetingResponse,
} from "../../../../lib/googleCalendarApi";
import api from "../../../../lib/axiosConfig"; // Import the axios instance

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface Patient {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface PatientDetails {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface DoctorDetails {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  specialization?: string;
}

interface EnhancedMeeting extends Meeting {
  patient_id: number;
  doctor_id: number;
  patient_details?: PatientDetails;
  doctor_details?: DoctorDetails;
}

interface GoogleCalendarState {
  isConnected: boolean;
  googleUser: GoogleUser | null;
  meetings: EnhancedMeeting[];
  patients: Patient[];
  loading: boolean;
  error: string | null;
  creatingMeeting: boolean;
  fetchingPatients: boolean;
  reschedulingMeeting: string | null; // event_id of meeting being rescheduled
  cancelingMeeting: string | null; // event_id of meeting being canceled
}

const initialState: GoogleCalendarState = {
  isConnected: false,
  googleUser: null,
  meetings: [],
  patients: [],
  loading: false,
  error: null,
  creatingMeeting: false,
  fetchingPatients: false,
  reschedulingMeeting: null,
  cancelingMeeting: null,
};

// Updated CreateMeetingRequest interface for new API structure
interface NewCreateMeetingRequest {
  summary: string;
  start_time: string;
  end_time: string;
  patient_id: number;
  description?: string;
}

interface NewCreateMeetingResponse {
  status: string;
  message: string;
  meeting: EnhancedMeeting;
  event_link: string;
}

// Async thunks
export const checkGoogleConnection = createAsyncThunk<
  { isConnected: boolean; userInfo?: GoogleUser },
  void,
  { rejectValue: string }
>("googleCalendar/checkConnection", async (_, { rejectWithValue }) => {
  try {
    return await googleCalendarService.checkGoogleConnection();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const initiateGoogleAuth = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("googleCalendar/initiateAuth", async (_, { rejectWithValue }) => {
  try {
    await googleCalendarService.initiateGoogleAuth();
    // The service will handle the redirect, so we don't return anything
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Updated createGoogleMeeting thunk for new API structure using axios
export const createGoogleMeeting = createAsyncThunk<
  NewCreateMeetingResponse,
  NewCreateMeetingRequest,
  { rejectValue: string }
>("googleCalendar/createMeeting", async (meetingData, { rejectWithValue }) => {
  try {
    const response = await api.post("/meetings", meetingData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to create meeting");
  }
});

export const fetchMeetings = createAsyncThunk<
  EnhancedMeeting[],
  void,
  { rejectValue: string }
>("googleCalendar/fetchMeetings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/meetings");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to fetch meetings");
  }
});

// Updated rescheduleMeeting thunk using axios
export const rescheduleMeeting = createAsyncThunk<
  { eventId: string; updated_event_link?: string },
  { eventId: string; start_time: string; end_time: string },
  { rejectValue: string }
>(
  "googleCalendar/rescheduleMeeting",
  async ({ eventId, start_time, end_time }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/meetings/${eventId}/reschedule`, {
        start_time,
        end_time,
      });
      return { eventId, ...response.data };
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Failed to reschedule meeting");
    }
  }
);

export const cancelMeeting = createAsyncThunk<
  { eventId: string; message?: string },
  string,
  { rejectValue: string }
>("googleCalendar/cancelMeeting", async (eventId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/meetings/${eventId}`);
    return { eventId, ...response.data };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || "Failed to cancel meeting");
  }
});

export const disconnectGoogle = createAsyncThunk<
  { success: boolean; message: string },
  void,
  { rejectValue: string }
>("googleCalendar/disconnect", async (_, { rejectWithValue }) => {
  try {
    return await googleCalendarService.disconnectGoogle();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// New thunk to fetch specific patient's meetings using axios
export const fetchPatientMeetings = createAsyncThunk<
  EnhancedMeeting[],
  number,
  { rejectValue: string }
>(
  "googleCalendar/fetchPatientMeetings",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/meetings/patient/${patientId}`);
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        error.message || "Failed to fetch patient meetings"
      );
    }
  }
);

const googleCalendarSlice = createSlice({
  name: "googleCalendar",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setGoogleConnection: (
      state,
      action: PayloadAction<{ isConnected: boolean; userInfo?: GoogleUser }>
    ) => {
      state.isConnected = action.payload.isConnected;
      state.googleUser = action.payload.userInfo || null;
    },
    clearMeetings: (state) => {
      state.meetings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Google Connection
      .addCase(checkGoogleConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkGoogleConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.isConnected = action.payload.isConnected;
        state.googleUser = action.payload.userInfo || null;
      })
      .addCase(checkGoogleConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to check Google connection";
      })

      // Initiate Google Auth
      .addCase(initiateGoogleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateGoogleAuth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateGoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to initiate Google authentication";
      })

      // Create Google Meeting
      .addCase(createGoogleMeeting.pending, (state) => {
        state.creatingMeeting = true;
        state.error = null;
      })
      .addCase(createGoogleMeeting.fulfilled, (state, action) => {
        state.creatingMeeting = false;
        // Add the new meeting to the list
        state.meetings.push(action.payload.meeting);
      })
      .addCase(createGoogleMeeting.rejected, (state, action) => {
        state.creatingMeeting = false;
        state.error = action.payload || "Failed to create meeting";
      })

      // Fetch Meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch meetings";
      })

      // Fetch Patient Meetings
      .addCase(fetchPatientMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientMeetings.fulfilled, (state, action) => {
        state.loading = false;
        // Replace or merge patient meetings
        state.meetings = action.payload;
      })
      .addCase(fetchPatientMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch patient meetings";
      })

      // Reschedule Meeting
      .addCase(rescheduleMeeting.pending, (state, action) => {
        state.reschedulingMeeting = action.meta.arg.eventId;
        state.error = null;
      })
      .addCase(rescheduleMeeting.fulfilled, (state, action) => {
        state.reschedulingMeeting = null;
        // Update the meeting in the list if needed
        const meetingIndex = state.meetings.findIndex(
          (m) => m.event_id === action.payload.eventId
        );
        if (meetingIndex !== -1) {
          // Update meeting details with new times
          const meeting = state.meetings[meetingIndex];
          // You would update the meeting times here based on the response
        }
      })
      .addCase(rescheduleMeeting.rejected, (state, action) => {
        state.reschedulingMeeting = null;
        state.error = action.payload || "Failed to reschedule meeting";
      })

      // Cancel Meeting
      .addCase(cancelMeeting.pending, (state, action) => {
        state.cancelingMeeting = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        state.cancelingMeeting = null;
        // Remove the meeting from the list
        state.meetings = state.meetings.filter(
          (m) => m.event_id !== action.payload.eventId
        );
      })
      .addCase(cancelMeeting.rejected, (state, action) => {
        state.cancelingMeeting = null;
        state.error = action.payload || "Failed to cancel meeting";
      })

      // Disconnect Google
      .addCase(disconnectGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectGoogle.fulfilled, (state) => {
        state.loading = false;
        state.isConnected = false;
        state.googleUser = null;
        state.meetings = [];
        state.patients = [];
      })
      .addCase(disconnectGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to disconnect Google account";
      });
  },
});

export const { clearError, setGoogleConnection, clearMeetings } =
  googleCalendarSlice.actions;
export default googleCalendarSlice.reducer;
