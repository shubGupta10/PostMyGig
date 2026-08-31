import type { SearchResponse } from "../types";

export async function fetchSearchResults(query: string, page: number = 1): Promise<SearchResponse | null> {
    const res = await fetch(`/api/user/search?q=${encodeURIComponent(query)}&page=${page}`);

    if (!res.ok) {
        throw new Error("Failed to fetch search results");
    }

    const data = await res.json();
    return data as SearchResponse;
}
