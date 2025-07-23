# IntervalController

[![GitHub License](https://img.shields.io/github/license/dafengzhen/interval-controller?color=blue)](https://github.com/dafengzhen/interval-controller)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/interval-controller/pulls)

**IntervalController** is a high-precision, pausable/resumable interval timer controller written in TypeScript. It
supports both `setInterval` and `requestAnimationFrame` modes, making it suitable for a wide range of time-control
scenarios.

[简体中文](./README.zh.md)

# 🔧 What Is It?

**IntervalController** is a powerful and flexible timing utility that goes beyond native `setInterval`, offering:

- Precision timer control (millisecond-level)
- Pause and resume capabilities
- Optional maximum execution limit
- Switchable `requestAnimationFrame` support
- Event-based lifecycle hooks (e.g., `start`, `tick`, `pause`, `resume`, `stop`)

# 💡 Use Cases

- **Animation Controller**: Achieve smoother animations with `requestAnimationFrame`
- **Scheduled Tasks**: Run periodic jobs, update progress, or display countdowns
- **Game Logic**: Frame updates, cooldown timers, and other recurring game logic
- **Form Countdown**: Verification code countdowns, progress steps, etc.
- **Polling Services**: Background data polling with conditional termination

# 📦 Installation

```shell
npm install interval-controller
```

# 🚀 Example Usage

```ts
import {IntervalController} from 'interval-controller';

const controller = new IntervalController((count) => {
  console.log(`Tick ${count}`);
}, 1000);

controller.on('tick', (count) => {
  console.log(`Event tick: ${count}`);
});

controller.on('stop', () => {
  console.log('Stopped!');
});

controller.setMaxCount(5); // Run at most 5 times
controller.start();
```

## Enable requestAnimationFrame Mode

```ts
controller.setUseRAF(true);
```

## Pause and Resume

```ts
controller.pause();

setTimeout(() => {
  controller.resume();
}, 3000);
```

# 🧩 API Design

## Constructor

```text
new IntervalController(callback: (count: number) => void, interval = 1000, tag?: string)
```

| Parameter  | Type                      | Description                              |
|------------|---------------------------|------------------------------------------|
| `callback` | `(count: number) => void` | Function executed on each tick           |
| `interval` | `number`                  | Interval in milliseconds (default: 1000) |
| `tag`      | `string` (optional)       | Debug/logging identifier                 |

## Common Methods

| Method                                | Description                                   |
|---------------------------------------|-----------------------------------------------|
| `start(delay?: number)`               | Starts the timer, optionally after a delay    |
| `pause()`                             | Pauses execution                              |
| `resume()`                            | Resumes from pause                            |
| `stop()`                              | Stops and resets the timer                    |
| `updateInterval(newInterval: number)` | Dynamically updates the interval              |
| `setMaxCount(count: number \| null)`  | Sets the maximum number of ticks              |
| `setUseRAF(enabled: boolean)`         | Enables/disables `requestAnimationFrame` mode |

## Events

| Event Name       | Description                        |
|------------------|------------------------------------|
| `start`          | Triggered when the timer starts    |
| `tick`           | Triggered on each tick             |
| `pause`          | Triggered when paused              |
| `resume`         | Triggered when resumed             |
| `stop`           | Triggered when stopped             |
| `intervalChange` | Triggered on `updateInterval` call |

Register and remove event listeners:

```ts
controller.on('tick', listener);
controller.off('tick', listener);
controller.once('tick', listener); // Fires only once
```

## State & Properties

| Method                                              | Description                                   |
|-----------------------------------------------------|-----------------------------------------------|
| `getState()` → `'paused' \| 'running' \| 'stopped'` | Returns current timer state                   |
| `getCount()`                                        | Returns the current tick count                |
| `getInterval()`                                     | Returns the current interval                  |
| `getLastExecutionTime()`                            | Returns the timestamp of the last tick        |
| `getNextExecutionTime()`                            | Returns the timestamp of the next tick        |
| `getProgress()` → `number \| null`                  | Returns progress if max count is set          |
| `getTag()`                                          | Returns the optional tag                      |
| `getTotalPausedTime()`                              | Returns total paused duration in milliseconds |

# ✅ Best Practices

- For animations, enable `setUseRAF(true)` for smoother frames
- For background jobs or polling, the default `setInterval` is more power-efficient
- Use `setMaxCount()` to prevent infinite loops
- When sharing a timer across components, use the `tag` to label and debug sources
- Note: `requestAnimationFrame` is not available in Node.js and will automatically fall back to `setInterval`

# 🧑‍💻 License

[MIT](https://opensource.org/licenses/MIT)

