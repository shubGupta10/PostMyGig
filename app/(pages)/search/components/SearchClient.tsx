"use client"

import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { useRouter } from "next/navigation"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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

    // Reset page to 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [debouncedTerm]);

    // Fetch and save results using the service layer
    useEffect(() => {
        if (!isMounted) return;

        const fetchResults = async () => {
            if (!debouncedTerm.trim()) {
                setResults([]);
                setTotalPages(1);
                sessionStorage.removeItem("savedSearchResults");
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetchSearchResults(debouncedTerm, page);
                if (response) {
                    setResults(response.userPipeline);
                    setTotalPages(response.pagination.totalPages || 1);
                    if (page === 1) {
                        sessionStorage.setItem("savedSearchResults", JSON.stringify(response.userPipeline));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [debouncedTerm, page, isMounted]);

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



                {/* Animated Description */}
                <div
                    className={`text-center transition-all duration-500 ease-in-out overflow-hidden ${isSearching ? "max-h-0 opacity-0 mb-0" : "max-h-20 opacity-100 mb-6"
                        }`}
                >
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        {subtext}
                    </p>
                </div>

                {/* The Search Bar */}
                <div className="relative max-w-4xl mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        value={searchTerms}
                        onChange={(e) => setSearchTerms(e.target.value)}
                        autoFocus
                        className="h-16 pl-12 pr-6 text-base sm:text-lg bg-card border-none focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground rounded-2xl shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Scrollable Results */}
            <div className="flex-1 overflow-y-auto pt-6 pb-24">
                <div className="space-y-4 max-w-4xl mx-auto">
                    {isLoading && <Loading />}

                    {/* Actual Results */}
                    {!isLoading && results.map((user) => (
                        <UserResultCard key={user._id} user={user} onMessageClick={handleMessageClick} />
                    ))}

                    {/* Numbered Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="pt-6 pb-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(p => p - 1);
                                            }}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(pageNum);
                                                }}
                                                isActive={pageNum === page}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages) setPage(p => p + 1);
                                            }}
                                            className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    {/* Empty search state */}
                    {!isLoading && results.length === 0 && debouncedTerm && (
                        <div className="text-center py-20 bg-muted rounded-2xl">
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
