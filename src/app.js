// @flow

//
//  core
//

import type { Bot } from './bot';
import type { onMessage } from './bus';

// eslint-disable-next-line no-duplicate-imports
import bus from './bus';
import * as bots from './bots';

const botsList: Bot[] = [];

Object.keys(bots).forEach(k => {
  botsList.push(bots[k]);

  // global for debugging
  global[k] = bots[k];
});

bus.on('message', ({ network, room, name, message }: onMessage) => {
  const botsToPropagateMsg = botsList.filter(bot => bot.network !== network);

  botsToPropagateMsg.forEach(bot => {
    bot.send({ name, message, room });
  });
});
