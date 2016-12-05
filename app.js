//
//  core
//

const bus = require('./bus.js');

// global for debugging
const jabber = global.jabber = require('./bots/jabber');
const telegram = global.telegram = require('./bots/telegram');

bus.on('message', ({network, room, name, message}) => {
  console.log(`${network} "${room}": <${name}> ${message}`);

  if (network === 'JABBER') {
    telegram.send({name, message});
  }

  if (network === 'TELEGRAM') {
    jabber.send({name, message});
  }
});

// ////////////////////////////////
// FOR HEROKU "HEARTBEAT" POLING //
// ////////////////////////////////
const handleRequest = (request, response) => {
  response.end('Works');
};
require('http').createServer(handleRequest).listen(5000);
