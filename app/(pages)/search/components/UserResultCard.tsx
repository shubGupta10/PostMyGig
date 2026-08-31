import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border-2 border-border rounded-2xl shadow-xs hover:border-border transition-all">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12 border-2 border-muted">
                    <AvatarImage src={user.profilePhoto?.url} alt={user.name} className="object-cover" />
                    <AvatarFallback className="bg-muted text-foreground font-semibold">{initials}</AvatarFallback>
                </Avatar>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-base sm:text-lg">{user.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{user.bio || "No bio available"}</p>
                </div>
            </div>

            {/* Action Button */}
            <Button
                onClick={() => onMessageClick(user._id)}
                className="bg-primary text-primary-foreground font-semibold h-10 px-6 rounded-xl w-full sm:w-auto flex items-center gap-2 cursor-pointer"
            >
                <MessageSquare className="w-4 h-4" />
                Message
            </Button>
        </div>
    );
}
