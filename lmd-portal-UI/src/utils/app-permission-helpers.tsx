import { Session } from "next-auth";

// Permission Types
export type GlobalRole = "global_publisher" | "super_administrator";

export type CountryRole =
  | "liberia_publisher"
  | "sierra_leone_publisher"
  | "ethiopia_publisher"
  | "malawi_publisher";

export type ApproverRole =
  | "liberia_approver"
  | "sierra_leone_approver"
  | "ethiopia_approver"
  | "malawi_approver";

// export type ViewerRole =
//   | "liberia_viewer"
//   | "ghana_viewer"
//   | "sierra_leone_viewer"
//   | "ethiopia_viewer"
//   | "malawi_viewer";

export type ViewerRole = "user";

export type AllRoles = GlobalRole | CountryRole | ApproverRole | ViewerRole;

// Permission Interface
export interface IUserPermissions {
  canUpload: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canView: boolean;
  canDelete: boolean;
  canExport: boolean;
  userRoles: string[];
  currentCountry: string;
}

// Your original function (preserved)
export const isUserAllowed = (
  session: Session,
  allowedGroups: string[]
): boolean => {
  if (!session) {
    return false;
  }
  const user = session.user;
  return user.groups.some((group) => allowedGroups.includes(group));
};

// Constants
export const GLOBAL_ROLES: GlobalRole[] = [
  "global_publisher",
  "super_administrator",
] as const;

export const COUNTRY_MAPPINGS: Record<
  string,
  {
    publisher: CountryRole;
    approver: ApproverRole;
    viewer: ViewerRole;
  }
> = {
  liberia: {
    publisher: "liberia_publisher",
    approver: "liberia_approver",
    // viewer: "liberia_viewer",
    viewer: "user",
  },
  "sierra leone": {
    publisher: "sierra_leone_publisher",
    approver: "sierra_leone_approver",
    // viewer: "sierra_leone_viewer",
    viewer: "user",
  },
  sierra_leone: {
    publisher: "sierra_leone_publisher",
    approver: "sierra_leone_approver",
    // viewer: "sierra_leone_viewer",
    viewer: "user",
  },
  ethiopia: {
    publisher: "ethiopia_publisher",
    approver: "ethiopia_approver",
    // viewer: "ethiopia_viewer",
    viewer: "user",
  },
  malawi: {
    publisher: "malawi_publisher",
    approver: "malawi_approver",
    // viewer: "malawi_viewer",
    viewer: "user",
  },
} as const;

// Utility Functions
export const normalizeCountryName = (country: string | null): string => {
  if (!country) return "";
  return country.toLowerCase().trim();
};

export const getCountryRoles = (country: string | null) => {
  const normalizedCountry = normalizeCountryName(country);
  return COUNTRY_MAPPINGS[normalizedCountry] || null;
};

export const getCountrySpecificPublisherRole = (
  country: string | null
): CountryRole | null => {
  const roles = getCountryRoles(country);
  return roles?.publisher || null;
};

export const getCountrySpecificApproverRole = (
  country: string | null
): ApproverRole | null => {
  const roles = getCountryRoles(country);
  return roles?.approver || null;
};

export const getCountrySpecificViewerRole = (
  country: string | null
): ViewerRole | null => {
  const roles = getCountryRoles(country);
  return roles?.viewer || null;
};

// Permission Checking Functions
export const hasGlobalPermission = (sessionData: Session | null): boolean => {
  if (!sessionData) return false;
  return isUserAllowed(sessionData, GLOBAL_ROLES as unknown as string[]);
};

export const hasCountryPublisherPermission = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  if (!sessionData || !country) return false;

  const publisherRole = getCountrySpecificPublisherRole(country);
  if (!publisherRole) return false;

  return isUserAllowed(sessionData, [publisherRole]);
};

export const hasCountryApproverPermission = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  if (!sessionData || !country) return false;

  const approverRole = getCountrySpecificApproverRole(country);
  if (!approverRole) return false;

  return isUserAllowed(sessionData, [approverRole]);
};

export const hasCountryViewerPermission = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  if (!sessionData || !country) return false;

  const viewerRole = getCountrySpecificViewerRole(country);
  if (!viewerRole) return false;

  return isUserAllowed(sessionData, [viewerRole]);
};

// Main Permission Calculator
export const calculateUserPermissions = (
  sessionData: Session | null,
  country: string | null,
  options?: {
    requireApprovalForDelete?: boolean;
    requirePublisherForExport?: boolean;
  }
): IUserPermissions => {
  const currentCountry = normalizeCountryName(country);
  const userRoles = sessionData?.user?.groups || [];

  // Check different permission levels
  const isGlobalUser = hasGlobalPermission(sessionData);
  const isCountryPublisher = hasCountryPublisherPermission(
    sessionData,
    country
  );
  const isCountryApprover = hasCountryApproverPermission(sessionData, country);
  const isCountryViewer = hasCountryViewerPermission(sessionData, country);

  // Calculate permissions
  const canUpload = isGlobalUser || isCountryPublisher;
  const canEdit = isGlobalUser || isCountryPublisher;
  const canApprove = isCountryApprover; // Only approvers can approve
  const canView =
    isGlobalUser || isCountryPublisher || isCountryApprover || isCountryViewer;

  // Optional: Delete permissions (can be same as edit, or require approval)
  const canDelete = options?.requireApprovalForDelete
    ? isGlobalUser || isCountryApprover
    : canEdit;

  // Optional: Export permissions
  const canExport = options?.requirePublisherForExport ? canEdit : canView;

  return {
    canUpload,
    canEdit,
    canApprove,
    canView,
    canDelete,
    canExport,
    userRoles,
    currentCountry,
  };
};

// React Hook for easy usage
export const useUserPermissions = (
  sessionData: Session | null,
  country: string | null,
  options?: {
    requireApprovalForDelete?: boolean;
    requirePublisherForExport?: boolean;
  }
): IUserPermissions => {
  // Always call useMemo - React Hooks must be called unconditionally
  const { useMemo } = require("react");

  return useMemo(
    () => calculateUserPermissions(sessionData, country, options),
    [sessionData, country, options]
  );
};

// Helper functions for specific checks
export const canUserEditCountry = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  const permissions = calculateUserPermissions(sessionData, country);
  return permissions.canEdit;
};

export const canUserApproveCountry = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  const permissions = calculateUserPermissions(sessionData, country);
  return permissions.canApprove;
};

export const canUserViewCountry = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  const permissions = calculateUserPermissions(sessionData, country);
  return permissions.canView;
};

export const canUserDeleteCountry = (
  sessionData: Session | null,
  country: string | null,
  requireApproval = false
): boolean => {
  const permissions = calculateUserPermissions(sessionData, country, {
    requireApprovalForDelete: requireApproval,
  });
  return permissions.canDelete;
};

export const canUserExportCountry = (
  sessionData: Session | null,
  country: string | null,
  requirePublisher = false
): boolean => {
  const permissions = calculateUserPermissions(sessionData, country, {
    requirePublisherForExport: requirePublisher,
  });
  return permissions.canExport;
};

export const getUserCountryRoles = (sessionData: Session | null): string[] => {
  const userRoles = sessionData?.user?.groups || [];
  return userRoles.filter((role: string) =>
    Object.values(COUNTRY_MAPPINGS).some((mapping) =>
      Object.values(mapping).includes(role as any)
    )
  );
};

export const getUserGlobalRoles = (sessionData: Session | null): string[] => {
  const userRoles = sessionData?.user?.groups || [];
  return userRoles.filter((role: string) =>
    GLOBAL_ROLES.includes(role as GlobalRole)
  );
};

// Debug helper
export const debugUserPermissions = (
  sessionData: Session | null,
  country: string | null
) => {
  const permissions = calculateUserPermissions(sessionData, country);
  const globalRoles = getUserGlobalRoles(sessionData);
  const countryRoles = getUserCountryRoles(sessionData);

  console.group(`🔐 Permission Debug for ${country || "unknown country"}`);
  console.log("User Roles:", permissions.userRoles);
  console.log("Global Roles:", globalRoles);
  console.log("Country Roles:", countryRoles);
  console.log("Permissions:", {
    canEdit: permissions.canEdit,
    canApprove: permissions.canApprove,
    canView: permissions.canView,
    canDelete: permissions.canDelete,
    canExport: permissions.canExport,
  });
  console.groupEnd();

  return permissions;
};

// Convenience functions for common use cases
export const getEditPermissionForTable = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  return canUserEditCountry(sessionData, country);
};

export const getApprovalPermissionForTable = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  return canUserApproveCountry(sessionData, country);
};

export const getViewPermissionForTable = (
  sessionData: Session | null,
  country: string | null
): boolean => {
  return canUserViewCountry(sessionData, country);
};

// Bulk permission check for multiple countries (useful for dashboards)
export const getUserAccessibleCountries = (
  sessionData: Session | null
): string[] => {
  if (!sessionData) return [];

  const accessibleCountries: string[] = [];

  // If user has global permissions, they can access all countries
  if (hasGlobalPermission(sessionData)) {
    return Object.keys(COUNTRY_MAPPINGS);
  }

  // Check each country for specific permissions
  Object.keys(COUNTRY_MAPPINGS).forEach((country) => {
    const permissions = calculateUserPermissions(sessionData, country);
    if (permissions.canView) {
      accessibleCountries.push(country);
    }
  });

  return accessibleCountries;
};

// Check if user has any permissions at all
export const hasAnyPermissions = (sessionData: Session | null): boolean => {
  if (!sessionData) return false;

  // Check global permissions
  if (hasGlobalPermission(sessionData)) return true;

  // Check country-specific permissions
  return Object.keys(COUNTRY_MAPPINGS).some((country) => {
    const permissions = calculateUserPermissions(sessionData, country);
    return permissions.canView || permissions.canEdit || permissions.canApprove;
  });
};
