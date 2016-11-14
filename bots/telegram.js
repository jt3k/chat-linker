// 
// telegram
// 

const config = require('../app-config').telegram;
const chat = config[process.env.NODE_ENV];

const bus = require('../bus.js');
const Telegraf = require('telegraf')

const {BOT_TOKEN} = config;

const client = new Telegraf(BOT_TOKEN)

client.on('text', (ctx, next) => {
	const room = ctx.message.chat.title;
	if (room === chat.title) {
		const name = ctx.message.from.username;
		const message = ctx.message.text;
		const network = 'TELEGRAM';

        bus.emit('message', { network, room, name, message});

        next();
	}
});
client.startPolling();

function send ({name, message}) {
	client.telegram.sendMessage(chat.id, `<${name}> ${message}`)
}

module.exports = { client, send };