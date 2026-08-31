import type { SearchUserResult } from "../types";

export async function fetchSearchResults(query: string): Promise<SearchUserResult[]> {
    if (!query.trim()) return [];
    
    const res = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch search results");
    }

    const data = await res.json();
    return data.userPipeline || [];
}
