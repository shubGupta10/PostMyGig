"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-destructive text-destructive-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">{error.message}</p>
                <button
                    onClick={reset}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
