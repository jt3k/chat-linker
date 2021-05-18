// @flow

//
//  events
//

import EventEmitter from 'events';

export type MessageEvent = {
  network: Symbol,
  room: string,
  name: string,
  message: string,
  destinationRoom: string
};

class Emitter extends EventEmitter {}

const bus = new Emitter();

export function emitMessage(e: MessageEvent) {
  bus.emit('message', e);
}

export default bus;
