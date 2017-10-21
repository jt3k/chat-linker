//
//  core
//

const bus = require('./bus');
const bots = require('./bots');

const botsList = Object.keys(bots).map(botName => bots[botName]);

// global for debugging
Object.keys(bots).forEach(k => {
  global[k] = bots[k];
});

bus.on('message', ({network, room, name, message}) => {
  const botsToPropagateMsg = botsList.filter(bot => bot.network !== network);

  botsToPropagateMsg.forEach(bot => {
    bot.send({name, message, room});
  });
});
