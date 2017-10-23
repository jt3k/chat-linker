const botNetwork = require('./network');

class JabberBot {
  constructor(client, config) {
    this.client = client;
    this.config = config;
    this.network = botNetwork;
  }

  send({name, message}) {
    const client = this.client;
    const config = this.config;

    const textMessage = (config.messageTemplate || '<@{name}> {message}')
      .replace('{name}', name)
      .replace('{message}', message);

    return client.sendMessage(
      textMessage
    );
  }
}

module.exports = JabberBot;
