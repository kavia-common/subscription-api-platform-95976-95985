/* eslint-disable no-console */
import axios from "axios";

/**
 * API service module for interacting with the backend.
 * Uses REACT_APP_API_BASE_URL for configuration and attaches Authorization headers when a token is present.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach auth header if token is available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple response/error logging hook (can be enhanced)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error object for UI
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.message ||
      "Unknown error";
    return Promise.reject(new Error(message));
  }
);

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Authenticate user and receive token and user info.
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {{ token: string, user: { id: string, email: string, plan: string } }}
   */
  const { data } = await apiClient.post("/api/auth/login", { email, password });
  return data;
}

// PUBLIC_INTERFACE
export async function signup(email, password, plan = "normal") {
  /** Create a new user with a selected plan.
   * @param {string} email
   * @param {string} password
   * @param {string} plan - One of: normal | premium | ultra
   * @returns {{ token: string, user: { id: string, email: string, plan: string } }}
   */
  const { data } = await apiClient.post("/api/auth/signup", {
    email,
    password,
    plan,
  });
  return data;
}

// PUBLIC_INTERFACE
export async function getCurrentUser() {
  /** Fetch the currently authenticated user, including plan. */
  const { data } = await apiClient.get("/api/user/me");
  return data;
}

// PUBLIC_INTERFACE
export async function getPlan() {
  /** Fetch the plan for the authenticated user from backend. */
  const { data } = await apiClient.get("/api/plan");
  return data;
}

// PUBLIC_INTERFACE
export async function updatePlan(plan) {
  /** Update the authenticated user's plan in the backend.
   * @param {string} plan - normal | premium | ultra
   */
  const { data } = await apiClient.put("/api/plan", { plan });
  return data;
}

// PUBLIC_INTERFACE
export async function callPlanApi(payload = {}) {
  /** Call the plan-gated API. Backend responds based on user's plan.
   * @param {object} payload - arbitrary request body
   * @returns {{ success: boolean, message: string, plan: string, [key:string]: any }}
   */
  const { data } = await apiClient.post("/api/execute", payload);
  return data;
}

export default apiClient;
