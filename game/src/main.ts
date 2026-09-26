import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import './ui/styles.css';
import { Game } from './core/Game';

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const ui = document.getElementById('ui') as HTMLElement;
const game = new Game(canvas, ui);

game.ui.loading(true);
document.fonts?.ready.finally(() => undefined);
requestAnimationFrame(async () => {
  await game.boot();
  game.ui.go('menu');
  game.ui.loading(false);
  (window as unknown as { ready: boolean }).ready = true;
});

// handy for debugging on device
(window as unknown as { game: Game }).game = game;
