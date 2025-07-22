import { IntervalController } from '../src';

const controller = new IntervalController(
  (count) => {
    console.log('tick:', count);
  },
  1000,
  'my-timer',
);

controller.on('start', () => console.log('Started!'));
controller.once('tick', () => console.log('First tick'));
controller.setMaxCount(5);
controller.setUseRAF(true);

controller.start(2000); // Starts after a delay of 2 seconds.
