import { OnboardingPayload, OnboardingResponse } from "../types";

export async function completedOnboarding(payload: OnboardingPayload): Promise<OnboardingResponse> {
    const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to complete onboarding");
    }
    return data;
}