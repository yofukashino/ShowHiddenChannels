import Types from "./types";
export default [
  {
    find: "GROUP_DM:return null",
    replacements: [
      {
        match: /(case (\w+.[\w$_]+).GROUP_DM:return null!=\w+\?)/,
        replace: `case $2.GUILD_FORUM:$1!arguments[0]?.isHidden?.()&&arguments[0].type==$2.GUILD_FORUM?null:`,
      },
    ],
  },
  {
    find: "isThreadSidebarFloating",
    replacements: [
      {
        match:
          /((\w+)\s*=\s*\w+\s*\.\s*memo\s*\(\s*\(\s*function\s*\(\s*\w+\s*\)\s*{\s*var\s*\w+\s*=\s*\w+\s*\.\s*colorRoleId[^]*?\)\s*\)\s*;\s*)(function)/,
        replace: (_orig: string, prefix: string, fn: string, suffix: string): string =>
          `${prefix}replugged.util.waitFor('link[href^="replugged://quickcss"]').then(()=>{` + // wait for ignition to be finished
          `${fn}=replugged.plugins.getExports("dev.tharki.ShowHiddenChannels")?._assignMemberRow(${fn})??${fn}});${suffix}`,
      },
    ],
  },
  {
    find: /\.displayName="PermissionStore"/,
    replacements: [
      {
        match:
          /(function\s*\w+\s*\(\s*\)\s*{\s*(\w+)\s*=\s*{\s*}\s*;\s*(\w+)\s*=\s*{\s*}\s*;\s*for\s*\(\s*var\s*\w+\s*in\s*(\w+)\s*\)\s*\w+\s*\[\s*\w+\s*\]\s*\+=\s*1\s*;\s*(\w+)\s*\+=\s*1\s*}[^]*)((\w+)\s*\.\s*getChannelsVersion\s*=\s*function\s*\(\)\s*{)/,
        replace: `$1$7.clearVars=function(){$2={};$3={};$4={};$5=0;};$6`,
      },
    ],
  },
  {
    find: /\.displayName="ChannelListStore"/,
    replacements: [
      {
        match:
          /(var\s*(\w+)\s*=\s*null\s*,\s*(\w+)\s*=\s*null\s*,\s*(\w)\s*=\s*new\s*\w+\s*\.\s*\w+\s*;\s*function[^]*)((\w+)\s*\.\s*recentsChannelCount)/,
        replace: `$1$6.clearVars=function(){$2=null;$3=null;$4.clear();};$5`,
      },
    ],
  },
] as Types.DefaultTypes.PlaintextPatch[];
