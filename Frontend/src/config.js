// Centralized frontend API configuration
const rawUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

// Remove any trailing slash to prevent double-slash in path concats
export const API_BASE_URL = rawUrl.replace(/\/+$/, "");
export const BACKEND_URL = API_BASE_URL;

export default API_BASE_URL;

