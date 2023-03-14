import * as Types from "./types";
export default [
  {
    find: '"GuildContextMenu:',
    replacements: [
      {
        match: /\w=(\w)\.id/,
        replace: `_guild=$1`,
      },
      {
        match: /\[(\w+,__OVERLAY__\?null:\w+,\w+,\w+)\]/,
        replace: `[$1,replugged.plugins.getExports('Tharki.ShowHiddenChannels').addSHCEntry(_guild)]`,
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
