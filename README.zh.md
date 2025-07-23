# IntervalController

[![GitHub License](https://img.shields.io/github/license/dafengzhen/interval-controller?color=blue)](https://github.com/dafengzhen/interval-controller)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/interval-controller/pulls)

**IntervalController** 是一个 TypeScript 编写的高精度、可暂停与恢复、支持最大执行次数控制的定时器控制器，支持 `setInterval` 与
`requestAnimationFrame` 双模式运行，适用于多种复杂的时间控制场景

[English](./README.md)

# 🔧 它是什么？

**IntervalController** 是一个比原生 `setInterval` 更强大灵活的时间控制类，提供了：

- 精确控制的定时器（支持毫秒级定时）
- 可暂停与恢复
- 支持最大执行次数限制
- 可切换使用 `requestAnimationFrame`
- 事件监听机制（如 `start`, `tick`, `pause`, `resume`, `stop` 等）

# 💡 适用场景

- **动画控制器**：搭配 `requestAnimationFrame` 可实现更流畅的动画节奏
- **计时任务**：需要周期性执行任务、计算进度或展示剩余时间等
- **游戏逻辑**：例如每秒刷新的状态更新、攻击冷却计时等
- **表单倒计时**：验证码发送倒计时、进度控制等
- **数据轮询**：有条件停止的后台轮询服务

# 📦 安装依赖

```shell
npm install interval-controller
```

# 🚀 使用示例

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

controller.setMaxCount(5); // 最多执行 5 次
controller.start();
```

## 切换为 requestAnimationFrame 模式

```ts
controller.setUseRAF(true);
```

## 暂停与恢复

```ts
controller.pause();

setTimeout(() => {
  controller.resume();
}, 3000);
```

# 🧩 API 设计

## 构造函数

```text
new IntervalController(callback: (count: number) => void, interval = 1000, tag?: string)
```

| 参数       | 类型                        | 描述               |
|----------|---------------------------|------------------|
| callback | `(count: number) => void` | 每次触发时执行的函数       |
| interval | `number`                  | 间隔时间（毫秒），默认 1000 |
| tag      | `string`（可选）              | 标记，便于调试或日志       |

## 常用方法

| 方法                                    | 描述                             |
|---------------------------------------|--------------------------------|
| `start(delay?: number)`               | 启动定时器，可指定延迟（毫秒）启动              |
| `pause()`                             | 暂停执行                           |
| `resume()`                            | 从暂停中恢复                         |
| `stop()`                              | 停止并重置所有状态                      |
| `updateInterval(newInterval: number)` | 动态更新间隔时间                       |
| `setMaxCount(count: number \| null)`  | 设置最大触发次数，达到后自动停止               |
| `setUseRAF(enabled: boolean)`         | 启用或禁用 requestAnimationFrame 模式 |

## 事件监听

| 事件名              | 描述                      |
|------------------|-------------------------|
| `start`          | 定时器开始时触发                |
| `tick`           | 每次执行 callback 时触发       |
| `pause`          | 执行暂停时触发                 |
| `resume`         | 执行恢复时触发                 |
| `stop`           | 执行停止时触发                 |
| `intervalChange` | 调用 `updateInterval` 时触发 |

注册与移除监听：

```ts
controller.on('tick', listener);
controller.off('tick', listener);
controller.once('tick', listener); // 只执行一次
```

## 状态与属性

| 方法                                 | 描述                |             |      |
|------------------------------------|-------------------|-------------|------|
| `getState()` → \`'paused'          | 'running'         | 'stopped'\` | 当前状态 |
| `getCount()`                       | 获取已执行次数           |             |      |
| `getInterval()`                    | 获取当前间隔时间          |             |      |
| `getLastExecutionTime()`           | 获取上一次 tick 的时间戳   |             |      |
| `getNextExecutionTime()`           | 获取预计下一次 tick 的时间戳 |             |      |
| `getProgress()` → `number \| null` | 如果设置了最大次数，返回当前进度  |             |      |
| `getTag()`                         | 返回 tag 标记         |             |      |
| `getTotalPausedTime()`             | 返回累计暂停时间（毫秒）      |             |      |

# ✅ 使用建议

- 如果用于动画控制，建议开启 `setUseRAF(true)`，更流畅
- 若用于后台任务、轮询等，使用默认定时器更节能
- 使用 `setMaxCount()` 可设定最大触发次数，防止无限执行
- 多组件共享同一个定时器时，可通过 `tag` 字段打标签，便于调试和区分来源
- 注意：在 Node.js 环境下 `requestAnimationFrame` 不可用，会自动 fallback 为 `setInterval`

# 🧑‍💻 License

[MIT](https://opensource.org/licenses/MIT)

