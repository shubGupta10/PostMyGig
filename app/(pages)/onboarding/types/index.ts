export type UserRole = "client" | "freelancer";

export interface OnboardingPayload {
    role: UserRole;
}

export interface OnboardingResponse {
    message: string;
    user?: {
        id: string;
        role: string;
        onboardingCompleted: boolean;
    };
}
