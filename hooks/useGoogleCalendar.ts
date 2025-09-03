// hooks/useGoogleCalendar.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/redux/store";
import {
  checkGoogleConnection,
  initiateGoogleAuth,
  createGoogleMeeting,
  fetchMeetings,
  rescheduleMeeting,
  cancelMeeting,
  disconnectGoogle,
  clearError,
} from "../app/redux/features/googleCalendar/googleCalendarSlice";
import { CreateMeetingRequest } from "../lib/googleCalendarApi";

export const useGoogleCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isConnected,
    googleUser,
    meetings,
    loading,
    error,
    creatingMeeting,
    reschedulingMeeting,
    cancelingMeeting,
  } = useSelector((state: RootState) => state.googleCalendar);

  const connectGoogle = () => {
    dispatch(initiateGoogleAuth());
  };

  const disconnect = () => {
    dispatch(disconnectGoogle());
  };

  const checkConnection = () => {
    dispatch(checkGoogleConnection());
  };

  const createMeeting = (meetingData: CreateMeetingRequest) => {
    return dispatch(createGoogleMeeting(meetingData));
  };

  const loadMeetings = () => {
    dispatch(fetchMeetings());
  };

  const reschedule = (eventId: string, startTime: string, endTime: string) => {
    return dispatch(
      rescheduleMeeting({ eventId, start_time: startTime, end_time: endTime })
    );
  };

  const cancelMeetingById = (eventId: string) => {
    return dispatch(cancelMeeting(eventId));
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // Helper functions
  const getUpcomingSessions = () => {
    const now = new Date();
    return meetings.filter((meeting) => new Date(meeting.start_time) > now);
  };

  const getRecentSessions = () => {
    const now = new Date();
    return meetings.filter((meeting) => new Date(meeting.start_time) <= now);
  };

  const getTodaysSessions = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    return meetings.filter(
      (meeting) => meeting.start_time.split("T")[0] === todayStr
    );
  };

  const isLoadingAction = (action: string) => {
    switch (action) {
      case "creating":
        return creatingMeeting;
      case "rescheduling":
        return !!reschedulingMeeting;
      case "canceling":
        return !!cancelingMeeting;
      default:
        return loading;
    }
  };

  return {
    // State
    isConnected,
    googleUser,
    meetings,
    loading,
    error,
    creatingMeeting,
    reschedulingMeeting,
    cancelingMeeting,

    // Actions
    connectGoogle,
    disconnect,
    checkConnection,
    createMeeting,
    loadMeetings,
    reschedule,
    cancelMeetingById,
    clearErrorMessage,

    // Helpers
    getUpcomingSessions,
    getRecentSessions,
    getTodaysSessions,
    isLoadingAction,
  };
};
