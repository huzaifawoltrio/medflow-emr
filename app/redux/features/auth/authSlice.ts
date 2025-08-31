// redux/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, getUserDetails, getDoctorProfile } from "./authActions";
import Cookies from "js-cookie"; // Import js-cookie here as well

// Define the type for the user object
interface User {
  id: number | null;
  role: "superadmin" | "doctor" | "patient" | null;
  username: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture_url?: string;
}

// Define the type for the doctor profile object
interface DoctorProfile {
  available_for_telehealth: boolean;
  biography: string;
  dea_number: string;
  department: string;
  email: string;
  first_name: string;
  is_active: boolean;
  languages_spoken: string;
  last_name: string;
  medical_license_number: string;
  npi_number: string;
  qualifications: string;
  specialization: string;
  user_id: number;
  years_of_experience: number;
}

// Define the shape of the auth state
interface AuthState {
  loading: boolean;
  user: User | null; // Store user information
  doctorProfile: DoctorProfile | null; // Store doctor profile information
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  success: boolean; // for monitoring the registration process.
}

const initialState: AuthState = {
  loading: false,
  user: null,
  doctorProfile: null,
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add this new rehydrateAuth reducer
    rehydrateAuth: (state) => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        state.accessToken = accessToken;
      }
    },
    // Reducer to log out the user
    logout: (state) => {
      // Clear storage
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // Reset state
      state.loading = false;
      state.user = null;
      state.doctorProfile = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.success = false;
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
      })
      // When getUserDetails is pending
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      // When getUserDetails is fulfilled
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Safely merge new user details into the existing user state
        const existingUser = state.user || {};
        state.user = { ...existingUser, ...action.payload };
      })
      // When getUserDetails is rejected
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // When getDoctorProfile is pending
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
      })
      // When getDoctorProfile is fulfilled
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorProfile = action.payload;
      })
      // When getDoctorProfile is rejected
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the new action
export const { logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
