"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function UpgradeModal({
    isOpen,
    onClose,
    title = "Monthly Limit Reached",
    description = "Upgrade to PostMyGig Pro to unlock higher limits, priority visibility, and instant alerts.",
}: UpgradeModalProps) {
    const [loading, setLoading] = useState(false);
    const { update } = useSession();
    const router = useRouter();

    const handleBetaUpgrade = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "pro" }),
            });

            if (res.ok) {
                const data = await res.json();
                // Refresh NextAuth session
                await update({ subscription: data.subscription });
                onClose();
                router.refresh();
            }
        } catch (error) {
            console.error("Upgrade error:", error);
        } finally {
            setLoading(false);
        }
    };

    const proFeatures = [
        "Everything in Free plan",
        "Up to 50 Gig Postings / 100 Pings per Month",
        "Featured Gig Badge for higher applicant response",
        "Priority Pitch placement on client dashboards",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card border-2 border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <DialogHeader className="space-y-2 text-left">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-xs">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground font-normal leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* Feature List */}
                <div className="space-y-3 py-2">
                    {proFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-foreground">
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-xs sm:text-sm">{feat}</span>
                        </div>
                    ))}
                </div>

                {/* Upgrade Actions */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleBetaUpgrade}
                        disabled={loading}
                        className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-sm rounded-xl shadow-xs cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Upgrading Account...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Upgrade to Pro (Beta Free)
                            </>
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="w-full h-10 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                        Maybe Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
