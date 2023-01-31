export default [
  {
    find: '"GuildContextMenu:',
    replacements: [
      {
        match: /\w=(\w)\.id/,
        replace: `_guild=$1,$&`,
      },
      {
        match: /(id:"leave-guild".{0,200}),(\(0,.{1,3}\.jsxs?\).{0,200}function.{0,118})/,
        replace: `$1,replugged.plugins.getExports('Tharki.ShowHiddenChannels').addSHCEntry(_guild),$2`,
      },
    ],
  },
];
