import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 py-10 sm:py-16">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-3 flex flex-col items-center">
                    <Skeleton className="h-8 w-48 rounded-xl" />
                    <Skeleton className="h-4 w-96 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6">
                    <Skeleton className="h-96 w-full rounded-2xl border-2 border-border" />
                    <Skeleton className="h-96 w-full rounded-2xl border-2 border-border" />
                </div>
            </div>
        </div>
    );
}
