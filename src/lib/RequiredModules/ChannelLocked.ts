import { webpack } from "replugged";

import type Types from "@Types";

export type ChannelLocked = Record<string, (channel: Types.Channel) => boolean>;

export default await webpack
  .waitForModule<{ exports: ChannelLocked }>(webpack.filters.bySource(/guild_id\|\|!.\./), {
    raw: true,
    timeout: 10000,
  })
  .then(({ exports }) => exports)
  .catch(() => {
    throw new Error("Failed To Find ChannelIconLocked Module");
  });
