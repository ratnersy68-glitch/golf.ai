import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import './ui/styles.css';
import { useStore } from './game/store';
import { unpackReplay } from './sim/replay';
(window as any).__apx = { useStore, unpackReplay };
createRoot(document.getElementById('root')!).render(<App />);
