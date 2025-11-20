import { type GitHubUser, mapGitHubUser } from '../types/github-user';

const BASE_URL = 'https://api.github.com/users';

export type UserApiErrorKind = 'NOT_FOUND' | 'API_ERROR';

export class UserApiError extends Error {
    constructor(public kind: UserApiErrorKind) {
        super(kind);
        this.name = 'UserApiError';
    }
}

export class GitHubUserService {
    async getUser(username: string): Promise<GitHubUser> {
        const trimmed = username.trim();

        if (!trimmed) {
            throw new Error('EMPTY_USERNAME');
        }

        const response = await fetch(`${BASE_URL}/${encodeURIComponent(trimmed)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new UserApiError('NOT_FOUND');
            }
            throw new UserApiError('API_ERROR');
        }

        const data = await response.json();
        return mapGitHubUser(data);
    }
}
