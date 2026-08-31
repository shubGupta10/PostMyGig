export interface SearchUserResult {
    _id: string;
    name: string;
    bio?: string;
    profilePhoto?: {
        url?: string;
    };
}
