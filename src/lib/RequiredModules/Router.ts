import { webpack } from "replugged";

export type Router = Record<
  string,
  (info: {
    computedMatch: {
      params: {
        channelId: undefined | string;
        guildId: undefined | string;
        messageId: undefined | string;
      };
    };
    render: React.FC;
  }) => unknown
>;

export default await webpack
  .waitForModule<{ exports: Router }>(webpack.filters.bySource(/.ImpressionTypes.PAGE,name:\w+,/), {
    raw: true,
    timeout: 10000,
  })
  .then(({ exports }) => exports)
  .catch(() => {
    throw new Error("Failed To Find Router Module");
  });
