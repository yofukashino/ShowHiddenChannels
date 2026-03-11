import { webpack } from "replugged";

import type Types from "@Types";

export type BaseChannel = (props: Partial<Types.Channel>) => void;

export type Channels = Record<string, BaseChannel>;

export default await webpack
  .waitForModule<Channels>(webpack.filters.bySource("get permissionOverwrites"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find Channels Module");
  });
