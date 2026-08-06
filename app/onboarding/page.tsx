import { Suspense } from "react";
import OnboardingClient from "@/components/onboarding/OnboardingClient";

export default function OnboardingPage() {
    return (
        <div className="w-full max-w-2xl mx-auto py-8">
            <Suspense>
                <OnboardingClient />
            </Suspense>
        </div>
    );
}


