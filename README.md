# chat-linker

> linker for chats from different networks

## Using

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

To start the bot:

+ Set NODE_ENV environment variable to value that is in your application configuration. For example, in [sample-config.json](sample-config.json) there're two: `prod` for production setting and `dev` for development.

+ Run `node app.js`.

NOTE: if you don't want to use `prevent sleep` (workaround for heroku) set `use_prevent_sleep` setting to `false` in your configuration file.

## Contribution

### Setting up husky

In project directory run this command

```sh
node ./node_modules/husky/bin/install.js
```

[bots-docs]: https://core.telegram.org/bots#3-how-do-i-create-a-bot
