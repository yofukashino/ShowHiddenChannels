import { webpack } from "replugged";

import type Types from "@Types";

export type ChannelItemIcon = React.MemoExoticComponent<
  React.FC<{
    channel: Types.Channel;
    guild: Types.Guild;
    className: string;
    locked: boolean;
    hasActiveThreads: boolean;
    original?: boolean;
  }>
>;

export type ChannelItemTab<
  T = {
    channel: Types.Channel;
    connected: boolean;
  },
> = React.ForwardRefExoticComponent<T & React.RefAttributes<Types.ReactTree>> & {
  render: React.ForwardRefRenderFunction<Types.ReactTree, T>;
};

export type ChannelItem = Record<string, ChannelItemIcon>;

export default await webpack
  .waitForModule<ChannelItem>(webpack.filters.bySource("UNREAD_LESS_IMPORTANT:"), {
    timeout: 10000,
  })
  .catch(() => {
    throw new Error("Failed To Find ChannelItem Module");
  });
