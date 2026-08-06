"use client";

import { Button } from "@/components/ui/button";

export default function PricingError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-card border-2 border-border p-8 rounded-2xl max-w-md space-y-4 shadow-xs">
                <h2 className="text-xl font-semibold text-foreground">Something went wrong!</h2>
                <p className="text-sm text-muted-foreground font-normal">
                    {error.message || "Failed to load pricing details. Please try again."}
                </p>
                <Button
                    onClick={reset}
                    className="h-10 bg-primary text-primary-foreground font-semibold text-xs px-6 rounded-xl cursor-pointer shadow-xs"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
