declare class Telegraf$Telegram {
   constructor: (token: string, options?: {
     agent: http$Agent,
     webhookReply: boolean
   }) => this;

   sendMessage: (chatId: number | string, text: string, extra?: Object) => Promise<*>;
}

declare module 'telegraf' {
  declare type updateType =
    'callback_query' |
    'channel_post' |
    'chosen_inline_result' |
    'edited_channel_post' |
    'edited_message' |
    'inline_query' |
    'shipping_query' |
    'pre_checkout_query' |
    'message' |

    'voice' |
    'video_note' |
    'video' |
    'venue' |
    'text' |
    'supergroup_chat_created' |
    'successful_payment' |
    'sticker' |
    'pinned_message' |
    'photo' |
    'new_chat_title' |
    'new_chat_photo' |
    'new_chat_members' |
    'migrate_to_chat_id' |
    'migrate_from_chat_id' |
    'location' |
    'left_chat_member' |
    'invoice' |
    'group_chat_created' |
    'game' |
    'document' |
    'delete_chat_photo' |
    'contact' |
    'channel_chat_created' |
    'audio';

  declare class Telegraf {
    constructor: (token: string, options?: {
      telegram: {
        agent: http$Agent,
        webhookReply: boolean
      },
      username?: string
    }) => this;

    telegram: Telegraf$Telegram;

    on: (updateTypes: updateType | updateType[], middleware: Function) => this;
    startPolling: (timeout?: number, limit?: number, allowedUpdates?: string[]) => this;
  }

  declare module.exports: Class<Telegraf>;
}

declare module 'telegraf/lib/core/composer' {
  declare module.exports: any;
}

declare module 'telegraf/lib/core/context' {
  declare module.exports: any;
}

declare module 'telegraf/lib/core/router' {
  declare module.exports: any;
}

declare module 'telegraf/lib/core/session' {
  declare module.exports: any;
}

declare module 'telegraf/lib/helpers/extra' {
  declare module.exports: any;
}

declare module 'telegraf/lib/helpers/markup' {
  declare module.exports: any;
}

declare module 'telegraf/lib/helpers/replicators' {
  declare module.exports: any;
}

declare module 'telegraf/lib/network/client' {
  declare module.exports: any;
}

declare module 'telegraf/lib/network/error' {
  declare module.exports: any;
}

declare module 'telegraf/lib/network/multipart-stream' {
  declare module.exports: any;
}

declare module 'telegraf/lib/network/webhook' {
  declare module.exports: any;
}

declare module 'telegraf/lib/telegraf' {
  declare module.exports: any;
}

declare module 'telegraf/lib/telegram' {
  declare module.exports: Class<Telegraf$Telegram>;
}

// Filename aliases
declare module 'telegraf/lib/core/composer.js' {
  declare module.exports: $Exports<'telegraf/lib/core/composer'>;
}
declare module 'telegraf/lib/core/context.js' {
  declare module.exports: $Exports<'telegraf/lib/core/context'>;
}
declare module 'telegraf/lib/core/router.js' {
  declare module.exports: $Exports<'telegraf/lib/core/router'>;
}
declare module 'telegraf/lib/core/session.js' {
  declare module.exports: $Exports<'telegraf/lib/core/session'>;
}
declare module 'telegraf/lib/helpers/extra.js' {
  declare module.exports: $Exports<'telegraf/lib/helpers/extra'>;
}
declare module 'telegraf/lib/helpers/markup.js' {
  declare module.exports: $Exports<'telegraf/lib/helpers/markup'>;
}
declare module 'telegraf/lib/helpers/replicators.js' {
  declare module.exports: $Exports<'telegraf/lib/helpers/replicators'>;
}
declare module 'telegraf/lib/network/client.js' {
  declare module.exports: $Exports<'telegraf/lib/network/client'>;
}
declare module 'telegraf/lib/network/error.js' {
  declare module.exports: $Exports<'telegraf/lib/network/error'>;
}
declare module 'telegraf/lib/network/multipart-stream.js' {
  declare module.exports: $Exports<'telegraf/lib/network/multipart-stream'>;
}
declare module 'telegraf/lib/network/webhook.js' {
  declare module.exports: $Exports<'telegraf/lib/network/webhook'>;
}
declare module 'telegraf/lib/telegraf.js' {
  declare module.exports: $Exports<'telegraf/lib/telegraf'>;
}
declare module 'telegraf/lib/telegram.js' {
  declare module.exports: $Exports<'telegraf/lib/telegram'>;
}
