// Centralized configuration for the application

// API Base URL
// 1. Prioritize environment variable VITE_API_URL (set in Zeabur/Vercel/etc.)
// 2. Fallback to localhost for local development
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
console.log("API_BASE_URL:", API_BASE_URL);
// Helper to get full endpoint url
export const getEndpoint = (path) => {
  // Ensure path starts with / if not empty
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
