import { webpack } from "replugged";
import Types from "../types";
import Utils from "./utils";
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
    .waitForProps<Types.RolePillClasses>(["role", "roleCircle"], {
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

  Modules.DiscordConstants = await webpack
    .waitForModule<Types.DefaultTypes.RawModule>(webpack.filters.bySource(".HYPESQUAD=4"), {
      timeout: 10000,
      raw: true,
    })
    .then((v) =>
      Utils.unmangleExports<Types.DiscordConstants>(v, {
        Permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
        ChannelTypes: ["GUILD_TEXT", "GUILD_VOICE"],
      }),
    )
    .catch(() => {
      throw new Error("Failed To Find DiscordConstants Module");
    });

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
    .waitForModule<Types.GenericModule>(webpack.filters.bySource(".ToS;"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ChannelItemUtils Module");
    });

  Modules.PermissionUtils ??= await webpack
    .waitForModule<Types.DefaultTypes.RawModule>(
      webpack.filters.bySource(".computeLurkerPermissionsAllowList()"),
      { timeout: 10000, raw: true },
    )
    .then((v) =>
      Utils.unmangleExports<Types.PermissionUtils>(v, {
        can: "excludeGuildPermissions:",
        getGuildVisualOwnerId: ".ownerId",
        getHighestHoistedRole: ".hoistRoleId?",
        getHighestRole: ".position).first()",
        isRoleHigher: /\w+\.indexOf\(\w+\.id\)>/,
      }),
    )
    .catch(() => {
      throw new Error("Failed To Find PermissionUtils Module");
    });

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
    .waitForModule<Types.RolePill>(webpack.filters.bySource(".roleRemoveButton,"), {
      timeout: 10000,
    })
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

  Modules.RoutingUtils ??= await webpack
    .waitForModule<Types.DefaultTypes.RawModule>(
      webpack.filters.bySource("transitionTo - Transitioning to"),
      { timeout: 10000, raw: true },
    )
    .then((v) =>
      Utils.unmangleExports<Types.RoutingUtils>(v, {
        back: "goBack()",
        forward: "goForward()",
        getFingerprintLocation: ".REJECT_IP",
        isValidFingerprintRoute: ".HANDOFF",
        replaceWith: "Replacing route with",
        transitionTo: "transitionTo - Transitioning to",
        transitionToGuild: "transitionToGuild - Transitioning to",
      }),
    )
    .catch(() => {
      throw new Error("Failed To Find RoutingUtils Module");
    });

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
    .waitForModule<Types.GenericModule>(webpack.filters.bySource("forum-tag"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ForumTags Module");
    });

  Modules.ProfileActions ??= await webpack
    .waitForModule<Types.DefaultTypes.RawModule>(
      webpack.filters.bySource("setFlag: user cannot be undefined"),
      {
        timeout: 10000,
        raw: true,
      },
    )
    .then((v) =>
      Utils.unmangleExports<Types.ProfileActions>(v, {
        acceptAgreements: ".USER_ACCEPT_AGREEMENTS",
        fetchCurrentUser: "CURRENT_USER_UPDATE",
        fetchProfile: "USER_PROFILE_FETCH_START",
        getUser: "USER_UPDATE",
        setFlag: "setFlag: user cannot be undefined",
      }),
    )
    .catch(() => {
      throw new Error("Failed To Find ProfileActions Module");
    });

  Modules.UserProfile ??= await webpack
    .waitForModule<Types.UserProfile>(webpack.filters.bySource(".BITE_SIZE,user:"), {
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
