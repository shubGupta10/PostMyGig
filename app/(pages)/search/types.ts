export interface SearchUserResult {
    _id: string;
    name: string;
    bio?: string;
    profilePhoto?: {
        url?: string;
    };
    isVerified?: boolean;
    skills?: string[];
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
