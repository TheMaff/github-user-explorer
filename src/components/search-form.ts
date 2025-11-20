const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    form {
      display: flex;
      gap: 0.75rem;
      align-items: stretch;
      max-width: 640px;
      margin: 0 auto;
    }

    .field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    label span {
      font-size: 0.8rem;
      color: var(--text-soft);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .input-shell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.75rem;
      border-radius: 999px;
      border: 1px solid var(--border-subtle);
      background: #ffffff;
      box-shadow: 0 1px 0 rgba(208, 215, 222, 0.7);
    }

    .input-shell input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.95rem;
      background: transparent;
      color: var(--text-primary);
    }

    .input-shell input::placeholder {
      color: #8c959f;
    }

    button {
      padding: 0.55rem 1.15rem;
      border-radius: 999px;
      border: 1px solid #1f6feb;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      background: var(--accent);
      color: #ffffff;
      transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease, transform 0.1s ease;
      white-space: nowrap;
    }

    button:hover {
      background: #1158c7;
      border-color: #1f6feb;
      box-shadow: 0 4px 14px rgba(31, 111, 235, 0.4);
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
      box-shadow: none;
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: default;
        box-shadow: none;
        transform: none;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    @media (max-width: 640px) {
      form {
        flex-direction: column;
      }

      button {
        width: 100%;
        justify-content: center;
      }
    }
  </style>

  <form novalidate role="search" aria-label="Búsqueda de usuarios de GitHub">
    <div class="field">
      <label>
        <div class="input-shell">
          <input
            id="username-input"
            type="text"
            name="username"
            autocomplete="off"
            placeholder="Busca por nombre de usuario, ej. Midudev, devjaime, TheMaff..."
            aria-label="Nombre de usuario de GitHub"
            aria-required="true"
            aria-describedby="search-hint"
          />
        </div>
      </label>
    </div>
    <button type="submit" aria-label="Buscar usuario">
      <span aria-hidden="true">Buscar usuario</span>
      <span class="sr-only">Buscar usuario de GitHub</span>
    </button>
  </form>
`;

export class GitHubSearchForm extends HTMLElement {
    private shadow = this.attachShadow({ mode: 'open' });
    private _loading = false;

    set loading(value: boolean) {
      this._loading = value;
      const button = this.shadow.querySelector<HTMLButtonElement>('button[type="submit"]');
      const input = this.shadow.querySelector<HTMLInputElement>('input[name="username"]');

      if (button) {
        button.disabled = value;
      }

      if (input) {
        input.disabled = value;
        input.setAttribute('aria-busy', String(value));
      }
    }

    get loading() {
      return this._loading;
    }

    connectedCallback() {
      this.shadow.appendChild(template.content.cloneNode(true));
      this.loading = this._loading;

      const form = this.shadow.querySelector('form');
      const input = this.shadow.querySelector<HTMLInputElement>('input[name="username"]');
      
      form?.addEventListener('submit', (event) => {
        event.preventDefault();
          const username = input?.value ?? '';

        this.dispatchEvent(
          new CustomEvent('search-user', {
            detail: { username },
            bubbles: true,
            composed: true,
          }),
        );
      });

      input?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !this._loading) {
          form?.requestSubmit();
        }
      });
    }
}

customElements.define('github-search-form', GitHubSearchForm);
