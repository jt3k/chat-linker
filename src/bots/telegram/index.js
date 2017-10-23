const config = require('../../app-config').telegram;

const TelegramBot = require('./bot');
const client = require('./client');

const bot = new TelegramBot(client, config);

module.exports = bot;
