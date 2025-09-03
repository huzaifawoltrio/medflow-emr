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
   * This should redirect the browser to Google OAuth, not make an AJAX call
   */
  async initiateGoogleAuth(): Promise<void> {
    try {
      // Get the authorization URL from the backend
      const response = await api.get("/google/authorize");

      // Check if we got a redirect response or authorization URL
      if (response.data && response.data.authorization_url) {
        // Redirect the browser to Google OAuth
        window.location.href = response.data.authorization_url;
      } else {
        // If the backend redirects automatically, we shouldn't reach here
        // But if we do, redirect to the authorize endpoint directly
        window.location.href = `${api.defaults.baseURL}/google/authorize`;
      }
    } catch (error: any) {
      console.error("Error initiating Google auth:", error);

      // If AJAX fails, try direct redirect as fallback
      if (error.code === "ERR_NETWORK" || error.response?.status === 302) {
        window.location.href = `${api.defaults.baseURL}/google/authorize`;
      } else {
        throw new Error(
          error.response?.data?.message ||
            "Failed to initiate Google authentication"
        );
      }
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
