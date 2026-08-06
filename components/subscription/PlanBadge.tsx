"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { SubscriptionPlan } from "@/lib/subscription/types";

export function PlanBadge({ plan = "free" }: { plan?: SubscriptionPlan }) {
    if (plan === "pro") {
        return (
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full text-xs inline-flex items-center gap-1.5 shadow-xs border-transparent">
                <Sparkles className="h-3.5 w-3.5" />
                PRO
            </Badge>
        );
    }

    return (
        <Badge className="bg-secondary text-secondary-foreground font-semibold px-3 py-1 rounded-full text-xs inline-flex items-center gap-1.5 border-border shadow-xs">
            FREE PLAN
        </Badge>
    );
}
