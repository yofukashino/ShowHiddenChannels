import { webpack } from "replugged";

import type Types from "@Types";

export interface ReadStateStore extends Types.Store {
  getMentionCount: (channelId: string) => number;
  getGuildChannelUnreadState: (channel: Types.Channel) => { mentionCount: number; unread: boolean };
  getUnreadCount: (channelId: string) => number;
  hasTrackedUnread: (channelId: string) => boolean;
  hasUnread: (channelId: string) => boolean;
  hasUnreadPins: (channelId: string) => boolean;
}

export default await webpack.waitForStore<ReadStateStore>("ReadStateStore");
