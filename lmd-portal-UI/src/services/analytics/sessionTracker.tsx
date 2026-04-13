// services/analytics/sessionTracker.tsx
import { analytics } from ".";

interface SessionData {
  startTime: string;
  lastActiveTime: number;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_STORAGE_KEY = "analytics_session_data";

/**
 * Session tracker utility functions
 */
export const sessionTracker = {
  /**
   * Start a new session
   */
  startSession: (): void => {
    if (typeof window === "undefined") return;

    const startTime = new Date().toISOString();
    const sessionData: SessionData = {
      startTime,
      lastActiveTime: Date.now(),
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  },

  /**
   * Update the last active time for the session
   */
  updateSession: (): void => {
    if (typeof window === "undefined") return;

    const sessionDataStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionDataStr) {
      // No active session, start a new one
      sessionTracker.startSession();
      return;
    }

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    sessionData.lastActiveTime = Date.now();
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  },

  /**
   * Check if the session has timed out
   */
  checkSessionTimeout: (): boolean => {
    if (typeof window === "undefined") return false;

    const sessionDataStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionDataStr) return true;

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    const timeSinceLastActivity = Date.now() - sessionData.lastActiveTime;

    return timeSinceLastActivity > SESSION_TIMEOUT;
  },

  /**
   * End the session and track it
   */
  endSession: (): void => {
    if (typeof window === "undefined") return;

    const sessionDataStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionDataStr) return;

    const sessionData: SessionData = JSON.parse(sessionDataStr);
    const endTime = new Date().toISOString();

    // Calculate duration in seconds
    const startTimeMs = new Date(sessionData.startTime).getTime();
    const endTimeMs = new Date(endTime).getTime();
    const durationSeconds = Math.floor((endTimeMs - startTimeMs) / 1000);

    // Get browser and device info
    const browserInfo = navigator.userAgent;
    const deviceInfo = {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
    };

    // Track the session
    analytics
      .trackSession(
        sessionData.startTime,
        endTime,
        durationSeconds,
        JSON.stringify(deviceInfo),
        browserInfo
      )
      .catch((err) => {
        console.error("Failed to track session:", err);
      });

    // Clear session data
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },

  /**
   * Initialize session tracking with event listeners
   */
  initialize: (): void => {
    if (typeof window === "undefined") return;

    // Start session on first load
    sessionTracker.startSession();

    // Update session on user activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((eventType) => {
      window.addEventListener(
        eventType,
        () => {
          // Check if session timed out
          if (sessionTracker.checkSessionTimeout()) {
            sessionTracker.endSession();
            sessionTracker.startSession();
          } else {
            sessionTracker.updateSession();
          }
        },
        { passive: true }
      );
    });

    // End session when user leaves
    window.addEventListener("beforeunload", () => {
      sessionTracker.endSession();
    });

    // Check for session timeout every minute
    setInterval(() => {
      if (sessionTracker.checkSessionTimeout()) {
        sessionTracker.endSession();
        sessionTracker.startSession();
      }
    }, 60 * 1000);
  },
};
