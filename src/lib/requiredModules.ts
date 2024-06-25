import { webpack } from "replugged";
import Types from "../types";
export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.ChatClasses ??= await webpack
    .waitForProps<Types.ChatClasses>(["chat", "chatContent"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChatClasses Module");
    });

  Modules.RolePillClasses ??= await webpack
    .waitForProps<Types.RolePillClasses>(["rolePill", "rolePillBorder"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find RolePillClasses Module");
    });

  Modules.ChannelButtonClasses ??= await webpack
    .waitForProps<Types.ChannelButtonClasses>(["modeMuted", "linkBottom"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChannelButtonClasses Module");
    });

  Modules.ChannelListClasses ??= await webpack
    .waitForProps<Types.ChannelListClasses>(["container", "hubContainer"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChatListClasses Module");
    });

  Modules.IconClasses ??= await webpack
    .waitForProps<Types.IconClasses>(["iconItem"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find IconClasses Module");
    });

  Modules.DiscordConstantsModule = await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".MFA_WARNING="), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find DiscordConstants Module");
    });

  Modules.DiscordConstants = {
    Permissions: webpack.getExportsForProps(Modules.DiscordConstantsModule, [
      "ADMINISTRATOR",
      "MANAGE_GUILD",
    ]),
    ChannelTypes: webpack.getExportsForProps(Modules.DiscordConstantsModule, [
      "GUILD_TEXT",
      "GUILD_VOICE",
    ]),
  };

  Modules.Route ??= await webpack
    .waitForModule<Types.GenericExport>(
      webpack.filters.bySource(/.ImpressionTypes.PAGE,name:\w+,/),
      {
        raw: true,
        timeout: 10000,
      },
    )
    .then(({ exports }) => exports)
    .catch(() => {
      throw new Error("Failed To Find Route Module");
    });

  Modules.ChannelIconLocked ??= await webpack
    .waitForModule<Types.GenericExport>(webpack.filters.bySource(/guild_id\|\|!.\./), {
      raw: true,
      timeout: 10000,
    })
    .then(({ exports }) => exports)
    .catch(() => {
      throw new Error("Failed To Find ChannelIconLocked Module");
    });

  Modules.ChatContent ??= await webpack
    .waitForModule<Types.ChatContent>(
      webpack.filters.bySource("showAutomodUserProfileChatBlocker"),
      { timeout: 10000 },
    )
    .catch(() => {
      throw new Error("Failed To Find ChatContent Module");
    });

  Modules.ChannelItem ??= await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".iconContainerWithGuildIcon,"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChannelItem Module");
    });

  Modules.ChannelItemUtil ??= await webpack
    .waitForModule<Types.GenericModule>(
      webpack.filters.bySource(".Messages.CHANNEL_TOOLTIP_RULES"),
      { timeout: 10000 },
    )
    .catch(() => {
      throw new Error("Failed To Find ChannelItemUtils Module");
    });

  Modules.PermissionUtilsModule ??= await webpack
    .waitForModule<Types.GenericModule>(
      webpack.filters.bySource(".computeLurkerPermissionsAllowList()"),
      { timeout: 10000 },
    )
    .catch(() => {
      throw new Error("Failed To Find PermissionUtils Module");
    });

  Modules.PermissionUtils ??= {
    can: webpack.getFunctionBySource(Modules.PermissionUtilsModule, "excludeGuildPermissions:"),
    getGuildVisualOwnerId: webpack.getFunctionBySource(Modules.PermissionUtilsModule, ".ownerId"),
    getHighestHoistedRole: webpack.getFunctionBySource(
      Modules.PermissionUtilsModule,
      ".hoistRoleId?",
    ),
    getHighestRole: webpack.getFunctionBySource(
      Modules.PermissionUtilsModule,
      ".position).first()",
    ),
    isRoleHigher: webpack.getFunctionBySource(
      Modules.PermissionUtilsModule,
      /\w+\.indexOf\(\w+\.id\)>/,
    ),
  };

  Modules.LocaleManager ??= await webpack
    .waitForProps<Types.LocaleManager>(["Messages", "_chosenLocale"], { timeout: 10000 })
    .catch(() => {
      throw new Error("Failed To Find LocaleManager Module");
    });

  Modules.Channels ??= await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource("get permissionOverwrites"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find Channels Module");
    });

  Modules.IconUtils ??= await webpack
    .waitForProps<Types.IconUtils>(["getUserAvatarURL"], { timeout: 10000 })
    .catch(() => {
      throw new Error("Failed To Find IconUtils Module");
    });

  Modules.RolePill ??= await webpack
    .waitForModule<Types.RolePill>(
      webpack.filters.bySource(".Messages.USER_PROFILE_REMOVE_ROLE,"),
      { timeout: 10000 },
    )
    .catch(() => {
      throw new Error("Failed To Find RolePill Module");
    });

  Modules.MessageActions ??= await webpack
    .waitForProps<Types.MessageActions>(["jumpToMessage", "_sendMessage"], { timeout: 10000 })
    .catch(() => {
      throw new Error("Failed To Find MessageActions Module");
    });

  Modules.TextElement ??= await webpack
    .waitForModule<Types.TextElement>(webpack.filters.bySource("CUSTOM:null"), { timeout: 10000 })
    .catch(() => {
      throw new Error("Failed To Find TextElements Module");
    });

  Modules.RoutingUtilsModule ??= await webpack
    .waitForModule<Types.GenericModule>(
      webpack.filters.bySource("transitionTo - Transitioning to"),
      { timeout: 10000 },
    )
    .catch(() => {
      throw new Error("Failed To Find RoutingUtils Module");
    });

  Modules.RoutingUtils ??= {
    back: webpack.getFunctionBySource(Modules.RoutingUtilsModule, "goBack()"),
    forward: webpack.getFunctionBySource(Modules.RoutingUtilsModule, "goForward()"),
    getFingerprintLocation: webpack.getFunctionBySource(Modules.RoutingUtilsModule, ".REJECT_IP"),
    isValidFingerprintRoute: webpack.getFunctionBySource(Modules.RoutingUtilsModule, ".HANDOFF"),
    replaceWith: webpack.getFunctionBySource(Modules.RoutingUtilsModule, "Replacing route with"),
    transitionTo: webpack.getFunctionBySource(
      Modules.RoutingUtilsModule,
      "transitionTo - Transitioning to",
    ),
    transitionToGuild: webpack.getFunctionBySource(
      Modules.RoutingUtilsModule,
      "transitionToGuild - Transitioning to",
    ),
  };

  Modules.ChannelUtilsModule ??= await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".guildBreadcrumbIcon,"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChannelUtilsModule Module");
    });

  Modules.ChannelUtils ??= {
    renderTopic: webpack.getFunctionBySource(Modules.ChannelUtilsModule, ".GROUP_DM:return null"),
    HeaderGuildBreadcrumb: webpack.getFunctionBySource(
      Modules.ChannelUtilsModule,
      ".guildBreadcrumbIcon,",
    ),
    renderTitle: webpack.getFunctionBySource(Modules.ChannelUtilsModule, ".__invalid_icon,"),
  };

  Modules.ForumTagsModule ??= await webpack
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".Messages.FORUM_TAGS,"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ForumTags Module");
    });

  Modules.ProfileActionsModule ??= await webpack
    .waitForModule<Types.GenericModule>(
      webpack.filters.bySource("UserProfileModalActionCreators"),
      {
        timeout: 10000,
      },
    )
    .catch(() => {
      throw new Error("Failed To Find ProfileActions Module");
    });

  Modules.ProfileActions ??= {
    acceptAgreements: webpack.getFunctionBySource(
      Modules.ProfileActionsModule,
      ".USER_ACCEPT_AGREEMENTS",
    ),
    fetchCurrentUser: webpack.getFunctionBySource(
      Modules.ProfileActionsModule,
      "CURRENT_USER_UPDATE",
    ),
    fetchProfile: webpack.getFunctionBySource(
      Modules.ProfileActionsModule,
      "USER_PROFILE_FETCH_START",
    ),
    getUser: webpack.getFunctionBySource(Modules.ProfileActionsModule, "USER_UPDATE"),
    setFlag: webpack.getFunctionBySource(
      Modules.ProfileActionsModule,
      "setFlag: user cannot be undefined",
    ),
  };

  Modules.UserProfile ??= await webpack
    .waitForModule<Types.UserProfile>(webpack.filters.bySource("BiteSizeProfilePopout"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find UserProfile Module");
    });

  Modules.PermissionStore ??= webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
  Modules.ChannelListStore ??= webpack.getByStoreName<Types.ChannelListStore>("ChannelListStore");
  Modules.ReadStateStore ??= webpack.getByStoreName<Types.ReadStateStore>("ReadStateStore");
  Modules.GuildStore ??= webpack.getByStoreName<Types.GuildStore>("GuildStore");
  Modules.GuildMemberStore ??= webpack.getByStoreName<Types.GuildMemberStore>("GuildMemberStore");
  Modules.ChannelStore ??= webpack.getByStoreName<Types.ChannelStore>("ChannelStore");
  Modules.UserGuildSettingsStore ??=
    webpack.getByStoreName<Types.UserGuildSettingsStore>("UserGuildSettingsStore");
  Modules.GuildChannelStore ??=
    webpack.getByStoreName<Types.GuildChannelStore>("GuildChannelStore");
  Modules.RTCConnectionStore ??=
    webpack.getByStoreName<Types.RTCConnectionStore>("RTCConnectionStore");
  Modules.CategoryStore ??= webpack.getByStoreName<Types.CategoryStore>("CategoryCollapseStore");
};

export default Modules;
