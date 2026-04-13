import { auth } from "./auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// ─── Permission constants (inlined for edge-runtime safety) ──────────────────

const ADMIN_GROUPS = ["super_administrator", "administrator"];
const PUBLISHER_GROUPS = ["super_administrator", "administrator", "global_publisher"];

// Routes under /settings that require admin access (maps to settings/(admin)/* route group)
const SETTINGS_ADMIN_PREFIXES = [
  "/settings/user-management",
  "/settings/portal-management",
  "/settings/portal-analytics",
];

// Routes under /settings that require publisher or admin access (settings/(publisher)/*)
const SETTINGS_PUBLISHER_PREFIXES = [
  "/settings/dashboards",
  "/settings/reports",
  "/settings/integrations",
];

// Country admin routes — maps country key to the country-specific roles allowed
// to access /country-programs/<country>/admin/* routes.
const COUNTRY_ADMIN_ROLES: Record<string, string[]> = {
  liberia: ["liberia_administrator", "liberia_publisher"],
  malawi: ["malawi_administrator", "malawi_publisher"],
  ethiopia: ["ethiopia_administrator", "ethiopia_publisher"],
  sierra_leone: ["sierra_leone_administrator", "sierra_leone_publisher"],
};

function hasAnyGroup(userGroups: string[], required: string[]): boolean {
  return userGroups.some((g) => required.includes(g));
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export default auth((req): Response | void => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) return;

  // Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Require login for all non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = pathname + (nextUrl.search ?? "");
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // ── Role-based checks (only runs when logged in) ────────────────────────────
  if (isLoggedIn) {
    const userGroups: string[] = (req.auth as any)?.user?.groups ?? [];

    // Settings — admin-only routes
    if (SETTINGS_ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
      if (!hasAnyGroup(userGroups, ADMIN_GROUPS)) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }
    }

    // Settings — publisher routes
    else if (SETTINGS_PUBLISHER_PREFIXES.some((p) => pathname.startsWith(p))) {
      const isPublisher =
        hasAnyGroup(userGroups, PUBLISHER_GROUPS) ||
        userGroups.some((g) => g.endsWith("_publisher"));
      if (!isPublisher) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }
    }

    // Country admin routes — /country-programs/<country>/admin/*
    else {
      const countryAdminMatch = pathname.match(
        /^\/country-programs\/(liberia|malawi|ethiopia|sierra_leone)\/admin/
      );
      if (countryAdminMatch) {
        const country = countryAdminMatch[1];
        const countryRoles = COUNTRY_ADMIN_ROLES[country] ?? [];
        const allowed = [
          ...ADMIN_GROUPS,
          "global_publisher",
          ...countryRoles,
        ];
        if (!hasAnyGroup(userGroups, allowed)) {
          return Response.redirect(new URL("/unauthorized", nextUrl));
        }
      }
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
