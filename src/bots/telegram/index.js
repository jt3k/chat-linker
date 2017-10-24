// @flow

import type { Config } from './Config';
import type { Bot } from '../../Bot';

import TelegramBot from './bot';
import client from './client';

import config from '../../../app-config';

const telegramConfig: Config = config.telegram;

const bot: Bot = new TelegramBot(client, telegramConfig);

export default bot;
