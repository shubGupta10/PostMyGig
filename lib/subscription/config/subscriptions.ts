import { PlanLimits, SubscriptionPlan, QuotaActionType } from "../types";

export const ACTION_TYPES = {
  POST_GIG: 'gig_post',
  SEND_PING: 'ping_send',
} as const;

export const ACTION_LABELS: Record<QuotaActionType, string> = {
  gig_post: 'gig postings',
  ping_send: 'pings',
};

export const PLANS: Record<SubscriptionPlan, PlanLimits> = {
    free: {
        client: {
            maxGigsPerMonth: 2,
            featuredGigs: false,
        },
        freelancer: {
            maxPingsPerMonth: 5,
            priorityPitch: false,
        },
    },
    pro: {
        client: {
            maxGigsPerMonth: 50,
            featuredGigs: true,
        },
        freelancer: {
            maxPingsPerMonth: 100,
            priorityPitch: true
        }
    }
}