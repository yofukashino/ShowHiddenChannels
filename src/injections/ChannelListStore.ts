import { PluginInjector, SettingValues } from "@this";
import { CategoryCollapseStore, ChannelListStore } from "@lib/RequiredModules";
import { DefaultSettings } from "@Consts";
import Utils from "@Utils";

import type { ChannelListCategory, ChannelRecord } from "@lib/RequiredModules/ChannelListStore";
import type Types from "@Types";

const CollapsedMap = new Map<string, boolean>();

export const HiddenChannelCache: Record<string, Record<string, ChannelRecord>> = {};

export const getHiddenChannelRecord = (
  categories: ChannelListCategory[],
  guildId: string,
): { records: Record<string, ChannelRecord>; channels: Types.Channel[]; amount: number } => {
  const hiddenChannels = Utils.getHiddenChannels(guildId);
  if (!HiddenChannelCache[guildId]) HiddenChannelCache[guildId] = {};
  const HiddenGuildChannels = HiddenChannelCache[guildId];

  for (const category of categories) {
    const channelRecords = Object.entries(category.channels);
    const filteredRecords = channelRecords.reduce((acc, [channelID, channelRecord]) => {
      if (!hiddenChannels.channels.some((m) => m.id === channelID)) {
        acc[channelID] = channelRecord;
        return acc;
      }

      if (!HiddenGuildChannels[channelID]) HiddenGuildChannels[channelID] = channelRecord;
      return acc;
    }, {});

    category.channels = filteredRecords;

    if (category.hiddenChannelIds)
      category.hiddenChannelIds = category.hiddenChannelIds.filter((v) => filteredRecords[v]);

    if (category.shownChannelIds)
      category.shownChannelIds = category.shownChannelIds.filter((v) => filteredRecords[v]);
  }

  return { records: HiddenGuildChannels, ...hiddenChannels };
};

PluginInjector.after(ChannelListStore, "getGuild", ([guildId], res) => {
  const blacklistedGuilds = SettingValues.get(
    "blacklistedGuilds",
    DefaultSettings.blacklistedGuilds,
  );
  const sort = SettingValues.get("sort", DefaultSettings.sort);
  const faded = SettingValues.get("faded", DefaultSettings.faded);
  const alwaysCollapse = SettingValues.get("alwaysCollapse", DefaultSettings.alwaysCollapse);
  const shouldShowEmptyCategory = SettingValues.get(
    "shouldShowEmptyCategory",
    DefaultSettings.shouldShowEmptyCategory,
  );
  const { guildChannels } = res;
  Utils.debug("ChannelList", res);
  if (blacklistedGuilds[guildId]) return;

  switch (sort) {
    case "bottom": {
      const getPos = ({ record }: ChannelRecord): number =>
        record.position +
        (record.isGuildVocal() ? 1e4 : 0) +
        (Utils.isHidden(record.id, record) ? 1e5 : 0);

      const sortChannels = (category: ChannelListCategory): void => {
        if (!category) return;
        const channelArray = Object.values(category.channels);
        category.shownChannelIds = channelArray
          .sort((x: ChannelRecord, y: ChannelRecord) => {
            const xPos = getPos(x);
            const yPos = getPos(y);
            return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
          })
          .map((n: ChannelRecord) => n.id);
      };

      sortChannels(guildChannels.favoritesCategory);
      sortChannels(guildChannels.recentsCategory);
      sortChannels(guildChannels.noParentCategory);
      for (const id in guildChannels.categories) {
        sortChannels(guildChannels.categories[id]);
      }
      break;
    }

    case "extra": {
      const hiddenId = `${guildId}_hidden`;
      const HiddenCategory = guildChannels.categories[hiddenId];

      const hiddenChannels = getHiddenChannelRecord(
        [
          guildChannels.favoritesCategory,
          guildChannels.recentsCategory,
          guildChannels.noParentCategory,
          ...Object.values(guildChannels.categories).filter((m) => m.id !== hiddenId),
        ],
        guildId,
      );

      HiddenCategory.isMuted = faded || HiddenCategory.isMuted;
      HiddenCategory.channels = Object.entries(hiddenChannels.records).reduce(
        (acc, [id, channel]) => {
          channel.category = HiddenCategory;
          channel.record.parent_id = hiddenId;
          acc[id] = channel;
          return acc;
        },
        {},
      );

      HiddenCategory.isCollapsed = CollapsedMap.get(guildId)
        ? (guildChannels.collapsedCategoryIds[hiddenId] ??
          CategoryCollapseStore.isCollapsed(hiddenId))
        : alwaysCollapse;

      if (HiddenCategory.isCollapsed) guildChannels.collapsedCategoryIds[hiddenId] = true;
      if (!CollapsedMap.get(guildId)) {
        CollapsedMap.set(guildId, true);
        for (const collapsedGuildId of CollapsedMap.keys()) {
          if (guildId === collapsedGuildId) continue;
          CollapsedMap.set(collapsedGuildId, false);
        }
      }

      HiddenCategory.shownChannelIds =
        guildChannels.collapsedCategoryIds[hiddenId] || HiddenCategory.isCollapsed
          ? []
          : hiddenChannels.channels
              .sort((x, y) => {
                const getPos = (channel: Types.Channel): number =>
                  channel.position + (channel.isGuildVocal() ? 1e4 : 1e5);
                const xPos = getPos(x);
                const yPos = getPos(y);
                return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
              })
              .map((m: Types.Channel) => m.id);
      break;
    }
  }

  if (shouldShowEmptyCategory) {
    const categories = Object.values(guildChannels.categories).filter(
      (m) => !m.id.includes("hidden"),
    );
    for (const category of categories) category.shouldShowEmptyCategory = () => true;
  }

  return res;
});
