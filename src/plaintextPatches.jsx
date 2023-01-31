export default [
  {
    find: 'navId:"guild-context"',
    replacements: [
      {
        match: /.*/i,
        replace: `console.log($1)`,
      },
    ],
  },
];
