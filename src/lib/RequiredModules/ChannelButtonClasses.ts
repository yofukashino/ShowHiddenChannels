import { util, webpack } from "replugged";

export type ChannelButtonClasses = Record<
  | "channelEmoji"
  | "channelEmojiLeftOfIcon"
  | "channelEmojiRightOfIcon"
  | "children"
  | "emojiColorFill"
  | "favoritesSuggestion"
  | "icon"
  | "iconContainer"
  | "link"
  | "linkBottom"
  | "linkTop"
  | "linkWithChannelEmoji"
  | "modeConnected"
  | "modeLocked"
  | "modeMuted"
  | "modeSelected"
  | "modeUnread"
  | "name"
  | "newBadge"
  | "notInteractive"
  | "numberBadge"
  | "responsiveWidthMobile"
  | "ripple"
  | "subtitle"
  | "topContent"
  | "twemoji"
  | "typeThread"
  | "unread"
  | "unreadRelevant"
  | "wrapper",
  string
>;
export default await webpack
  .waitForModule<ChannelButtonClasses>(webpack.filters.bySource("modeUnreadImportant_"), {
    timeout: 10000,
  })
  .then((c) => util.mapClassNames(c))
  .catch(() => {
    throw new Error("Failed To Find ChannelButtonClasses Module");
  });
