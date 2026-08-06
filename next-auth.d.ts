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
      subscription?: SubscriptionSnapshot;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    profilePhoto: string;
    onboardingCompleted?: boolean;
    subscription?: SubscriptionSnapshot;
  }
}

// THIS BLOCK ADDS `subscription` TO `token.` IN VS CODE
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    role?: string;
    activityPublic?: boolean;
    onboardingCompleted?: boolean;
    subscription?: SubscriptionSnapshot;
  }
}
