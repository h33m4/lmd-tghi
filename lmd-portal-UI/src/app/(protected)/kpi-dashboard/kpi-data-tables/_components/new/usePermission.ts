import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { isUserAllowed } from "@/utils/isUserAllowed";

export const usePermissions = (
  requiredPermissions: string[] = ["global_publisher", "super_administrator"]
) => {
  const { data: session, status } = useSession();

  const hasPermission = useMemo(() => {
    if (status === "loading") return false;
    if (!session) return false;
    return isUserAllowed(session, requiredPermissions);
  }, [session, status, requiredPermissions]);

  return {
    hasPermission,
    isLoading: status === "loading",
    session,
  };
};
