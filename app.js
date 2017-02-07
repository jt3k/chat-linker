//
//  core
//

const bus = require('./bus.js');

const __DEV__ = process.env.NODE_ENV === 'dev';

// global for debugging
const jabber = global.jabber = require('./bots/jabber');
const telegram = global.telegram = require('./bots/telegram');

bus.on('message', ({network, room, name, message}) => {
  if (__DEV__) {
    console.log(`${network} "${room}": <${name}> ${message}`);
  }

  if (network === 'JABBER') {
    telegram.send({name, message});
  }

  if (network === 'TELEGRAM') {
    jabber.send({name, message});
  }
});
