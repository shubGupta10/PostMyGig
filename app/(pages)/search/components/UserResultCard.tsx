import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface UserResultCardProps {
    user: {
        _id: string;
        name: string;
        bio?: string;
        profilePhoto?: {
            url?: string;
        }
    };
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
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-card rounded-2xl border-2 border-transparent hover:border-primary/20 shadow-xs hover:shadow-md active:scale-[0.99] select-none cursor-pointer transition-all"
        >
            <div className="flex items-center gap-5">
                {/* Avatar */}
                <Avatar className="w-14 h-14 border border-muted shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarImage src={user.profilePhoto?.url} alt={user.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{initials}</AvatarFallback>
                </Avatar>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg sm:text-xl group-hover:text-primary transition-colors">{user.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 mt-1 leading-relaxed">{user.bio || "No bio available"}</p>
                </div>
            </div>

            {/* Action Button */}
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onMessageClick(user._id);
                }}
                className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold h-11 px-6 rounded-xl w-full sm:w-auto flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
            >
                <MessageSquare className="w-4 h-4" />
                Message
            </Button>
        </div>
    );
}
