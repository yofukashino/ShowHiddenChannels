import { webpack } from "replugged";
import Types from "../types";
export const DiscordConstants = webpack.getByProps<Types.DiscordConstants>(
  "Permissions",
  "ChannelTypes",
);
export const ChatClasses = webpack.getByProps<Types.ChatClasses>("chat", "chatContent");
export const { exports: Route } = webpack.getBySource(".Route,{...", {
  raw: true,
});
export const { exports: ChannelIconLocked } = webpack.getBySource(/guild_id\|\|!.\./, {
  raw: true,
});
export const ChatContent = webpack.getBySource<Types.ChatContent>(
  "showAutomodUserProfileChatBlocker",
);
export const ChannelItem = webpack.getByProps<Types.ChannelItem>("ChannelItemIcon");
export const ChannelItemUtil = webpack.getByProps<Types.ChannelItemUtil>(
  "getChannelIconComponent",
  "getChannelIconTooltipText",
  "getSimpleChannelIconComponent",
);
export const RolePillClasses = webpack.getByProps<Types.RolePillClasses>(
  "rolePill",
  "rolePillBorder",
);
export const ChannelButtonClasses = webpack.getByProps<Types.ChannelButtonClasses>(
  "modeMuted",
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
export const Channels = webpack.getByProps<Types.Channels>("ChannelRecordBase");
export const ChannelListStore = webpack.getByStoreName<Types.ChannelListStore>("ChannelListStore");
export const UserGuildSettingsStore =
  webpack.getByStoreName<Types.UserGuildSettingsStore>("UserGuildSettingsStore");
export const IconUtils = webpack.getByProps<Types.IconUtils>("getUserAvatarURL");
export const IconClasses = webpack.getByProps<Types.IconClasses>("iconItem");
export const ReadStateStore = webpack.getByStoreName<Types.ReadStateStore>("ReadStateStore");
export const Voice = webpack.getByProps<Types.Voice>("getVoiceStateStats");
export const GuildStore = webpack.getByStoreName<Types.GuildStore>("GuildStore");
export const RolePill = webpack.getByProps<Types.RolePill>("MemberRole");
export const MessageActions = webpack.getByProps<Types.MessageActions>(
  "jumpToMessage",
  "_sendMessage",
);
export const UserMentions = webpack.getByProps<Types.UserMentions>("handleUserContextMenu");
export const GuildChannelStore =
  webpack.getByStoreName<Types.GuildChannelStore>("GuildChannelStore");
export const TextElement = webpack.getBySource<Types.TextElement>("CUSTOM:null");
export const CategoryStore = webpack.getByProps<Types.CategoryStore>(
  "isCollapsed",
  "getCollapsedCategories",
);
export const PresenceStore = webpack.getByStoreName<Types.PresenceStore>("PresenceStore");
export const GuildMemberStore = webpack.getByStoreName<Types.GuildMemberStore>("GuildMemberStore");
export const ChannelStore = webpack.getByStoreName<Types.ChannelStore>("ChannelStore");
export const BigIntUtils = webpack.getByProps<Types.BigIntUtils>("deserialize", "invert", "has");
export const TransitionUtil = webpack.getByProps<Types.TransitionUtil>(
  "transitionTo",
  "transitionToGuild",
);
export const ChannelUtils = webpack.getByProps<Types.ChannelUtils>(
  "renderTopic",
  "HeaderGuildBreadcrumb",
  "ChannelEmoji",
  "renderTitle",
);

export const ForumTags = webpack.getBySource<Types.ForumTags>("IncreasedActivityForumTagPill");
export const DiscordComponents = webpack.getByProps<Types.DiscordComponents>(
  "PopoutList",
  "AdvancedScrollerAuto",
);

export const ProfileActions = webpack.getByProps<Types.ProfileActions>("getUser", "fetchProfile");

export default {
  DiscordConstants,
  ChatClasses,
  Route,
  ChatContent,
  ChannelItem,
  ChannelItemUtil,
  RolePillClasses,
  ChannelButtonClasses,
  PermissionStore,
  PermissionUtils,
  ChannelListClasses,
  LocaleManager,
  ChannelListStore,
  UserGuildSettingsStore,
  IconUtils,
  IconClasses,
  ReadStateStore,
  Voice,
  GuildStore,
  RolePill,
  MessageActions,
  UserMentions,
  GuildChannelStore,
  TextElement,
  CategoryStore,
  PresenceStore,
  GuildMemberStore,
  ChannelStore,
  BigIntUtils,
  TransitionUtil,
  ChannelUtils,
  ForumTags,
  DiscordComponents,
  ProfileActions,
};
