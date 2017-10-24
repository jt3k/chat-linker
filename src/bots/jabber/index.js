// @flow

import type { Config } from './Config';

import JabberBot from './bot';
import client from './client';

import config from '../../../app-config';

const jabberConfig: Config = config.jabber;

const bot = new JabberBot(client, jabberConfig);

export default bot;
