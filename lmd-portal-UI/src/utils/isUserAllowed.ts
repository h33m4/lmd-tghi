import { Session } from "next-auth";

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
