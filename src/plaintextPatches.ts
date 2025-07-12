import Types from "./types";

export default [
  /*   {
    find: "[IDENTIFY]",
    check: () => false,
    replacements: [
      {
        match: /capabilities:(\(0,.\..\)\(\))/,
        replace: (prefix) => `${prefix}&~(1<<15)`,
      },
    ],
  }, */
  {
    find: "GROUP_DM:return null",
    replacements: [
      {
        match: /case (\w+\.\w+)\.GROUP_DM:return null!=\w+\?/,
        replace: (match: string, DiscordConstants: string) =>
          `case ${DiscordConstants}.GUILD_FORUM:${match}!arguments[0]?.isHidden?.()&&arguments[0].type==${DiscordConstants}.GUILD_FORUM?null:`,
      },
    ],
  },
  {
    find: '"PermissionStore"',
    replacements: [
      {
        match:
          /(getChannelsVersion\(\){return \w+})(}function [\w$]+(\(\){\w+={},\w+={},\w+={},\w+=0}))/,
        replace: (_: string, prefix: string, suffix: string, logic: string): string =>
          `${prefix}clearVars${logic}${suffix}`,
      },
    ],
  },
  {
    find: '"ChannelListStore"',
    replacements: [
      {
        match:
          /(function \w+\(\){let \w+=\w+\.\w+\.getChannelId\(\),\w+=\w+\.\w+\.getVoiceChannelId\(\);return (\w+)=\w+,(\w+)=\w+,(\w+)\.clear\(\)}.{1000,1500})(recentsChannelCount\()/,
        replace: (
          _: string,
          prefix: string,
          var1: string,
          var2: string,
          var3: string,
          suffix: string,
        ) => `${prefix}clearVars(){${var1}=null;${var2}=null;${var3}.clear();};${suffix}`,
      },
    ],
  },
] as Types.DefaultTypes.PlaintextPatch[];
