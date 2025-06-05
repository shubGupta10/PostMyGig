import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      provider: string;
      role: string;
      profilePhoto: string; 
      activityPublic: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    provider: string;
    role: string;
    profilePhoto: string;
  }
}
