import { describe, it, expect } from 'vitest';
import { mapGitHubUser } from './github-user';

describe('mapGitHubUser', () => {
    it('mapea la respuesta de la API al modelo de dominio', () => {
        const apiResponse = {
            login: 'TheMaff',
            name: 'Marcos',
            avatar_url: 'http://avatar',
            bio: 'Frontend dev',
            public_repos: 42,
            html_url: 'http://github.com/TheMaff',
        };

        const user = mapGitHubUser(apiResponse);

        expect(user.login).toBe('TheMaff');
        expect(user.name).toBe('Marcos');
        expect(user.publicRepos).toBe(42);
        expect(user.profileUrl).toBe('http://github.com/TheMaff');
    });
});
