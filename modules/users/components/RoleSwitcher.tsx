"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { completedOnboarding } from "@/app/(pages)/onboarding/services/onboardingService";

export function RoleSwitcher() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (!session?.user) return null;

    const currentRole = session.user.role || "freelancer";
    const isFreelancer = currentRole === "freelancer";

    const handleToggleRole = async (checked: boolean) => {
        const targetRole = checked ? "freelancer" : "client";
        setIsLoading(true);

        try {
            await completedOnboarding({ role: targetRole });

            await update({ role: targetRole });

            toast.success(
                targetRole === "client"
                    ? "Switched to Client Mode"
                    : "Switched to Freelancer Mode"
            );

            if (targetRole === "freelancer" && (pathname === "/add-gigs" || pathname === "/applications")) {
                router.push("/view-gigs");
            } else if (targetRole === "client" && pathname === "/ping") {
                router.push("/dashboard");
            }

            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to switch role");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            onClick={() => !isLoading && handleToggleRole(!isFreelancer)}
            className="flex items-center justify-between gap-2.5 min-w-[145px] bg-secondary text-secondary-foreground px-3.5 py-1.5 rounded-xl shadow-xs select-none cursor-pointer hover:opacity-90 transition-all"
        >
            <span className="text-xs font-semibold">
                {isFreelancer ? "Freelancer Mode" : "Client Mode"}
            </span>
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            ) : (
                <Switch
                    id="role-mode-switch"
                    checked={isFreelancer}
                    onCheckedChange={handleToggleRole}
                    disabled={isLoading}
                />
            )}
        </div>
    );
}


