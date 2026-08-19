"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completedOnboarding } from "@/app/(pages)/onboarding/services/onboardingService";
import type { UserRole } from "@/app/(pages)/onboarding/types";
import { toast } from "sonner";
import Image from "next/image";

export default function OnboardingClient() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }

    setIsLoading(true);

    try {
      await completedOnboarding({ role: selectedRole });

      await update({
        role: selectedRole,
        onboardingCompleted: true,
      });

      toast.success(
        selectedRole === "client"
          ? "Welcome to PostMyGig Client Mode!"
          : "Welcome to PostMyGig Freelancer Mode!"
      );

      const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("callback");
      const defaultDestination = selectedRole === "client" ? "/dashboard" : "/view-gigs";
      const destination = callbackUrl || defaultDestination;

      window.location.href = destination;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl border-2 border-border shadow-sm p-8 sm:p-12 space-y-8">
      {/* Top Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Image
            unoptimized
            src="/AppIcon.png"
            alt="PostMyGig Logo"
            width={48}
            height={48}
            className="rounded-xl"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Welcome to PostMyGig
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Select your primary mode below. You can toggle between Client and Freelancer modes anytime.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Client Card */}
        <div
          onClick={() => setSelectedRole("client")}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
            selectedRole === "client"
              ? "border-primary bg-muted shadow-sm"
              : "border-border bg-card hover:border-muted-foreground"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Client Mode</h2>
            {/* Selection Ring Indicator */}
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedRole === "client"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40 bg-transparent"
              }`}
            >
              {selectedRole === "client" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Post gigs & hire talent
          </p>
        </div>

        {/* Freelancer Card */}
        <div
          onClick={() => setSelectedRole("freelancer")}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
            selectedRole === "freelancer"
              ? "border-primary bg-muted shadow-sm"
              : "border-border bg-card hover:border-muted-foreground"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Freelancer Mode</h2>
            {/* Selection Ring Indicator */}
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedRole === "freelancer"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40 bg-transparent"
              }`}
            >
              {selectedRole === "freelancer" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Find work & pitch projects
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isLoading}
          className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl transition-all"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Setting up your account...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}



