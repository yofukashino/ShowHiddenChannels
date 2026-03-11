import { webpack } from "replugged";

import type Types from "@Types";

export interface ChannelRecord {
  category: ChannelListCategory;
  id: string;
  position: number;
  record: Types.Channel;
  renderLevel: number;
  subtitle: null | string;
  threadCount: number;
  threadIds: string[];
  isCollapsed: boolean;
  isFirstVoiceChannel: boolean;
  isMuted: boolean;
}

export interface ChannelListCategory {
  categoriesById: Record<string, Types.Channel>;
  channels: Record<string, ChannelRecord>;
  guild?: ChannelList;
  id?: string;
  hiddenChannelIds: null | string[];
  isCollapsed: boolean;
  isMuted: boolean;
  position: number;
  shownChannelIds: string[];
  shouldShowEmptyCategory: () => boolean;
}

export interface ChannelList {
  guildChannels: {
    categories: Record<string, ChannelListCategory>;
    collapsedCategoryIds: Record<string, boolean>;
    noParentCategory: ChannelListCategory;
    voiceChannelsCategory: ChannelListCategory;
    recentsCategory: ChannelListCategory;
    favoritesCategory: ChannelListCategory;
    id: string;
  };
  guildChannelsVersion: number;
}
export interface ChannelListStore extends Types.Store {
  getGuild: (guildId: string) => ChannelList;
  clearVars?: () => void;
}

export default await webpack.waitForStore<ChannelListStore>("ChannelListStore");
