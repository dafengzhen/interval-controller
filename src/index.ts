type EventName = 'intervalChange' | 'pause' | 'resume' | 'start' | 'stop' | 'tick';

type Listener = (...args: any[]) => void;

/**
 * IntervalController.
 *
 * @author dafengzhen
 */
export class IntervalController {
  private readonly callback: (count: number) => void;

  private counter = 0;

  private eventListeners = new Map<EventName, Set<Listener>>();

  private interval: number;

  private isPaused = false;

  private lastTick: null | number = null;

  private maxCount: null | number = null;

  private pausedAt: null | number = null;

  private rafId: null | number = null;

  private startTime: null | number = null;

  private readonly tag?: string;

  private timerId: null | number = null;

  private totalPausedTime = 0;

  private useRAF = false;

  constructor(callback: (count: number) => void, interval = 1000, tag?: string) {
    this.callback = callback;
    this.interval = Math.max(0, Math.floor(interval));
    this.tag = tag;
  }

  getCount() {
    return this.counter;
  }

  getInterval() {
    return this.interval;
  }

  getLastExecutionTime() {
    return this.lastTick;
  }

  getNextExecutionTime() {
    return this.lastTick ? this.lastTick + this.interval : null;
  }

  getProgress() {
    return this.maxCount ? this.counter / this.maxCount : null;
  }

  getState(): 'paused' | 'running' | 'stopped' {
    if (this.isPaused) {
      return 'paused';
    }
    if (this.timerId !== null || this.rafId !== null) {
      return 'running';
    }
    return 'stopped';
  }

  getTag() {
    return this.tag;
  }

  getTotalPausedTime() {
    return this.totalPausedTime;
  }

  off(event: EventName, listener: Listener) {
    this.eventListeners.get(event)?.delete(listener);
  }

  on(event: EventName, listener: Listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  once(event: EventName, listener: Listener) {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  pause() {
    if (this.isPaused || (!this.timerId && !this.rafId)) {
      return;
    }

    this.clearTimers();
    this.isPaused = true;
    this.pausedAt = Date.now();
    this.emit('pause');
  }

  resume() {
    if (!this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.emit('resume');

    if (this.pausedAt) {
      this.totalPausedTime += Date.now() - this.pausedAt;
      this.pausedAt = null;
    }

    const now = Date.now();
    const elapsed = this.lastTick ? now - this.lastTick : 0;
    const delay = Math.max(0, this.interval - elapsed);

    this.timerId = setTimeout(() => {
      this.runTick();
      if (this.useRAF) {
        this.scheduleRAF();
      } else {
        this.startInterval();
      }
    }, delay) as unknown as number;
  }

  setMaxCount(count: null | number) {
    this.maxCount = count != null ? Math.max(1, Math.floor(count)) : null;
  }

  setUseRAF(enabled: boolean) {
    if (this.useRAF === enabled) {
      return;
    }

    const running = this.getState() === 'running';
    if (running) {
      this.pause();
    }

    this.useRAF = enabled;

    if (running) {
      this.resume();
    }
  }

  start(delay = 0) {
    if ((this.timerId || this.rafId) && !this.isPaused) {
      return;
    }

    this.stop(); // clean previous state
    this.isPaused = false;

    const launch = () => {
      this.startTime = Date.now();
      this.emit('start');
      this.runTick();

      if (this.useRAF) {
        this.scheduleRAF();
      } else {
        this.startInterval();
      }
    };

    if (delay > 0) {
      this.timerId = setTimeout(launch, delay) as unknown as number;
    } else {
      launch();
    }
  }

  stop() {
    if (!this.timerId && !this.rafId && !this.isPaused) {
      return;
    }

    this.clearTimers();
    this.isPaused = false;
    this.counter = 0;
    this.startTime = null;
    this.lastTick = null;
    this.totalPausedTime = 0;
    this.pausedAt = null;

    this.emit('stop');
  }

  updateInterval(newInterval: number) {
    const updated = Math.max(0, Math.floor(newInterval));
    if (updated === this.interval) {
      return;
    }

    this.interval = updated;
    this.emit('intervalChange', this.interval);

    if ((this.timerId || this.rafId) && !this.isPaused) {
      this.pause();
      this.resume();
    }
  }

  private clearTimers() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.rafId !== null) {
      this.getCancelRAF()?.(this.rafId);
      this.rafId = null;
    }
  }

  private emit(event: EventName, ...args: any[]) {
    this.eventListeners.get(event)?.forEach((fn) => fn(...args));
  }

  private getCancelRAF(): null | typeof cancelAnimationFrame {
    return typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : null;
  }

  private getRAF(): null | typeof requestAnimationFrame {
    return typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
  }

  private runTick() {
    this.counter++;
    this.lastTick = Date.now();
    this.callback(this.counter);
    this.emit('tick', this.counter);

    if (this.maxCount !== null && this.counter >= this.maxCount) {
      this.stop();
    }
  }

  private scheduleRAF() {
    const raf = this.getRAF();
    if (!raf) {
      console.warn('[IntervalController] RAF unavailable, falling back to setInterval.');
      this.startInterval();
      return;
    }

    const loop = () => {
      const now = Date.now();
      if (!this.lastTick || now - this.lastTick >= this.interval) {
        this.runTick();
      }
      this.rafId = raf(loop);
    };
    this.rafId = raf(loop);
  }

  private startInterval() {
    this.timerId = setInterval(() => this.runTick(), this.interval) as unknown as number;
  }
}
