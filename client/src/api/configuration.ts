import axios from "axios";

export const baseUrl = import.meta.env.VITE_BASE_URL || "";
// localhostUrl is used by legacy API calls - new code should use axiosClient with relative paths
export const localhostUrl = import.meta.env.VITE_LOCALHOST || "http://localhost:3000";
// Use Vite's built-in production flag (automatically true in production builds)
export const isProduction = import.meta.env.PROD;

export const axiosClient = axios.create({
  // In development, use empty baseURL to leverage Vite proxy
  // In production, use the full base URL (e.g., https://udemy-clone-ron-ben.onrender.com)
  baseURL: isProduction ? baseUrl : "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Safely extracts error message from various error types
 * Handles Axios errors, Error objects, and unknown error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    // Check for Axios error response structure
    if ("response" in error && error.response && typeof error.response === "object") {
      if (
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      ) {
        if ("message" in error.response.data && typeof error.response.data.message === "string") {
          return error.response.data.message;
        }
      }
    }
    // Check for standard Error object
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "An unknown error occurred";
};
