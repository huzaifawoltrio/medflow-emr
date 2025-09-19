// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import patientReducer from "./features/patients/patientSlice";
import appointmentReducer from "./features/appointments/appointmentSlice";
import chatReducer from "./features/chat/chatSlice";
import googleCalendarReducer from "./features/googleCalendar/googleCalendarSlice";
import clinicalNotesReducer from "./features/clinicalNotes/clinicalNotesSlice";
import documentReducer from "./features/documents/documentSlice";
import medicationReducer from "./features/medications/medicationSlice";
import vitalsReducer from "./features/vitals/vitalsSlice"; // Added vitals reducer

// Configure the Redux store
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      patient: patientReducer,
      appointment: appointmentReducer,
      chat: chatReducer,
      googleCalendar: googleCalendarReducer,
      clinicalNotes: clinicalNotesReducer,
      documents: documentReducer,
      medications: medicationReducer,
      vitals: vitalsReducer, // Added vitals reducer
    },
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
