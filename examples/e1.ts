import { IntervalController } from '../src';

const controller = new IntervalController((count) => {
  console.log(`executions: ${count}`);
}, 1000);

controller.on('start', () => console.log('timer starts'));
controller.on('tick', (count) => {
  console.log('count: ', count);
});

controller.start();

setTimeout(() => controller.pause(), 5000);

setTimeout(() => controller.resume(), 8000);

setTimeout(() => controller.updateInterval(500), 12000);

setTimeout(() => controller.stop(), 20000);
