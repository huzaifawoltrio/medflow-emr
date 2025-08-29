// lib/axiosConfig.ts

import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor to add the auth token to requests.
 * The token is retrieved from cookies.
 */
api.interceptors.request.use(
  (config) => {
    // Check if window is defined (to ensure it's running on the client-side)
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
