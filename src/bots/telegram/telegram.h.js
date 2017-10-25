// @flow

// MIT License
// Copyright (c) 2017 Bannerets (github.com/Bannerets)

/* eslint-disable no-use-before-define */

export type Telegram$User = {
  id: number,
  is_bot: boolean,
  first_name: string,
  last_name?: string,
  username?: string,
  language_code?: string
};

export type Telegram$Chat = {
  id: number,
  type: string,
  title?: string,
  username?: string,
  first_name?: string,
  last_name?: string,
  all_members_are_administrators?: boolean,
  photo?: Telegram$ChatPhoto,
  description?: string,
  invite_link?: string,
  pinned_message?: Telegram$Message,
  sticker_set_name?: string,
  can_set_sticker_set?: boolean
};

export type Telegram$Message = {
  message_id: number,
  from: Telegram$User,
  date: number,
  chat: Telegram$Chat,
  forward_from?: Telegram$User,
  forward_from_chat?: Telegram$Chat,
  forward_from_message_id?: number,
  forward_signature?: string,
  forward_date?: number,
  reply_to_message?: Telegram$Message,
  edit_date?: number,
  author_signature?: string,
  text?: string,
  entities?: Telegram$MessageEntity[],
  caption_entities?: Telegram$MessageEntity[],
  audio?: Telegram$Audio,
  document?: Telegram$Document,
  game?: Telegram$Game,
  photo?: Telegram$PhotoSize[],
  sticker?: Telegram$Sticker,
  video?: Telegram$Video,
  voice?: Telegram$Voice,
  video_note?: Telegram$VideoNote,
  caption?: string,
  contact?: Telegram$Contact,
  location?: Telegram$Location,
  venue?: Telegram$Venue,
  new_chat_members?: Telegram$User[],
  left_chat_member?: Telegram$User,
  new_chat_title?: string,
  new_chat_photo?: Telegram$PhotoSize[],
  delete_chat_photo?: true,
  group_chat_created?: true,
  supergroup_chat_created?: true,
  channel_chat_created?: true,
  migrate_to_chat_id?: number,
  migrate_from_chat_id?: number,
  pinned_message?: Telegram$Message,
  invoice?: Telegram$Invoice,
  successful_payment?: Telegram$SuccessfulPayment
};

export type Telegram$MessageEntity = {
  type: string,
  offset: number,
  length: number,
  url?: string,
  user?: Telegram$User
};

export type Telegram$PhotoSize = {
  file_id: string,
  width: number,
  height: number,
  file_size?: number
};

export type Telegram$Audio = {
  file_id: string,
  file_size?: number,
  duration: number,
  performer?: string,
  title?: string,
  mime_type?: string
};

export type Telegram$Document = {
  file_id: string,
  file_size?: number,
  thumb?: Telegram$PhotoSize,
  file_name?: string,
  mime_type?: string
};

export type Telegram$Video = {
  width: number,
  height: number,
  duration: number,
  thumb?: Telegram$PhotoSize,
  mime_type?: string
};

export type Telegram$Voice = {
  file_id: string,
  file_size?: number,
  duration: number,
  mime_type?: string
};

export type Telegram$VideoNote = {
  length: number,
  duration: number,
  thumb?: Telegram$PhotoSize
};

export type Telegram$Contact = {
  phone_number: string,
  first_name: string,
  last_name?: string,
  user_id?: number
};

export type Telegram$Location = {
  longitude: number,
  latitude: number
};

export type Telegram$Venue = {
  location: Telegram$Location,
  title: string,
  address: string,
  foursquare_id?: string
};

export type Telegram$UserProfilePhotos = {
  total_count: number,
  photos: Telegram$PhotoSize[][]
};

export type Telegram$File = {
  file_path?: string
};

export type Telegram$ReplyKeyboardMarkup = {
  keyboard: Telegram$KeyboardButton[][],
  resize_keyboard?: boolean,
  one_time_keyboard?: boolean,
  selective?: boolean
};

export type Telegram$KeyboardButton = {
  text: string,
  request_contact?: boolean,
  request_location?: boolean
};

export type Telegram$ReplyKeyboardRemove = {
  remove_keyboard: boolean,
  selective?: boolean
};

export type Telegram$InlineKeyboardMarkup = {
  inline_keyboard: Telegram$InlineKeyboardButton[][]
};

export type Telegram$InlineKeyboardButton = {
  text: string,
  url?: string,
  callback_data?: string,
  switch_inline_query?: string,
  switch_inline_query_current_chat?: string,
  callback_game?: Telegram$CallbackGame,
  pay?: boolean
};

export type Telegram$CallbackQuery = {
  id: string,
  from: Telegram$User,
  message?: Telegram$Message,
  inline_message_id?: string,
  chat_instance: string,
  data?: string,
  game_short_name?: string
};

export type Telegram$ForceReply = {
  force_reply: boolean,
  selective?: boolean
};

export type Telegram$ChatPhoto = {
  small_file_id: string,
  big_file_id: string
};

export type Telegram$ChatMember = {
  user: Telegram$User,
  status: string,
  until_date?: number,
  can_be_edited?: boolean,
  can_change_info?: boolean,
  can_post_messages?: boolean,
  can_edit_messages?: boolean,
  can_delete_messages?: boolean,
  can_invite_users?: boolean,
  can_restrict_members?: boolean,
  can_pin_messages?: boolean,
  can_promote_members?: boolean,
  can_send_messages?: boolean,
  can_send_media_messages?: boolean,
  can_send_other_messages?: boolean,
  can_add_web_page_previews?: boolean
};

export type Telegram$Sticker = {
  file_id: string,
  width: number,
  height: number,
  thumb?: Telegram$PhotoSize,
  emoji?: string,
  set_name?: string,
  mask_position?: Telegram$MaskPosition,
  file_size?: number
};

export type Telegram$StickerSet = {
  name: string,
  title: string,
  contains_masks: boolean,
  stickers: Telegram$Sticker[]
};

export type Telegram$MaskPosition = {
  point: string,
  x_shift: number,
  y_shift: number,
  scale: number
};

export type Telegram$Game = {
  title: string,
  description: string,
  photo: Telegram$PhotoSize[],
  text?: string,
  text_entities?: Telegram$MessageEntity[],
  animation?: Telegram$Animation
};

export type Telegram$Animation = {
  file_id: string,
  thumb?: Telegram$PhotoSize,
  file_name?: string,
  mime_type?: string,
  file_size?: number
};

export type Telegram$CallbackGame = {
  user_id: number,
  score: number,
  force?: boolean,
  disable_edit_message?: boolean,
  chat_id?: boolean,
  message_id?: number,
  inline_message_id?: string
};

export type Telegram$Invoice = {
  title: string,
  description: string,
  start_parameter: string,
  currency: string,
  total_amount: number
};

export type Telegram$SuccessfulPayment = {
  currency: string,
  total_amount: number,
  invoice_payload: string,
  shipping_option_id?: string,
  order_info?: Telegram$OrderInfo,
  telegram_payment_charge_id: string,
  provider_payment_charge_id: string
};

export type Telegram$OrderInfo = {
  name?: string,
  phone_number?: string,
  email?: string,
  shipping_address?: Telegram$ShippingAddress
};

export type Telegram$ShippingAddress = {
  country_code: string,
  state: string,
  city: string,
  street_line1: string,
  street_line2: string,
  post_code: string
};
