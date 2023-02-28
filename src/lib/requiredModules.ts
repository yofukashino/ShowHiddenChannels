import { webpack } from "replugged";
import * as Types from "../types";
export const DiscordConstantsModule = webpack.getBySource(
  /command:"giphy"/,
) as unknown as Types.DefaultTypes.ObjectExports;
export const DiscordConstants = {
  Permissions: webpack.getExportsForProps(DiscordConstantsModule, [
    "ADMINISTRATOR",
    "MANAGE_GUILD",
  ]),
  ChanneTypes: webpack.getExportsForProps(DiscordConstantsModule, [
    "GUILD_TEXT",
    "GUILD_VOICE",
  ]) as unknown as Types.ChannelTypes,
};
export const ChatClasses = webpack.getByProps("chat", "chatContent");
export const { exports: Route } = webpack.getBySource(
  /\.impressionName.*\.impressionProperties.*\.disableTrack.*\.PAGE/,
  { raw: true },
) as unknown as Types.RouteExports;
export const ChannelItem = webpack.getBySource(
  /\.unread,.*\.canHaveDot.*\.mentionCount.*\.relevant/,
) as unknown as Types.genericObjectExport;
export const ChannelItemUtil = webpack.getBySource(
  /\.locked,.*\.video.*\.hasActiveThreads.*\.textFocused/,
) as unknown as Types.genericObjectExport;
export const RolePillClasses = webpack.getByProps("rolePill", "rolePillBorder");
export const ChannelClasses = webpack.getByProps("wrapper", "mainContent");
export const PermissionStore = webpack.getByProps(
  "getChannelPermissions",
) as unknown as Types.PermissionStore;
export const PermissionUtils = webpack.getByProps(
  "isRoleHigher",
  "makeEveryoneOverwrite",
) as unknown as Types.PermissionUtils;
export const ChannelListClasses = webpack.getByProps(
  "container",
  "hubContainer",
) as unknown as Types.ChannelListClasses;
export const LocaleManager = webpack.getByProps(
  "Messages",
  "_chosenLocale",
) as unknown as Types.LocaleManager;
export const ChannelsModule = webpack.getBySource(
  /key:"nsfw"/,
) as unknown as Types.DefaultTypes.ObjectExports;
export const Channel = webpack.getFunctionBySource(
  ChannelsModule,
  /function.*\(\)\{.*\.apply\(this,arguments\)\}/,
) as unknown as Types.ChannelConstructor;
export const ChannelListStore = webpack.getByProps(
  "getGuildWithoutChangingCommunityRows",
) as unknown as Types.ChannelListStore;
export const IconUtils = webpack.getByProps("getUserAvatarURL") as unknown as Types.IconUtils;
export const IconClasses = webpack.getByProps("iconItem");
export const UnreadStore = webpack.getByProps("isForumPostUnread") as unknown as Types.UnreadStore;
export const Voice = webpack.getByProps("getVoiceStateStats") as unknown as Types.Voice;
export const GuildStore = webpack.getByProps(
  "getGuild",
  "getGuilds",
) as unknown as Types.GuildStore;
export const RolePillModule = webpack.getBySource(
  /\.disableBorderColor,.*roleId:.*,size:.*,guildId:/,
);
export const RolePill = webpack.getExportsForProps(RolePillModule, [
  "$$typeof",
  "render",
]) as unknown as Types.RolePill;
export const MessageActions = webpack.getByProps(
  "jumpToMessage",
  "_sendMessage",
) as unknown as Types.MessageActions;
export const UserMentions = webpack.getBySource(
  /inlinePreview:[A-Za-z]\.formatInline/,
) as unknown as Types.UserMentions;
export const CategoryUtil = webpack.getBySource(
  /type:"CATEGORY_COLLAPSE"/,
) as unknown as Types.genericObjectExport;
export const GuildChannelsStore = webpack.getByProps(
  "getChannels",
  "getDefaultChannel",
) as unknown as Types.GuildChannelsStore;
export const TextElement = webpack.getBySource(
  /\.selectable,.*\.strong/,
) as unknown as Types.TextElement;
export const CategoryStore = webpack.getByProps(
  "isCollapsed",
  "getCollapsedCategories",
) as unknown as Types.CategoryStore;
export const GuildMemberStore = webpack.getByProps(
  "getMember",
) as unknown as Types.GuildMemberStore;
export const ChannelStore = webpack.getByProps(
  "getChannel",
  "getDMFromUserId",
) as unknown as Types.ChannelStore;
export const ChannelUtilsModule = webpack.getBySource(
  /\.Types\.STAFF_ONLY_DM.*.DM/,
) as unknown as Types.DefaultTypes.ObjectExports;
export const ChannelUtils = {
  channelTopic: webpack.getFunctionBySource(ChannelUtilsModule, /\{channel:.*,guild:.*\}/),
} as Types.ChannelUtils;
