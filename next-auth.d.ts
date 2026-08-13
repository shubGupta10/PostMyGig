import { DefaultSession, DefaultUser } from "next-auth";
import { SubscriptionSnapshot } from "./lib/subscription/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider: string;
      role: string;
      profilePhoto: string;
      activityPublic: boolean;
      onboardingCompleted: boolean;
      isAdmin: boolean;
      subscription?: SubscriptionSnapshot;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    profilePhoto: string;
    onboardingCompleted?: boolean;
    isAdmin?: boolean;
    subscription?: SubscriptionSnapshot;
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    role?: string;
    activityPublic?: boolean;
    onboardingCompleted?: boolean;
    isAdmin?: boolean;
    subscription?: SubscriptionSnapshot;
  }
}
