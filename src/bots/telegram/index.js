// @flow

import config from '../../../app-config';
import type {Bot} from '../../bot';
import type {Config} from './config';

import TelegramBot from './bot';
import client from './client';

const telegramConfig: Config = config.telegram;

const bot: Bot = new TelegramBot(client, telegramConfig);

export default bot;
