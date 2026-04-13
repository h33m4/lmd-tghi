import axios from "axios";
import axiosRetry from "axios-retry";

// Create dedicated instance for file uploads
const uploadClient = axios.create({
  timeout: 120000, // 2 minutes default
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Configure automatic retries
axiosRetry(uploadClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.pow(2, retryCount) * 1000;
  },
  retryCondition: (error) => {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      (error.response?.status ?? 0) >= 500
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(
      `[Upload Retry] Attempt ${retryCount} for ${requestConfig.url}`,
      `Error: ${error.message}`
    );
  },
});

// Request interceptor for logging
uploadClient.interceptors.request.use(
  (config) => {
    console.log(`[Upload] Starting upload to ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[Upload] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
uploadClient.interceptors.response.use(
  (response) => {
    console.log(`[Upload] Success: ${response.config.url}`);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("[Upload] Cancelled by user");
    } else {
      console.error("[Upload] Failed:", error.message);
    }
    return Promise.reject(error);
  }
);

export default uploadClient;
