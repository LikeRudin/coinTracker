import { createRoot } from 'react-dom/client';
import App from '@/app';
const root = document.getElementById('root');
if (!root) throw new Error("Failed to find the root element");
const appRoot = createRoot(root);
appRoot.render(<App/>)