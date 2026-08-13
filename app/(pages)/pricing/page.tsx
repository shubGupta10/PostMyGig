"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PlanBadge } from "@/components/subscription/PlanBadge";

export default function PricingPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentPlan = session?.user?.subscription?.plan || "free";

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/subscription/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "pro" }),
            });

            if (res.ok) {
                const data = await res.json();
                await update({ subscription: data.subscription });
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            console.error("Upgrade failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 py-10 sm:py-16">
            <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
                {/* Header */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <PlanBadge plan={currentPlan} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-base text-muted-foreground font-normal leading-relaxed">
                        Choose the plan that fits your workflow. Post gigs, pitch projects, and grow your network without limits.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                    {/* Free Tier */}
                    <Card className="flex flex-col border-2 border-border bg-card shadow-xs rounded-2xl p-6 sm:p-8 space-y-6">
                        <CardHeader className="p-0 space-y-2">
                            <CardTitle className="text-2xl font-bold text-foreground">Free Plan</CardTitle>
                            <p className="text-sm text-muted-foreground font-normal">
                                Perfect for getting started and trying out the platform.
                            </p>
                            <div className="pt-4">
                                <span className="text-4xl font-extrabold text-foreground">₹0</span>
                                <span className="text-sm text-muted-foreground font-normal ml-2">/ month forever</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 space-y-3 pt-4 border-t border-border">
                            <FeatureItem text="15 Gig postings per month (Clients)" />
                            <FeatureItem text="30 Pitch pings per month (Freelancers)" />
                            <FeatureItem text="Standard search placement" />
                            <FeatureItem text="In-app & Email notifications" />
                        </CardContent>

                        <CardFooter className="p-0 pt-6 mt-auto">
                            <Button
                                variant="secondary"
                                disabled={currentPlan === "free"}
                                className="w-full h-11 font-semibold text-sm rounded-xl cursor-default opacity-80"
                            >
                                {currentPlan === "free" ? "Current Plan" : "Downgrade to Free"}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Tier */}
                    <Card className="flex flex-col border-2 border-primary bg-card shadow-md rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <span className="bg-primary text-primary-foreground font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                                Popular
                            </span>
                        </div>

                        <CardHeader className="p-0 space-y-2">
                            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                                Pro Plan <Sparkles className="h-5 w-5 text-primary" />
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-normal">
                                For active clients and serious freelancers looking to win more work.
                            </p>
                            <div className="pt-4">
                                <span className="text-4xl font-extrabold text-foreground">₹75</span>
                                <span className="text-sm text-muted-foreground font-normal ml-2">/ month (Free in Beta)</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 space-y-3 pt-4 border-t border-border">
                            <FeatureItem text="Everything in Free plan" isBold />
                            <FeatureItem text="Up to 50 Gig postings per month (Clients)" isBold />
                            <FeatureItem text="Up to 100 Pitch pings per month (Freelancers)" isBold />
                            <FeatureItem text="Featured Gig Badge for higher responses" />
                            <FeatureItem text="Priority Pitch placement on client dashboards" />
                        </CardContent>

                        <CardFooter className="p-0 pt-6 mt-auto">
                            <Button
                                onClick={handleUpgrade}
                                disabled={currentPlan === "pro" || loading}
                                className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-sm rounded-xl shadow-xs cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Upgrading...
                                    </>
                                ) : currentPlan === "pro" ? (
                                    "Active Pro Subscription"
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Upgrade to Pro (Free in Beta)
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text, isBold = false }: { text: string; isBold?: boolean }) {
    return (
        <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                <Check className="h-3 w-3" />
            </div>
            <span className={isBold ? "font-semibold text-foreground" : "font-normal text-muted-foreground"}>
                {text}
            </span>
        </div>
    );
}
