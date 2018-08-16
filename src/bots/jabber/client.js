// @flow

import { Client, Element, JID, type Stanza } from 'node-xmpp-client';
// $FlowFixMe
import appConfig from '../../../app-config';
import { type MessageEvent, emitMessage } from '../../bus';
import botNetwork from './network';

import type { Config } from './config';
import type { XmppClient } from './types';

const config: Config = appConfig.jabber;

const pingMs = appConfig.jabber.pingMs;
const nick = appConfig.jabber.nick;
const rooms = appConfig.rooms[process.env.NODE_ENV === 'prod' ? 'prod' : 'dev'];

const { connection: options } = config;

const client = new Client(options);

// Keep alive
const { socket } = client.connection;
socket.setTimeout(0);
socket.setKeepAlive(true, 10000);

client.on('error', (err: string | Error) => {
  console.error('XMPP error:', err);

  // reconnect
  setTimeout(() => client.connect(), 1000);
});

client.on('online', () => {
  console.log('XMPP: online');

  rooms.forEach(
    room => {
      const element = new Element('presence', {
        to: `${room.xmpp}/${nick}`
      }).c('x', { xmlns: 'http://jabber.org/protocol/muc' });
      console.log(`XMPP: Joininig ${room.xmpp}/${nick}`);
      client.send(element);
    }
  )
});

client.on('offline', () => {
  console.log('XMPP: offline');
});

// global for debugging
global.sss = [];
global.eee = [];

client.on('stanza', (stanza: Stanza): void => {
  try {
    if (!stanza.is('message')) {
      return;
    }

    const message: ?Element = stanza
      .getChildElements()
      .find((item: Element) => item.is('body'));

    const from: string = stanza.attr('from');

    const isGroupchat = stanza.type === 'groupchat';
    const isNotSelfMsg = !rooms.find(room => `${room.xmpp}/${nick}` === from);
    const isNotDelay = !stanza.children.find(item => item.name === 'delay');

    if (isNotDelay && message && isGroupchat && isNotSelfMsg) {
      const text: string = message.getText();

      const jid = new JID(from);
      const room: string = `${jid.getLocal()}@${jid.getDomain()}`;
      const name: string = jid.getResource();
      const network = botNetwork;
      const destinationRoomTelegramId = rooms.find(item => item.xmpp === room).telegramId;
      const e: MessageEvent = { network, room, name, message: text, destinationRoom: destinationRoomTelegramId };

      emitMessage(e);
    }
  } catch (err) {
    console.error(err);

    global.sss.push(stanza);
    global.eee.push(err);
  }
});

if (pingMs) {
  const jid: string = options.jid.toString();
  const server: string = new JID(jid).getDomain();

  let pingCounter: number = 0;

  const schedulePing = (): void => {
    const iq = new Element('iq', {
      type: 'get',
      to: server,
      from: jid,
      id: `ping${pingCounter++}`
    }).c('ping', { xmlns: 'urn:xmpp:ping' });

    client.send(iq);

    setTimeout(schedulePing, pingMs);
  };

  schedulePing();
}

const xmppClient: XmppClient = {
  sendMessage(textMessage: string, xmppRoom: string): void {
    const message: Element = new Element(
      'message',
      {
        to: xmppRoom,
        type: 'groupchat'
      }
    );

    client.send(
      message
        .c('body')
        .t(textMessage)
    );
  }
};

export default xmppClient;
