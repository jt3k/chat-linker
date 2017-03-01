//
//  core
//

const http = global.http = require('connect');
const serveStatic = require('serve-static');

const bus = require('./bus.js');

const __DEV__ = process.env.NODE_ENV === 'dev';

// global for debugging
const jabber = global.jabber = require('./bots/jabber');
const telegram = global.telegram = require('./bots/telegram');

const config = require('./app-config').http[process.env.NODE_ENV];

http().use(serveStatic(config.directory)).listen(config.port, () => console.log(`http listening on ${config.port}`));

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
