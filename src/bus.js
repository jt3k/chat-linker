// @flow

//
//  events
//

import EventEmitter from 'events';

export type MessageEvent = {
  network: Symbol,
  room: string,
  name: string,
  message: string
};

const __DEV__ = process.env.NODE_ENV === 'dev';

class Emitter extends EventEmitter {}

const bus = new Emitter();

bus.on('message', ({ network, room, name, message }: MessageEvent) => {
  if (!__DEV__) {
    return;
  }

  console.log(`${Symbol.keyFor(network) || ''} "${room}": <${name}> ${message}`);
});

export default bus;
