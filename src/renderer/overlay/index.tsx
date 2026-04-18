import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('overlay-root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
