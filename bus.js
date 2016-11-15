//
//  events
//

const EventEmitter = require('events');

class Emitter extends EventEmitter {}

module.exports = new Emitter();
