import { Button } from "@/components/ui/button";
import { BadgeCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import type { SearchUserResult } from "../types";

interface UserResultCardProps {
    user: SearchUserResult;
    onMessageClick: (userId: string) => void;
}

export default function UserResultCard({ user, onMessageClick }: UserResultCardProps) {
    const router = useRouter();
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    return (
        <div
            onClick={() => router.push(`/user/profile/${user._id}`)}
            className="group flex flex-col h-full bg-card rounded-2xl border-2 border-border shadow-sm hover:shadow-md hover:border-border/80 active:scale-[0.99] select-none cursor-pointer transition-all overflow-hidden"
        >
            {/* Top Cover Block (Solid Muted) */}
            <div className="h-20 w-full bg-muted border-b-2 border-border relative flex justify-end p-4">
                {/* Verified Badge moved to top right of the cover for a premium look */}
                {user.isVerified && (
                    <div className="bg-background text-primary px-3 py-1 rounded-full text-xs font-bold border-2 border-border shadow-xs flex items-center gap-1 h-fit">
                        <BadgeCheck className="w-4 h-4" />
                        Verified
                    </div>
                )}
            </div>

            <div className="flex flex-col px-5 pb-5 -mt-10 flex-1 relative">
                {/* Avatar (Overlapping the cover block) */}
                <div className="mb-4">
                    <Avatar className="w-20 h-20 border-4 border-card shadow-sm bg-card">
                        <AvatarImage src={user.profilePhoto?.url} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-xl">{initials}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 w-full">
                    <h3 className="font-bold text-foreground text-lg sm:text-xl tracking-tight line-clamp-1">{user.name}</h3>

                    {/* Experience Stat */}
                    {user.yearsOfExperience !== undefined && user.yearsOfExperience !== null && (
                        <div className="flex items-center mt-1.5 text-sm">
                            <span className="text-foreground font-semibold">
                                {user.yearsOfExperience} {user.yearsOfExperience === 1 ? 'Year' : 'Years'} Experience
                            </span>
                        </div>
                    )}

                    {user.bio ? (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-2.5">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic mt-2.5">
                            No bio available
                        </p>
                    )}

                    {/* Real Skills Badges */}
                    {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-nowrap gap-2 mt-5 overflow-hidden">
                            {user.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="shrink-0 bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs whitespace-nowrap">
                                    {skill}
                                </span>
                            ))}
                            {user.skills.length > 3 && (
                                <span className="shrink-0 bg-muted text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-semibold border-2 border-border whitespace-nowrap">
                                    +{user.skills.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-6 w-full pt-4 border-t-2 border-border">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMessageClick(user._id);
                        }}
                        className="bg-primary text-primary-foreground font-semibold h-11 rounded-xl w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Message
                    </Button>
                </div>
            </div>
        </div>
    );
}
