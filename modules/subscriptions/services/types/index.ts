export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';
export type SubscriptionProvider = 'manual' | 'beta' | 'stripe' | 'razorpay';
export type QuotaActionType = 'gig_post' | 'ping_send';

export interface SubscriptionSnapshot {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    expiresAt: string | null;
}

export interface PlanLimits {
    client: {
        maxGigsPerMonth: number;
        featuredGigs: boolean;
    };
    freelancer: {
        maxPingsPerMonth: number;
        priorityPitch: boolean;
    };
}

export interface UserUsageStats {
    usedCount: number;
    maxLimit: number;
    remainingCount: number;
    isLimitReached: boolean;
    periodStart: string;
    periodEnd: string;
}
