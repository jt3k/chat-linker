//
//  core
//

const bus = require('./bus');
const bots = require('./bots');

// global for debugging
Object.keys(bots).forEach(k => {
  global[k] = bots[k];
});

bus.on('message', ({network, room, name, message}) => {
  Object.values(bots).forEach(bot => {
    if (network === bot.network) {
      bot.send({name, message, room});
    }
  });
});
