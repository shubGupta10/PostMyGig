"use client";

import { UserUsageStats } from "@/lib/subscription/types";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface UsageMeterProps {
    stats: UserUsageStats;
    label: string;
    onUpgradeClick?: () => void;
}

export function UsageMeter({ stats, label, onUpgradeClick }: UsageMeterProps) {
    const router = useRouter();
    const percentage = Math.min(100, Math.round((stats.usedCount / stats.maxLimit) * 100));

    const handleUpgrade = () => {
        if (onUpgradeClick) {
            onUpgradeClick();
        } else {
            router.push("/pricing");
        }
    };

    return (
        <div className="bg-background rounded-2xl border-2 border-border p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Monthly Quota Usage
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mt-1">
                        {stats.usedCount} of {stats.maxLimit} {label} Used
                    </h3>
                </div>
                {stats.isLimitReached && (
                    <Button
                        onClick={handleUpgrade}
                        size="sm"
                        className="h-9 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs rounded-xl shadow-xs cursor-pointer px-4"
                    >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Upgrade
                    </Button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${stats.isLimitReached ? "bg-destructive" : "bg-primary"
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-normal">
                    <span>{percentage}% Used</span>
                    <span>{stats.remainingCount} Remaining</span>
                </div>
            </div>
        </div>
    );
}
