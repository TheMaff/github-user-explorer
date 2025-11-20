import { GitHubUserService, UserApiError } from '../core/services/github-user.service';
import type { GitHubUser } from '../core/types/github-user';

import './search-form';
import './user-card';

type ViewError = 'NOT_FOUND' | 'API_ERROR' | 'EMPTY' | null;

interface ViewState {
    user: GitHubUser | null;
    loading: boolean;
    error: ViewError;
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-height: 100vh;
    }

    .app {
      max-width: 1040px;
      margin: 0 auto;
      padding: 2.75rem 1.5rem 3.5rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    header {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      align-items: center;
      position: relative;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .brand-mark img {
      display: block;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -100%);
      letter-spacing: 0.08em;
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    p.subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      max-width: 520px;
      margin: 0.25rem 0 0;
    }

    .shell {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--border-subtle);
      padding: 1.5rem 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .search-section {
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .content {
      padding-top: 0.25rem;
    }

    @media (max-width: 640px) {
      .app {
        padding-top: 2rem;
      }

      h1 {
        font-size: 1.7rem;
      }
    }
  </style>

  <main class="app">
    <header>
      <div class="brand">
        <div class="brand-mark logo">
          <img src="/github-logo.svg" alt="GitHub logo" />
        </div>
        <div class="brand-text">
          <div class="eyebrow">GitHub tools</div>
          <h1>GitHub user explorer</h1>
        </div>
      </div>
      <p class="subtitle">
        Busca cualquier usuario público de GitHub y revisa su información principal en una sola vista.
      </p>
    </header>

    <section class="shell">
      <section class="search-section">
        <github-search-form></github-search-form>
      </section>

      <section class="content">
        <github-user-card></github-user-card>
      </section>
    </section>
  </main>
`;
export class AppRoot extends HTMLElement {
    private shadow = this.attachShadow({ mode: 'open' });
    private service = new GitHubUserService();

    private state: ViewState = {
        user: null,
        loading: false,
        error: null,
    };

    connectedCallback() {
        this.shadow.appendChild(template.content.cloneNode(true));

        this.shadow.addEventListener('search-user', (event: Event) => {
            const custom = event as CustomEvent<{ username: string }>;
            this.handleSearch(custom.detail.username);
        });

        this.syncCard();
    }

    private setState(partial: Partial<ViewState>) {
        this.state = { ...this.state, ...partial };
        this.syncCard();
        this.syncSearchForm();
    }

    private syncCard() {
        const card = this.shadow.querySelector<any>('github-user-card');
        if (!card) return;

        card.user = this.state.user;
        card.loading = this.state.loading;
        card.error = this.state.error;
    }

    private syncSearchForm() {
        const form = this.shadow.querySelector<any>('github-search-form');
        if (!form) return;

        form.loading = this.state.loading;
    }

    private async handleSearch(username: string) {
        if (!username.trim()) {
            this.setState({ user: null, error: 'EMPTY' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const user = await this.service.getUser(username);
            this.setState({ user, error: null });
        } catch (error: unknown) {
            if (error instanceof UserApiError) {
                this.setState({ user: null, error: error.kind });
            } else if (error instanceof Error && error.message === 'EMPTY_USERNAME') {
                this.setState({ user: null, error: 'EMPTY' });
            } else {
                this.setState({ user: null, error: 'API_ERROR' });
            }
        } finally {
            this.setState({ loading: false });
        }
    }
}

customElements.define('app-root', AppRoot);
