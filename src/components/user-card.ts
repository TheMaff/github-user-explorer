import type { GitHubUser } from '../core/types/github-user';
import type { UserApiErrorKind } from '../core/services/github-user.service';

type CardError = UserApiErrorKind | 'EMPTY' | null;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    .card {
      max-width: 520px;
      margin: 0 auto;
      padding: 1.5rem 1.75rem;
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 4px 12px rgba(140, 149, 159, 0.15);
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1.25rem;
      align-items: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      background: #f6f8fa;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .login {
      font-size: 0.9rem;
      color: var(--text-soft);
    }

    .bio {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
    }

    .meta {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.6rem;
    }

    a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    .status {
      max-width: 520px;
      margin: 0.5rem auto 0;
      font-size: 0.9rem;
      text-align: center;
      color: var(--text-muted);
    }

    .status-err {
      color: #cf222e;
    }

    .status-muted {
      color: var(--text-soft);
      opacity: 0.8;
      text-align: center;
      margin-top: 0.75rem;
    }

    .status-muted.small {
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .spinner {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      border: 3px solid rgba(208, 215, 222, 0.7);
      border-top-color: var(--accent);
      animation: spin 0.6s linear infinite;
      margin: 0.6rem auto 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 540px) {
      .card {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .avatar {
        margin: 0 auto;
      }

      .info {
        align-items: center;
      }
    }
  </style>

  <div id="content"></div>
`;

export class GitHubUserCard extends HTMLElement {
    private shadow = this.attachShadow({ mode: 'open' });
    private _user: GitHubUser | null = null;
    private _loading = false;
    private _error: CardError = null;

    set user(value: GitHubUser | null) {
        this._user = value;
        this.render();
    }

    set loading(value: boolean) {
        this._loading = value;
        this.render();
    }

    set error(value: CardError) {
        this._error = value;
        this.render();
    }

    connectedCallback() {
        this.shadow.appendChild(template.content.cloneNode(true));
        this.render();
    }

    private render() {
        const container = this.shadow.querySelector<HTMLDivElement>('#content');
        if (!container) return;

        if (this._loading) {
            container.innerHTML = `
        <p class="status">Buscando usuario...</p>
        <div class="spinner" role="status" aria-label="Cargando"></div>
      `;
            return;
        }

        if (this._error === 'EMPTY') {
            container.innerHTML = `<p class="status">Ingresa un nombre de usuario para iniciar la búsqueda.</p>`;
            return;
        }

        if (this._error === 'NOT_FOUND') {
            container.innerHTML = `<p class="status status-err">No encontramos ese usuario de GitHub. Revisa el nombre e inténtalo de nuevo.</p>`;
            return;
        }

        if (this._error === 'API_ERROR') {
            container.innerHTML = `<p class="status status-err">Ocurrió un error al consultar la API de GitHub. Intenta más tarde.</p>`;
            return;
        }

        if (!this._user) {
            container.innerHTML = `<p class="status status-muted">Busca un usuario de GitHub para comenzar.</p>`;
            return;
        }

        const user = this._user;

        container.innerHTML = `
      <article class="card">
        <div class="avatar">
          <img src="${user.avatarUrl}" alt="Avatar de ${user.login}" />
        </div>
        <div class="info">
          <div class="name">${user.name ?? user.login}</div>
          <div class="login">@${user.login}</div>
          ${user.bio ? `<p class="bio">${user.bio}</p>` : ''}
          <p class="meta">
            <strong>${user.publicRepos}</strong> repos públicos ·
            <a href="${user.profileUrl}" target="_blank" rel="noreferrer">Ver perfil</a>
          </p>
        </div>
        </article>

        <p class="status-muted small">
            Datos obtenidos en tiempo real desde la GitHub Public API.
        </p>
    `;
    }
}

customElements.define('github-user-card', GitHubUserCard);
