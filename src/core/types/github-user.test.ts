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

    it('usa valores por defecto cuando faltan campos en la respuesta', () => {
        const apiResponse = {
            login: 'user-sin-datos',
            avatar_url: 'http://avatar',
            public_repos: undefined,
            html_url: 'http://github.com/user-sin-datos',
        };

        const user = mapGitHubUser(apiResponse);

        expect(user.name).toBeNull();
        expect(user.bio).toBeNull();
        expect(user.publicRepos).toBe(0);
    });

});
