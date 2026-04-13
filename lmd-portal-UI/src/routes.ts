/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/privacy-policy",
  "/auth/request-access",
  "/docs/about-lmd2",
  "/docs/how-it-works",
  "/docs/user-guides",
  "/docs/faqs",
  "/external-kpi-dashboard",
  "/recap_2025",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /home
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/sign-in",
  "/auth/reset-password",
  "/auth/forgot-password",
  "/auth/request-access",
  "/auth/forced-resetpassword",
  "/auth/error",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * update it to capture all api routes, and make them publicly accessible
 * @type {string}
 */
export const apiAuthPrefix: string = "/api";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/home";
