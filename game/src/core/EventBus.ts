/** Tiny typed event bus so systems stay decoupled (UI, audio, VFX all listen to gameplay). */
export class EventBus<Events extends { [K in keyof Events]: unknown }> {
  private handlers = new Map<keyof Events, Set<(p: never) => void>>();

  on<K extends keyof Events>(type: K, fn: (payload: Events[K]) => void): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(fn as (p: never) => void);
    return () => this.handlers.get(type)?.delete(fn as (p: never) => void);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    this.handlers.get(type)?.forEach((fn) => (fn as (p: Events[K]) => void)(payload));
  }
}
