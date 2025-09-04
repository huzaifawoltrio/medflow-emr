// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import patientReducer from "./features/patients/patientSlice";
import appointmentReducer from "./features/appointments/appointmentSlice"; // Added appointment reducer
import chatReducer from "./features/chat/chatSlice";
import googleCalendarReducer from "./features/googleCalendar/googleCalendarSlice";
import clinicalNotesReducer from "./features/clinicalNotes/clinicalNotesSlice";

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
    },
  });
};
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
