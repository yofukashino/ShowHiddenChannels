import { webpack } from "replugged";
import Types from "../types";
export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.UserGuildSettingsStore ??=
    webpack.getByStoreName<Types.UserGuildSettingsStore>("UserGuildSettingsStore");
  Modules.GuildChannelStore ??=
    webpack.getByStoreName<Types.GuildChannelStore>("GuildChannelStore");
  Modules.DiscordConstants ??= await webpack.waitForProps<Types.DiscordConstants>(
    "Permissions",
    "ChannelTypes",
  );
  Modules.ChatClasses ??= await webpack.waitForProps<Types.ChatClasses>("chat", "chatContent");

  Modules.Route ??= await webpack
    .waitForModule<Types.GenericExport>(webpack.filters.bySource(".Route,{..."), {
      raw: true,
    })
    .then(({ exports }) => exports);
  Modules.ChannelIconLocked ??= await webpack
    .waitForModule<Types.GenericExport>(webpack.filters.bySource(/guild_id\|\|!.\./), {
      raw: true,
    })
    .then(({ exports }) => exports);
  Modules.ChatContent ??= await webpack.waitForModule<Types.ChatContent>(
    webpack.filters.bySource("showAutomodUserProfileChatBlocker"),
  );
  Modules.ChannelItem ??= await webpack.waitForProps<Types.ChannelItem>("ChannelItemIcon");
  Modules.ChannelItemUtil ??= await webpack.waitForProps<Types.ChannelItemUtil>(
    "getChannelIconComponent",
    "getChannelIconTooltipText",
    "getSimpleChannelIconComponent",
  );
  Modules.RolePillClasses ??= await webpack.waitForProps<Types.RolePillClasses>(
    "rolePill",
    "rolePillBorder",
  );
  Modules.ChannelButtonClasses ??= await webpack.waitForProps<Types.ChannelButtonClasses>(
    "modeMuted",
    "linkBottom",
  );

  Modules.PermissionUtils ??= await webpack.waitForProps<Types.PermissionUtils>(
    "isRoleHigher",
    "makeEveryoneOverwrite",
  );
  Modules.ChannelListClasses ??= await webpack.waitForProps<Types.ChannelListClasses>(
    "container",
    "hubContainer",
  );
  Modules.LocaleManager ??= await webpack.waitForProps<Types.LocaleManager>(
    "Messages",
    "_chosenLocale",
  );
  Modules.Channels ??= await webpack.waitForProps<Types.Channels>("ChannelRecordBase");

  Modules.IconUtils ??= await webpack.waitForProps<Types.IconUtils>("getUserAvatarURL");
  Modules.IconClasses ??= await webpack.waitForProps<Types.IconClasses>("iconItem");

  Modules.Voice ??= await webpack.waitForProps<Types.Voice>("getVoiceStateStats");

  Modules.RolePill ??= await webpack.waitForProps<Types.RolePill>("MemberRole");
  Modules.MessageActions ??= await webpack.waitForProps<Types.MessageActions>(
    "jumpToMessage",
    "_sendMessage",
  );

  Modules.TextElement ??= await webpack.waitForModule<Types.TextElement>(
    webpack.filters.bySource("CUSTOM:null"),
  );

  Modules.CategoryStore ??= await webpack.waitForProps<Types.CategoryStore>(
    "isCollapsed",
    "getCollapsedCategories",
  );
  Modules.BigIntUtils ??= await webpack.waitForProps<Types.BigIntUtils>(
    "deserialize",
    "invert",
    "has",
  );

  Modules.TransitionUtil ??= await webpack.waitForProps<Types.TransitionUtil>(
    "transitionTo",
    "transitionToGuild",
  );
  Modules.ChannelUtils ??= await webpack.waitForProps<Types.ChannelUtils>(
    "renderTopic",
    "HeaderGuildBreadcrumb",
    "renderTitle",
  );

  Modules.ForumTags ??= await webpack.waitForProps<Types.ForumTags>("ForumTagOverflow");

  Modules.DiscordComponents ??= await webpack.waitForProps<Types.DiscordComponents>(
    "PopoutList",
    "AdvancedScrollerAuto",
  );

  Modules.ProfileActions ??= await webpack.waitForProps<Types.ProfileActions>(
    "getUser",
    "fetchProfile",
  );

  Modules.UserProfile ??= await webpack.waitForModule<Types.UserProfile>(
    webpack.filters.bySource("UserPopoutUpsellSource.USER_POPOUT"),
  );
  Modules.PermissionStore ??= webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
  Modules.ChannelListStore ??= webpack.getByStoreName<Types.ChannelListStore>("ChannelListStore");
  Modules.ReadStateStore ??= webpack.getByStoreName<Types.ReadStateStore>("ReadStateStore");
  Modules.GuildStore ??= webpack.getByStoreName<Types.GuildStore>("GuildStore");
  Modules.GuildMemberStore ??= webpack.getByStoreName<Types.GuildMemberStore>("GuildMemberStore");
  Modules.ChannelStore ??= webpack.getByStoreName<Types.ChannelStore>("ChannelStore");
};

export default Modules;
