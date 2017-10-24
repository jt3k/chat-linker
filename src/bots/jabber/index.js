// @flow

import type { Config } from './Config';
import type { Bot } from '../../Bot';

import JabberBot from './bot';
import client from './client';

import config from '../../../app-config';

const jabberConfig: Config = config.jabber;

const bot: Bot = new JabberBot(client, jabberConfig);

export default bot;
