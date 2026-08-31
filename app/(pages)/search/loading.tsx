import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-4 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-card border-2 border-border rounded-2xl shadow-xs">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
            ))}
        </div>
    );
}
