import { InputManager } from '../game/input';
import { defaultSettings } from '../game/progress';
/** Single shared input manager (keyboard/gamepad/touch). Settings are swapped in by App. */
export const input = new InputManager(defaultSettings());
