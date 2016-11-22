//
//  telegram
//

const Telegraf = require('telegraf');

const config = require('../app-config').telegram;
const bus = require('../bus.js');

const chat = config[process.env.NODE_ENV];

const {BOT_TOKEN} = config;

const client = new Telegraf(BOT_TOKEN);
const internal = {};

internal.prepareMessage = function (ctx) {
  let nick = '';
  let message = '';

  const replyToMessage = ctx.message.reply_to_message;

  const isReplyWithText = replyToMessage && replyToMessage.text;
  if (isReplyWithText) {
    const isReplyFromOurBot = BOT_TOKEN.indexOf(replyToMessage.from.id) > -1;

    if (isReplyFromOurBot) {
      [nick, message] = (function () {
        const lineEndPos = replyToMessage.text.indexOf('\n');
        const _nick = replyToMessage.text.slice(0, lineEndPos);
        const _message = replyToMessage.text
                          .slice(lineEndPos + 1);
        return [_nick, _message];
      })();
    } else {
      // if no bots reply
      nick = replyToMessage.from.username;
      message = replyToMessage.text;
    }

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}\n${ctx.message.text}`;
  }

  //
  // is no-reply //
  //
  return ctx.message.text;
};

client.on('text', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    const name = ctx.message.from.username;
    const message = internal.prepareMessage(ctx);

    const network = 'TELEGRAM';

    bus.emit('message', {network, room, name, message});

    next();
  }
});
client.startPolling();

function send({name, message}) {
  client.telegram.sendMessage(
		chat.id,
		`<b>${name}</b>\n${message}`,
		{parse_mode: 'HTML'}
	);
}

module.exports = {client, send};
