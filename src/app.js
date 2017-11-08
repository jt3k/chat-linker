// @flow

//
//  core
//

import type { Bot } from './bot';
import bus, { type MessageEvent } from './bus';
import * as bots from './bots';

const __DEV__ = process.env.NODE_ENV === 'dev';
const botsList: Bot[] = [];

Object.keys(bots).forEach(k => {
  botsList.push(bots[k]);

  // global for debugging
  if (__DEV__) {
    global[k] = bots[k];
  }
});

bus.on('message', ({ network, room, name, message }: MessageEvent) => {
  const botsToPropagateMsg = botsList.filter(bot => bot.network !== network);

  botsToPropagateMsg.forEach(bot => {
    bot.send({ name, message, room });
  });

  if (__DEV__) {
    console.log(`${Symbol.keyFor(network) || ''} "${room}": <${name}> ${message}`);
  }
});
