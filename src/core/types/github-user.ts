// User Model for GitHub API responses
export interface GitHubUser {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    publicRepos: number;
    profileUrl: string;
}

// API Mapper for GitHub User 
export function mapGitHubUser(apiResponse: any): GitHubUser {
    return {
        login: apiResponse.login ?? '',
        name: apiResponse.name ?? null,
        avatarUrl: apiResponse.avatar_url ?? '',
        bio: apiResponse.bio ?? null,
        publicRepos: apiResponse.public_repos ?? 0,
        profileUrl: apiResponse.html_url ?? '',
    };
}
