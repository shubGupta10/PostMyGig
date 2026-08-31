import type { SearchResponse } from "../types";

export interface SearchFilters {
    minExperience?: number;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
}

export async function fetchSearchResults(
    query: string,
    page: number = 1,
    filters?: SearchFilters
): Promise<SearchResponse | null> {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    params.append("page", page.toString());

    if (filters?.minExperience) params.append("minExperience", filters.minExperience.toString());
    if (filters?.minRate) params.append("minRate", filters.minRate.toString());
    if (filters?.maxRate) params.append("maxRate", filters.maxRate.toString());
    if (filters?.minRating) params.append("minRating", filters.minRating.toString());

    const res = await fetch(`/api/user/search?${params.toString()}`);

    if (!res.ok) {
        throw new Error("Failed to fetch search results");
    }

    const data = await res.json();
    return data as SearchResponse;
}
