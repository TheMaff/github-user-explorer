import './components/app-root';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = '<app-root></app-root>';
}
