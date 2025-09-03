// lib/googleCalendarApi.ts
import api from "./axiosConfig";

export interface CreateMeetingRequest {
  summary: string;
  start_time: string; // ISO 8601 format
  end_time: string; // ISO 8601 format
  attendees: string[]; // Array of email addresses
  description?: string;
}

export interface Meeting {
  id: number;
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  meet_link: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingResponse {
  status: "success" | "error";
  message: string;
  meeting_id?: number;
  meet_link?: string;
  event_link?: string;
}

export interface RescheduleMeetingRequest {
  start_time: string;
  end_time: string;
}

class GoogleCalendarService {
  /**
   * Initiates Google OAuth flow for calendar access
   */
  async initiateGoogleAuth(): Promise<string> {
    try {
      const response = await api.get("/google/authorize");
      // The backend should return a redirect URL or handle the redirect
      return response.data.authorization_url || response.request.responseURL;
    } catch (error: any) {
      console.error("Error initiating Google auth:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to initiate Google authentication"
      );
    }
  }

  /**
   * Creates a new Google Meet session with calendar integration
   */
  async createMeeting(
    meetingData: CreateMeetingRequest
  ): Promise<CreateMeetingResponse> {
    try {
      const response = await api.post<CreateMeetingResponse>(
        "/meetings",
        meetingData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create meeting"
      );
    }
  }

  /**
   * Reschedules an existing Google Calendar event
   */
  async rescheduleMeeting(
    eventId: string,
    rescheduleData: RescheduleMeetingRequest
  ): Promise<{ updated_event_link?: string; error?: string }> {
    try {
      const response = await api.put(
        `/meetings/${eventId}/reschedule`,
        rescheduleData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error rescheduling meeting:", error);
      throw new Error(
        error.response?.data?.error || "Failed to reschedule meeting"
      );
    }
  }

  /**
   * Cancels an existing Google Calendar event
   */
  async cancelMeeting(
    eventId: string
  ): Promise<{ message?: string; error?: string }> {
    try {
      const response = await api.delete(`/meetings/${eventId}/cancel`);
      return response.data;
    } catch (error: any) {
      console.error("Error canceling meeting:", error);
      throw new Error(
        error.response?.data?.error || "Failed to cancel meeting"
      );
    }
  }

  /**
   * Gets all meetings/sessions for the current user
   * Note: You'll need to add this endpoint to your backend
   */
  async getMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get<Meeting[]>("/meetings");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch meetings"
      );
    }
  }

  /**
   * Checks if user has Google Calendar connected
   * You'll need to add this endpoint to check session/token status
   */
  async checkGoogleConnection(): Promise<{
    isConnected: boolean;
    userInfo?: any;
  }> {
    try {
      const response = await api.get("/google/status");
      return response.data;
    } catch (error: any) {
      console.error("Error checking Google connection:", error);
      return { isConnected: false };
    }
  }

  /**
   * Disconnects Google account
   */
  async disconnectGoogle(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/google/disconnect");
      return response.data;
    } catch (error: any) {
      console.error("Error disconnecting Google:", error);
      throw new Error(
        error.response?.data?.message || "Failed to disconnect Google account"
      );
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
