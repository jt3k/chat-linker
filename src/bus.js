//
//  events
//
const __DEV__ = process.env.NODE_ENV === 'dev';

const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const bus = new Emitter();

bus.on('message', ({network, room, name, message}) => {
  if (__DEV__) {
    console.log(`${Symbol.keyFor(network)} "${room}": <${name}> ${message}`);
  }
});

module.exports = bus;
