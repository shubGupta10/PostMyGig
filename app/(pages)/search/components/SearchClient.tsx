"use client"

import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Loading from "../loading";
import UserResultCard from "./UserResultCard";
import { fetchSearchResults } from "../services/searchService";
import type { SearchUserResult } from "../types";

interface SearchClientProps {
    userRole: string;
}

export function SearchClient({ userRole }: SearchClientProps) {
    const router = useRouter();

    const [searchTerms, setSearchTerms] = useState("");
    const [debouncedTerm, setDebounceTerms] = useState("");
    const [results, setResults] = useState<SearchUserResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load saved search state on mount
    useEffect(() => {
        setIsMounted(true);
        const savedTerm = sessionStorage.getItem("savedSearchTerm");
        const savedResults = sessionStorage.getItem("savedSearchResults");

        if (savedTerm) {
            setSearchTerms(savedTerm);
            setDebounceTerms(savedTerm);
        }
        if (savedResults) {
            try {
                setResults(JSON.parse(savedResults));
            } catch (e) {
                console.error("Failed to parse saved results");
            }
        }
    }, []);

    // Save term and debounce
    useEffect(() => {
        if (!isMounted) return;

        sessionStorage.setItem("savedSearchTerm", searchTerms);

        const timer = setTimeout(() => setDebounceTerms(searchTerms), 500);
        return () => clearTimeout(timer);
    }, [searchTerms, isMounted]);

    // Fetch and save results using the service layer
    useEffect(() => {
        if (!isMounted) return;

        const fetchResults = async () => {
            if (!debouncedTerm.trim()) {
                setResults([]);
                sessionStorage.removeItem("savedSearchResults");
                return;
            }

            if (results.length === 0) setIsLoading(true);

            try {
                const newResults = await fetchSearchResults(debouncedTerm);
                setResults(newResults);
                sessionStorage.setItem("savedSearchResults", JSON.stringify(newResults));
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [debouncedTerm, isMounted]);

    const handleMessageClick = (userId: string) => {
        router.push(`/chat-history?userId=${userId}&chatType=DM`);
    }

    const isSearching = searchTerms.trim().length > 0;
    const heading = userRole === "client" ? "Find Freelancers" : "Find Clients";
    const subtext = userRole === "client"
        ? "Discover and connect with top freelancers for your next project."
        : "Discover and connect with clients looking for your skills.";
    const placeholder = userRole === "client"
        ? "Search by name, skill, or role..."
        : "Search by name, company, or industry...";

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Sticky Container for Header & Search */}
            <div className="sticky top-0 z-10 bg-background pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                
                {/* Animated Heading & Description */}
                <div 
                    className={`text-center transition-all duration-500 ease-in-out overflow-hidden ${
                        isSearching ? "max-h-0 opacity-0 mb-0" : "max-h-40 opacity-100 mb-8"
                    }`}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {heading}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        {subtext}
                    </p>
                </div>

                {/* The Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        value={searchTerms}
                        onChange={(e) => setSearchTerms(e.target.value)}
                        autoFocus
                        className="h-16 pl-12 pr-6 text-base sm:text-lg bg-card border-2 border-border focus:border-primary placeholder:text-muted-foreground rounded-2xl shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Scrollable Results */}
            <div className="flex-1 overflow-y-auto pt-6 pb-24">
                <div className="space-y-4 max-w-2xl mx-auto">
                    {isLoading && <Loading />}

                    {/* Actual Results */}
                    {!isLoading && results.map((user) => (
                        <UserResultCard key={user._id} user={user} onMessageClick={handleMessageClick} />
                    ))}

                    {/* Empty search state */}
                    {!isLoading && results.length === 0 && debouncedTerm && (
                        <div className="text-center py-20 bg-muted border-2 border-dashed border-border rounded-2xl">
                            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground text-base">No results for "{debouncedTerm}"</h3>
                            <p className="text-sm text-muted-foreground mt-1">Try searching with a different name or skill.</p>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
