import NextAuth, { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string | undefined;
      title: string;
      department: string;
      groups: string[];
    } & DefaultSession["user"];
    accessToken?: string | undefined;
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    title: string;
    department: string;
    groups: string[];
    accessToken?: string;
    refreshToken?: string;
    tokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    groups: string[];
    title: string;
    department: string;
  }
}
