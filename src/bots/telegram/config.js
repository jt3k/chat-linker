// @flow

import type { Telegram$Chat } from './telegram.h';

export type Config = {
  BOT_TOKEN: string,
  dev: Telegram$Chat,
  prod: Telegram$Chat,
  messageTemplate: string,
  quoteLength?: number,
};
