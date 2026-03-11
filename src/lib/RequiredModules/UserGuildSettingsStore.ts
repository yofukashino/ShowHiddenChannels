import { webpack } from "replugged";

import type Types from "@Types";

export interface UserGuildSettingsStore extends Types.Store {
  getMutedChannels: (guildId: string) => Set<string>;
  isChannelMuted: (guildId: string, channelId: string) => boolean;
}

export default await webpack.waitForStore<UserGuildSettingsStore>("UserGuildSettingsStore");
