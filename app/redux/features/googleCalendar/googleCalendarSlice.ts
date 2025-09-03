// redux/features/googleCalendar/googleCalendarSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  googleCalendarService,
  CreateMeetingRequest,
  Meeting,
  CreateMeetingResponse,
} from "../../../../lib/googleCalendarApi";

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface GoogleCalendarState {
  isConnected: boolean;
  googleUser: GoogleUser | null;
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  creatingMeeting: boolean;
  reschedulingMeeting: string | null; // event_id of meeting being rescheduled
  cancelingMeeting: string | null; // event_id of meeting being canceled
}

const initialState: GoogleCalendarState = {
  isConnected: false,
  googleUser: null,
  meetings: [],
  loading: false,
  error: null,
  creatingMeeting: false,
  reschedulingMeeting: null,
  cancelingMeeting: null,
};

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

export const createGoogleMeeting = createAsyncThunk<
  CreateMeetingResponse,
  CreateMeetingRequest,
  { rejectValue: string }
>("googleCalendar/createMeeting", async (meetingData, { rejectWithValue }) => {
  try {
    return await googleCalendarService.createMeeting(meetingData);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchMeetings = createAsyncThunk<
  Meeting[],
  void,
  { rejectValue: string }
>("googleCalendar/fetchMeetings", async (_, { rejectWithValue }) => {
  try {
    return await googleCalendarService.getMeetings();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const rescheduleMeeting = createAsyncThunk<
  { eventId: string; updated_event_link?: string },
  { eventId: string; start_time: string; end_time: string },
  { rejectValue: string }
>(
  "googleCalendar/rescheduleMeeting",
  async ({ eventId, start_time, end_time }, { rejectWithValue }) => {
    try {
      const result = await googleCalendarService.rescheduleMeeting(eventId, {
        start_time,
        end_time,
      });
      return { eventId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelMeeting = createAsyncThunk<
  { eventId: string; message?: string },
  string,
  { rejectValue: string }
>("googleCalendar/cancelMeeting", async (eventId, { rejectWithValue }) => {
  try {
    const result = await googleCalendarService.cancelMeeting(eventId);
    return { eventId, ...result };
  } catch (error: any) {
    return rejectWithValue(error.message);
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
        // You might want to refresh meetings list after creating
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
          // You'd need to update the meeting details here
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
      })
      .addCase(disconnectGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to disconnect Google account";
      });
  },
});

export const { clearError, setGoogleConnection } = googleCalendarSlice.actions;
export default googleCalendarSlice.reducer;
