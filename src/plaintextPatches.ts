import * as Types from "./types";
export default [
  {
    find: '"GuildContextMenu:',
    replacements: [
      {
        match: /(\w=(\w)\.id)/,
        replace: `$1,_guild=$2`,
      },
      {
        match: /\[(\w+,__OVERLAY__\?null:\w+,\w+,\w+)\]/,
        replace: `[$1,replugged.plugins.getExports('dev.tharki.ShowHiddenChannels')?.makeSHCContextMenuEntry(_guild)]`,
      },
    ],
  },
  {
    find: "isCopiedStreakGodlike",
    replacements: [
      {
        match: /(\.isLastChannel,\w+=(\w+)\.onChannelClick)/,
        replace: `$1,{channel}=$2`,
      },
      {
        match:
          /(\.channelName,children:\[)(\(0,\w+\.jsx\)\([\w$_]+\.[\w$_]+,{channel:\w+,guild:\w+}\))/,
        replace: `$1replugged.plugins.getExports('dev.tharki.ShowHiddenChannels')?.makeChannelBrowerLockIcon({channel,originalIcon:$2})`,
      },
    ],
  },
  {
    find: /\.displayName="PermissionStore"/,
    replacements: [
      {
        match:
          /((\w+)\.__getLocalVars=function\(\)\{return\{guildCache:(\w+),channelCache:(\w+),guildVersions:(\w+),channelsVersion:(\w+)}};)/,
        replace: `$2.clearVars=function(){$3={};$4={};$5={};$6=0;};$1`,
      },
    ],
  },
  {
    find: /\.displayName="ChannelListStore"/,
    replacements: [
      {
        match:
          /((\w+)\.__getLocalVars=function\(\){return{lastSelectedChannelId:(\w+),lastSelectedVoiceChannelId:(\w+),state:(\w+)}};)/,
        replace: `$2.clearVars=function(){$3=null;$4=null;$5.clear();};$1`,
      },
    ],
  },
] as Types.DefaultTypes.PlaintextPatch[];
