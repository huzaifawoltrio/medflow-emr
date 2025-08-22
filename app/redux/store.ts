// redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";

// Configure the Redux store
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // You can add other reducers here as your app grows
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
