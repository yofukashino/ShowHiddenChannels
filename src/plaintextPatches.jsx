export default [
  {
    find: '"GuildContextMenu:',
    replacements: [
      {
        match: /\w=(\w)\.id/,
        replace: `_guild=$1,$&`,
      },
      {
        match: /(\[)(D,__OVERLAY__\?null:k,R,[A-Za-z])(])/,
        replace: `$1 $2 , replugged.plugins.getExports('Tharki.ShowHiddenChannels').addSHCEntry(_guild) $3`,
      },
    ],
  },
];
