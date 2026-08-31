export interface SearchUserResult {
    _id: string;
    name: string;
    bio?: string;
    profilePhoto?: {
        url?: string;
    };
    isVerified?: boolean;
    skills?: string[];
    yearsOfExperience?: number;
    hourlyRate?: number;
}

export interface SearchPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SearchResponse {
    userPipeline: SearchUserResult[];
    pagination: SearchPagination;
}
