/* eslint-disable eqeqeq */
import { webpack as Webpack } from "replugged";
export const DiscordConstants = Webpack.getModule((m) => m?.exports?.Plq?.ADMINISTRATOR == 8n);
export const { chat } = Webpack.getByProps("chat", "chatContent");

export const { exports: Route } = Webpack.getModule(
  (m) =>
    ["impressionName", "impressionProperties", "disableTrack"].every((s) =>
      m?.exports?.Z?.toString().includes(s),
    ),
  { raw: true },
);
export const ChannelItem = Webpack.getModule((m) =>
  ["canHaveDot", "unreadRelevant", "UNREAD_HIGHLIGHT"].every((s) =>
    m?.exports?.Z?.toString().includes(s),
  ),
);
export const ChannelUtil = Webpack.getModule((m) =>
  ["locked", "hasActiveThreads"].every((s) => m?.exports?.KS?.toString().includes(s)),
);
export const RolePillClasses = Webpack.getByProps("rolePill", "rolePillBorder");
export const ChannelClasses = Webpack.getByProps("wrapper", "mainContent");
export const ChannelPermissionStore = Webpack.getByProps("getChannelPermissions");
export const { container } = Webpack.getByProps("container", "hubContainer");
export const LocaleManager = Webpack.getByProps("Messages", "_chosenLocale");
export const { Sf: Channel } = Webpack.getModule((m) => m?.exports?.Sf?.prototype?.isManaged);
export const ChannelListStore = Webpack.getByProps("getGuildWithoutChangingCommunityRows");
export const IconUtils = Webpack.getByProps("getUserAvatarURL");
export const IconClasses = Webpack.getByProps("iconItem");
export const UnreadStore = Webpack.getByProps("isForumPostUnread");
export const Voice = Webpack.getByProps("getVoiceStateStats");
export const GuildStore = Webpack.getByProps("getGuild", "getGuilds");
export const { U: RolePill } = Webpack.getModule((m) =>
  m?.exports?.U?.render?.toString().includes("roleStyle"),
);
export const MessageActions = Webpack.getByProps("jumpToMessage", "_sendMessage");
export const { Z: UserMentions } = Webpack.getModule((m) =>
  m?.exports?.Z?.react?.toString().includes("inlinePreview"),
);
export const CategoryUtil = Webpack.getModule((m) =>
  m?.exports?.c4?.toString().includes("CATEGORY_COLLAPSE"),
);
export const GuildChannelsStore = Webpack.getByProps("getChannels", "getDefaultChannel");
export const TextElement = Webpack.getModule(
  (m) => m?.exports?.Z?.Sizes?.SIZE_32 && m?.exports?.Z?.Colors,
);
export const { Ee: RadioGroupComponent } = Webpack.getModule(
  (m) => m?.exports?.Ee?.Sizes && m?.exports?.Ee?.toString?.().includes("radioItemClassName"),
);
export const CategoryStore = Webpack.getByProps("isCollapsed", "getCollapsedCategories");
export const GuildMemberStore = Webpack.getByProps("getMember");
export const ChannelStore = Webpack.getByProps("getChannel", "getDMFromUserId");
export const ChannelUtils = {
  filter: ["channel", "guild"],
  get Module() {
    return Webpack.getModule((m) =>
      this.filter.every((s) => m?.exports?.v0?.toString().includes(s)),
    );
  },
  get ChannelTopic() {
    return this.Module.v0;
  },
};
