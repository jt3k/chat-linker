# chat-linker [![Build Status](https://travis-ci.org/jt3k/chat-linker.svg?branch=master)](https://travis-ci.org/jt3k/chat-linker)

> It makes a bridge between different IM-networks via chat-bot

![illustration](https://cdn.rawgit.com/jt3k/chat-linker/master/illustration-sketch.svg)

## Usage

### Clone or download files

```sh
$ git clone https://github.com/jt3k/chat-linker.git
```

or

```sh
$ curl https://codeload.github.com/jt3k/chat-linker/zip/master | tar -xf- -C /path/to/save
```


### Setting
Copy `sample-config.json` to `app-config.json` and tune it up.

To determine Telegram room parameters, follow the procedure:

1. Create a bot according to [Telegram documentation][bots-docs]
2. Manually add a bot to the room (using Telegram's invite functionality)
3. Send a message to the bot **directly**, e.g. `/my_id @bot_user_id`
4. Visit `https://api.telegram.org/bot<bot_api_key>/getUpdates` and extract
   `"chat"` object from there. E.g.

   ```json
   {
       "id": -1001054401089,
       "title": "bimo_test",
       "type": "supergroup"
   }
   ```
5. To make all room messages visible to the bot, make it a room admin

### Build

```console
$ npm run build
```

### Run

To start the bot:

+ Use the commands `npm run prod` for production settings or `npm run dev` for development.

## Contribution

### Tests

To run tests use following command:

```sh
$ npm test

```

### Setting up husky

If after the installation does not work git-hooks then run the following command in project directory.

```sh
$ node ./node_modules/husky/bin/install.js
```

### Discussion

- dev-chat: [@chat_linker](https://t.me/chat_linker) (RU)
- demo telegram-side: [@javascript_ru](https://t.me/javascript_ru) (RU)
- demo XMPP-side: [javascript@conference.jabber.ru](xmpp://javascript@conference.jabber.ru?join) (RU)


[bots-docs]: https://core.telegram.org/bots#3-how-do-i-create-a-bot


## License

MIT © [Andrey Gurtovoy](https://github.com/jt3k)
