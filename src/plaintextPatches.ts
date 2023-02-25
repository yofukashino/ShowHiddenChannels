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
        match: /\[([A-Za-z],__OVERLAY__\?null:[A-Za-z],[A-Za-z],[A-Za-z])\]/,
        replace: `[$1,replugged.plugins.getExports('Tharki.ShowHiddenChannels').addSHCEntry(_guild)]`,
      },
    ],
  },
] as Types.DefaultTypes.PlaintextPatch[];
