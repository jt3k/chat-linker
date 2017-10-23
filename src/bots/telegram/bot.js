const botNetwork = require('./network');

// html-escaping only for telegram
const htmlEscape = str => (
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
);

class TelegramBot {
  constructor(client, config) {
    this.client = client;
    this.config = config;
    this.network = botNetwork;
  }

  send({name, message}) {
    const config = this.config;
    const chat = config[process.env.NODE_ENV];

    message = htmlEscape(message);
    name = htmlEscape(name);

    const textMessage = (config.messageTemplate || '<b>{name}</b>\n{message}')
      .replace('{name}', name)
      .replace('{message}', message);

    this.client.telegram.sendMessage(
      chat.id,
      textMessage,
      {parse_mode: 'HTML'}
    );
  }
}

module.exports = TelegramBot;
