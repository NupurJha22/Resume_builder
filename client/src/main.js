import './styles/index.css';
import { createRouter } from './app.js';

const app = document.getElementById('app');
const router = createRouter(app);

// Navigate to home on startup
router.navigate('home');
