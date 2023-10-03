import { webpack } from "replugged";
import * as Types from "../types";
export const DiscordConstantsModule =
  webpack.getBySource<Types.DefaultTypes.ObjectExports>(/command:"giphy"/);
export const DiscordConstants = {
  Permissions: webpack.getExportsForProps<Types.Permissions>(DiscordConstantsModule, [
    "ADMINISTRATOR",
    "MANAGE_GUILD",
  ]),
  ChanneTypes: webpack.getExportsForProps<Types.ChannelTypes>(DiscordConstantsModule, [
    "GUILD_TEXT",
    "GUILD_VOICE",
  ]),
};
export const ChatClasses = webpack.getByProps<Types.ChatClasses>("chat", "chatContent");
export const { exports: Route } = webpack.getBySource<Types.RouteExports>(
  /\.impressionName.*\.impressionProperties.*\.disableTrack.*\.PAGE/,
  { raw: true },
);
export const ChatContent = webpack.getBySource<Types.ChatContent>(
  "showAutomodUserProfileChatBlocker",
);
export const ChannelItem = webpack.getBySource<Types.genericObjectExport>(".subtitleColor");
export const ChannelItemUtil = webpack.getBySource<Types.genericObjectExport>(
  /\.locked,.*\.video.*\.hasActiveThreads.*\.textFocused/,
);
export const RolePillClasses = webpack.getByProps<Types.RolePillClasses>(
  "rolePill",
  "rolePillBorder",
);
export const ChannelItemClasses = Object.assign(
  {},
  webpack.getByProps("wrapper", "mainContent"),
  webpack.getByProps("modeUnread", "modeMuted", "modeSelected"),
) as Types.ChannelItemClasses;
export const ChannelButtonClasses = webpack.getByProps<Types.ChannelButtonClasses>(
  "channelEmoji",
  "linkBottom",
);
export const PermissionStore = webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
export const PermissionUtils = webpack.getByProps<Types.PermissionUtils>(
  "isRoleHigher",
  "makeEveryoneOverwrite",
);
export const ChannelListClasses = webpack.getByProps<Types.ChannelListClasses>(
  "container",
  "hubContainer",
);
export const LocaleManager = webpack.getByProps<Types.LocaleManager>("Messages", "_chosenLocale");
export const ChannelsModule = webpack.getBySource<Types.DefaultTypes.ObjectExports>(/key:"nsfw"/);
export const Channel = webpack.getFunctionBySource<Types.ChannelConstructor>(
  ChannelsModule,
  /function.*\(\)\{.*\.apply\(this,arguments\)\}/,
);
export const ChannelListStore = webpack.getByStoreName<Types.ChannelListStore>("ChannelListStore");
export const UserGuildSettingsStore =
  webpack.getByStoreName<Types.UserGuildSettingsStore>("UserGuildSettingsStore");
export const IconUtils = webpack.getByProps<Types.IconUtils>("getUserAvatarURL");
export const IconClasses = webpack.getByProps<Types.IconClasses>("iconItem");
export const ReadStateStore = webpack.getByStoreName<Types.ReadStateStore>("ReadStateStore");
export const Voice = webpack.getByProps<Types.Voice>("getVoiceStateStats");
export const GuildStore = webpack.getByStoreName<Types.GuildStore>("GuildStore");
export const RolePillModule =
  webpack.getBySource<Types.DefaultTypes.ObjectExports>(/\.disableBorderColor,/);
export const RolePill = webpack.getExportsForProps<Types.RolePill>(RolePillModule, [
  "$$typeof",
  "render",
]);
export const MessageActions = webpack.getByProps<Types.MessageActions>(
  "jumpToMessage",
  "_sendMessage",
);
export const UserMentions = webpack.getBySource<Types.UserMentions>(
  /inlinePreview:[A-Za-z]\.formatInline/,
);
export const GuildChannelStore =
  webpack.getByStoreName<Types.GuildChannelStore>("GuildChannelStore");
export const TextElement = webpack.getBySource<Types.TextElement>(/\.selectable,.*\.strong/);
export const CategoryStore = webpack.getByProps<Types.CategoryStore>(
  "isCollapsed",
  "getCollapsedCategories",
);
export const PresenceStore = webpack.getByStoreName<Types.PresenceStore>("PresenceStore");
export const GuildMemberStore = webpack.getByStoreName<Types.GuildMemberStore>("GuildMemberStore");
export const ChannelStore = webpack.getByStoreName<Types.ChannelStore>("ChannelStore");
export const BigIntUtils = webpack.getByProps<Types.BigIntUtils>("deserialize", "invert", "has");
export const TransitionUtilModule = webpack.getBySource<Types.DefaultTypes.ObjectExports>(
  "transitionTo - Transitioning to ",
);
export const TransitionUtil = {
  transitionToChannel: webpack.getFunctionBySource<Types.DefaultTypes.AnyFunction>(
    TransitionUtilModule,
    "transitionTo - Transitioning to ",
  ),
};
export const ChannelUtilsModule =
  webpack.getBySource<Types.DefaultTypes.ObjectExports>("GROUP_DM:return null");
export const ChannelUtils = {
  channelTopic: webpack.getFunctionBySource(ChannelUtilsModule, /function \w+\(\w+,\w+\)/),
} as Types.ChannelUtils;
export const ForumTagsModule = webpack.getBySource<Types.DefaultTypes.ObjectExports>(
  ".Messages.FORUM_TAG_A11Y_FILTER_BY_TAG.",
);
export const ForumTags = webpack.getFunctionBySource<Types.ComponentClass>(
  ForumTagsModule,
  ".Messages.FORUM_TAG_A11Y_FILTER_BY_TAG.",
);
export const DiscordComponents = webpack.getByProps<Types.DiscordComponents>(
  "PopoutList",
  "AdvancedScrollerAuto",
);

export const { exports: MemberMemos } = webpack.getBySource<{ MemberRow: Types.ComponentClass }>(
  "isThreadSidebarFloating",
  { raw: true },
);

export const ScrollerClasses = webpack.getByProps<Types.ScrollerClasses>("listWrapper", "scroller");

export const ProfileActionsModule = webpack.getBySource<Types.DefaultTypes.ObjectExports>(
  "setFlag: user cannot be undefined",
);

export const ProfileActions = {
  getUser: webpack.getFunctionBySource<Types.DefaultTypes.AnyFunction>(
    ProfileActionsModule,
    '"USER_UPDATE"',
  ),
  fetchProfile: webpack.getFunctionBySource<Types.DefaultTypes.AnyFunction>(
    ProfileActionsModule,
    ".apply(",
  ),
};
