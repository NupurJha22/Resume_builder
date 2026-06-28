import { renderHome } from './pages/Home.js';
import { BuilderPage } from './pages/Builder.js';
import { MyResumesPage } from './pages/MyResumes.js';

class Router {
  constructor(appEl) {
    this.appEl = appEl;
    this.currentPage = null;
  }

  async navigate(page, options = {}) {
    this.appEl.innerHTML = '';
    this.appEl.style.opacity = '0';

    setTimeout(() => {
      this.appEl.style.transition = 'opacity 0.25s ease';
      this.appEl.style.opacity = '1';
    }, 50);

    switch (page) {
      case 'home':
        this.appEl.innerHTML = renderHome(this);
        break;

      case 'builder': {
        const builder = new BuilderPage(options);
        await builder.init(this.appEl);
        break;
      }

      case 'my-resumes': {
        const myResumes = new MyResumesPage();
        await myResumes.init(this.appEl);
        break;
      }

      default:
        this.appEl.innerHTML = renderHome(this);
    }

    window.scrollTo(0, 0);
  }
}

export function createRouter(appEl) {
  const router = new Router(appEl);
  window.router = router;
  return router;
}
