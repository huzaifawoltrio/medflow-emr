// redux/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./authActions";

// Define the type for the user object
interface User {
  id: number | null;
  role: "superadmin" | "doctor" | "patient" | null;
  username: string | null;
}

// Define the shape of the auth state
interface AuthState {
  loading: boolean;
  user: User | null; // Store user information
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  success: boolean; // for monitoring the registration process.
}

const initialState: AuthState = {
  loading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to log out the user
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // When loginUser is pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When loginUser is fulfilled
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true; // login successful
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      // When loginUser is rejected
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload; // error message from rejectWithValue
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
