import Types from "./types";
export default [
  {
    find: "GROUP_DM:return null",
    replacements: [
      {
        match: /case (\w+)\.ChannelTypes\.GROUP_DM:return null!=\w+\?/,
        replace: (match: string, discordConstants: string) =>
          `case ${discordConstants}.GUILD_FORUM:${match}!arguments[0]?.isHidden?.()&&arguments[0].type==${discordConstants}.ChannelTypes.GUILD_FORUM?null:`,
      },
    ],
  },
  {
    find: "this.trackMemberListViewed()",
    replacements: [
      {
        match: /(\w+)(=\w+\.memo\(\w+=>{let{colorRoleId:)/,
        replace: (_: string, fn: string, suffix: string): string =>
          `${fn}=window[Symbol.for("dev.tharki.ShowHiddenChannels")]${suffix}`,
      },
    ],
  },
  {
    find: '.displayName="PermissionStore"',
    replacements: [
      {
        match:
          /(function \w+\(\){for\(let \w+ in (\w+)={},(\w+)={},(\w+)\)\w+\[\w+\]\+=1;(\w+)\+=1}.{3700,4100})(getChannelsVersion\(\){)/,
        replace: (
          _: string,
          prefix: string,
          var1: string,
          var2: string,
          var3: string,
          var4: string,
          suffix: string,
        ): string => `${prefix}clearVars(){${var1}={};${var2}={};${var3}={};${var4}=0;};${suffix}`,
      },
    ],
  },
  {
    find: '.displayName="ChannelListStore"',
    replacements: [
      {
        match:
          /(function \w+\(\){let \w+=\w+\.default\.getChannelId\(\),\w+=\w+\.default\.getVoiceChannelId\(\);return (\w+)=\w+,(\w+)=\w+,(\w+)\.clear\(\)}.{1300,1500})(recentsChannelCount\()/,
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
