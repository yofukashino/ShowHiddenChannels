import { webpack } from "replugged";

import type Types from "@Types";

export interface GuildChannel {
  channel: Types.Channel;
  comparator: number;
}
export interface GuildChannels extends Record<4 | "SELECTABLE" | "VOCAL", GuildChannel[]> {
  count: number;
  id: string;
}

export interface GuildChannelStore extends Types.Store {
  getChannels: (guildId: string) => GuildChannels;
  clearVars?: () => void;
}

export default await webpack.waitForStore<GuildChannelStore>("GuildChannelStore");
