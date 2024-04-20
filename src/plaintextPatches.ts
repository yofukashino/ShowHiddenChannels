import Types from "./types";
export default [
  {
    find: "GROUP_DM:return null",
    replacements: [
      {
        match: /case (\w+)\.ChannelTypes\.GROUP_DM:return null!=\w+\?/,
        replace: (match: string, DiscordConstants: string) =>
          `case ${DiscordConstants}.GUILD_FORUM:${match}!arguments[0]?.isHidden?.()&&arguments[0].type==${DiscordConstants}.ChannelTypes.GUILD_FORUM?null:`,
      },
    ],
  },
  {
    find: '="PermissionStore"',
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
    find: '="ChannelListStore"',
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
