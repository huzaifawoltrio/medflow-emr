// redux/features/auth/authActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../lib/axiosConfig"; // Using the configured axios instance
import Cookies from "js-cookie"; // 1. Import js-cookie

// Define the type for the login credentials
interface LoginCredentials {
  username?: string;
  password?: string;
}

// Define the type for the user data we expect from the API
interface UserData {
  id: number;
  role: "superadmin" | "doctor" | "patient";
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture_url?: string;
}

// Define the type for the login response
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

/**
 * Async thunk for user login.
 * It takes login credentials and returns the user data and tokens on success.
 * It handles API errors and rejects with a value.
 */
export const loginUser = createAsyncThunk<
  LoginResponse, // Type for the successful return value
  LoginCredentials, // Type for the argument passed to the thunk
  { rejectValue: string } // Type for the value returned on rejection
>(
  "auth/login",
  async ({ username, password }: any, { rejectWithValue }: any) => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      // On success, store tokens in cookies
      Cookies.set("accessToken", response.data.access_token, {
        expires: 1,
        path: "/",
      });
      Cookies.set("refreshToken", response.data.refresh_token, {
        expires: 7,
        path: "/",
      }); // Example: refresh token expires in 7 days

      return response.data;
    } catch (error: any) {
      // Handle potential errors from the API call
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

/**
 * Async thunk to fetch the current user's details.
 * It uses the access token stored in cookies to make an authenticated request.
 */
export const getUserDetails = createAsyncThunk<
  UserData,
  void,
  { rejectValue: string }
>("auth/getUserDetails", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<UserData>("/users/me");
    console.log("logged in details", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
