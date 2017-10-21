const config = require('../../app-config').jabber;

const JabberBot = require('./bot');
const client = require('./client');

const bot = new JabberBot(client, config);

module.exports = bot;
