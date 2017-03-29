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

internal.prepareName = function (from) {
  if (from.username) {
    return from.username;
  }

  if (from.last_name) {
    return `${from.first_name} ${from.last_name}`;
  }

  return from.first_name;
};

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
      nick = internal.prepareName(replyToMessage.from);
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

// html-escaping only for telegram
internal.htmlEscape = str => (
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
);

client.on('text', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    const name = internal.prepareName(ctx.message.from);
    const message = internal.prepareMessage(ctx);

    const network = 'TELEGRAM';

    bus.emit('message', {network, room, name, message});

    next();
  }
});
client.startPolling();

function send({name, message}) {
  message = internal.htmlEscape(message);
  name = internal.htmlEscape(name);

  const textMessage = (config.messageTemplate || '<b>{name}</b>\n{message}')
    .replace('{name}', name)
    .replace('{message}', message);

  client.telegram.sendMessage(
		chat.id,
		textMessage,
		{parse_mode: 'HTML'}
	);
}

module.exports = {client, send};
