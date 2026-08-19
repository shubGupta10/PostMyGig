import { ConnectoDatabase } from '@/lib/db';
import userModel from '@/modules/users/models/UserModel';
import UsageModel from '@/modules/subscriptions/models/UsageModel';
import { PLANS, ACTION_LABELS } from './config/subscriptions';
import { QuotaActionType, SubscriptionPlan, UserUsageStats } from './types';

/**
 * Calculates start and end Date of current billing month
 */
export function getCurrentBillingPeriod(): { periodStart: Date; periodEnd: Date } {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { periodStart, periodEnd };
}

/**
 * Checks if a user has remaining quota to perform an action (posting a gig or sending a ping)
 */
export async function canUserPerformAction(
    userId: string,
    userEmail: string,
    role: 'client' | 'freelancer',
    actionType: QuotaActionType
): Promise<{
    canPerform: boolean;
    usedCount: number;
    maxLimit: number;
    remainingCount: number;
    plan: SubscriptionPlan;
    reason?: string;
}> {
    await ConnectoDatabase();

    // 1. Fetch user's current subscription snapshot
    const user = await userModel.findById(userId).lean();
    const plan: SubscriptionPlan = user?.subscriptionSnapshot?.plan || 'free';

    // 2. Type-safe plan limit lookup based on role
    const planConfig = PLANS[plan];
    const maxLimit =
        role === 'client'
            ? planConfig.client.maxGigsPerMonth
            : planConfig.freelancer.maxPingsPerMonth;

    // 3. Fetch current month usage count from UsageModel
    const { periodStart } = getCurrentBillingPeriod();
    const usageRecord = await UsageModel.findOne({
        userEmail,
        actionType,
        periodStart,
    }).lean();

    const usedCount = usageRecord?.count || 0;
    const remainingCount = Math.max(0, maxLimit - usedCount);
    const canPerform = usedCount < maxLimit;

    return {
        canPerform,
        usedCount,
        maxLimit,
        remainingCount,
        plan,
        reason: canPerform
            ? undefined
            : `Monthly ${ACTION_LABELS[actionType]} limit reached (${usedCount}/${maxLimit}). Upgrade to Pro for more quota.`,
    };
}

/**
 * Atomically increments user usage count for the current billing cycle
 */
export async function incrementUserUsage(
    userId: string,
    userEmail: string,
    actionType: QuotaActionType
): Promise<number> {
    await ConnectoDatabase();
    const { periodStart, periodEnd } = getCurrentBillingPeriod();

    const usage = await UsageModel.findOneAndUpdate(
        { userEmail, actionType, periodStart },
        {
            $inc: { count: 1 },
            $setOnInsert: { userId, periodEnd },
        },
        { upsert: true, new: true }
    );

    return usage.count;
}

/**
 * Fetches current month usage stats for UI dashboard meters
 */
export async function getUserUsageStats(
    userId: string,
    userEmail: string,
    role: 'client' | 'freelancer',
    actionType: QuotaActionType
): Promise<UserUsageStats> {
    await ConnectoDatabase();

    const user = await userModel.findById(userId).lean();
    const plan: SubscriptionPlan = user?.subscriptionSnapshot?.plan || 'free';

    const planConfig = PLANS[plan];
    const maxLimit =
        role === 'client'
            ? planConfig.client.maxGigsPerMonth
            : planConfig.freelancer.maxPingsPerMonth;

    const { periodStart, periodEnd } = getCurrentBillingPeriod();
    const usageRecord = await UsageModel.findOne({
        userEmail,
        actionType,
        periodStart,
    }).lean();

    const usedCount = usageRecord?.count || 0;
    const remainingCount = Math.max(0, maxLimit - usedCount);

    return {
        usedCount,
        maxLimit,
        remainingCount,
        isLimitReached: usedCount >= maxLimit,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
    };
}
