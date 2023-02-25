export const defaultSettings = {
  hiddenChannelIcon: "lock",
  sort: "native",
  showPerms: true,
  showAdmin: "exclude",
  stopMarkingUnread: false,

  shouldShowEmptyCategory: true,
  alwaysCollapse: false,

  debugMode: false,

  channels: {
    GUILD_TEXT: true,
    GUILD_VOICE: true,
    GUILD_ANNOUNCEMENT: true,
    GUILD_STORE: true,
    GUILD_STAGE_VOICE: true,
    GUILD_FORUM: true,
  },

  blacklistedGuilds: {},
  collapsed: {},
};

export const ChannelTypes = [
  "GUILD_TEXT",
  "GUILD_VOICE",
  "GUILD_ANNOUNCEMENT",
  "GUILD_STORE",
  "GUILD_STAGE_VOICE",
  "GUILD_FORUM",
];
