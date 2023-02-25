import { webpack } from "replugged";
import { PluginInjector, PluginLogger, SettingValues } from "../index";
import {
  CategoryStore,
  CategoryUtil,
  Channel,
  ChannelListStore,
  ChannelStore,
  DiscordConstants,
  GuildChannelsStore,
} from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import * as Utils from "../lib/utils";
import * as Types from "../types";

export const patchChannelCategories = (): void => {
  PluginInjector.after(
    CategoryStore,
    "getCollapsedCategories",
    (_args, res: Types.collapsedCategoryIds) => {
      return { ...res, ...SettingValues.get("collapsed", defaultSettings.collapsed) };
    },
  );
  PluginInjector.after(CategoryStore, "isCollapsed", (args, res) => {
    if (!args[0]?.endsWith("hidden")) return res;

    if (!SettingValues.get("alwaysCollapse", defaultSettings.alwaysCollapse))
      return SettingValues.get("collapsed", defaultSettings.collapsed)[args[0]];

    return (
      SettingValues.get("alwaysCollapse", defaultSettings.alwaysCollapse) &&
      SettingValues.get("collapsed", defaultSettings.collapsed)[args[0]] !== false
    );
  });
  const CategoryCollapse = webpack.getFunctionKeyBySource(
    CategoryUtil,
    /"CATEGORY_COLLAPSE"/,
  ) as unknown as string;
  PluginInjector.after(CategoryUtil, CategoryCollapse, (args) => {
    if (
      !args[0]?.endsWith("hidden") ||
      SettingValues.get("collapsed", defaultSettings.collapsed)[args[0]]
    )
      return;
    const collapsed = SettingValues.get("collapsed", defaultSettings.collapsed);
    collapsed[args[0]] = true;
    SettingValues.set("collapsed", collapsed);
  });
  const CategoryCollapseAll = webpack.getFunctionKeyBySource(
    CategoryUtil,
    /"CATEGORY_COLLAPSE_ALL"/,
  ) as unknown as string;
  PluginInjector.after(CategoryUtil, CategoryCollapseAll, (args) => {
    if (SettingValues.get("collapsed", defaultSettings.collapsed)[`${args[0]}_hidden`]) return;
    const collapsed = SettingValues.get("collapsed", defaultSettings.collapsed);
    collapsed[`${args[0]}_hidden`] = true;
    SettingValues.set("collapsed", collapsed);
  });
  const CategoryExpand = webpack.getFunctionKeyBySource(
    CategoryUtil,
    /"CATEGORY_EXPAND"/,
  ) as unknown as string;
  PluginInjector.after(CategoryUtil, CategoryExpand, (args) => {
    if (!args[0]?.endsWith("hidden")) return;
    const collapsed = SettingValues.get("collapsed", defaultSettings.collapsed);
    collapsed[args[0]] = false;
    SettingValues.set("collapsed", collapsed);
  });
  const CategoryExpandAll = webpack.getFunctionKeyBySource(
    CategoryUtil,
    /"CATEGORY_EXPAND_ALL"/,
  ) as unknown as string;
  PluginInjector.after(CategoryUtil, CategoryExpandAll, (args) => {
    const collapsed = SettingValues.get("collapsed", defaultSettings.collapsed);
    collapsed[`${args[0]}_hidden`] = false;
    SettingValues.set("collapsed", collapsed);
  });

  PluginInjector.after(GuildChannelsStore, "getChannels", (args: [string], res) => {
    const GuildCategories = res[DiscordConstants.ChanneTypes.GUILD_CATEGORY];
    const hiddenId = `${args[0]}_hidden`;
    const hiddenCategory = GuildCategories?.find(
      (m: Types.GuildChannel) => m.channel.id == hiddenId,
    );
    if (!hiddenCategory) return res;
    const noHiddenCats = GuildCategories.filter(
      (m: Types.GuildChannel) => m.channel.id !== hiddenId,
    ) as Types.GuildChannel[];
    const newComprator =
      (
        noHiddenCats[noHiddenCats.length - 1] || {
          comparator: 0,
        }
      ).comparator + 1;
    Object.defineProperty(hiddenCategory.channel, "position", {
      value: newComprator,
      writable: true,
    });
    Object.defineProperty(hiddenCategory, "comparator", {
      value: newComprator,
      writable: true,
    });
    return res;
  });
  PluginInjector.after(ChannelStore, "getMutableGuildChannelsForGuild", (args, res) => {
    if (
      SettingValues.get("sort", defaultSettings.sort) !== "extra" ||
      SettingValues.get("blacklistedGuilds", defaultSettings.blacklistedGuilds)[args[0]]
    )
      return;
    const hiddenId = `${args[0]}_hidden`;
    const HiddenCategoryChannel = new Channel({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      guild_id: args[0],
      id: hiddenId,
      name: "Hidden Channels",
      type: DiscordConstants.ChanneTypes.GUILD_CATEGORY,
    });
    const GuildCategories = GuildChannelsStore.getChannels(args[0])[
      DiscordConstants.ChanneTypes.GUILD_CATEGORY
    ] as Array<{ channel: Types.Channel; comparator: number }>;
    Object.defineProperty(HiddenCategoryChannel, "position", {
      value:
        (
          GuildCategories[GuildCategories.length - 1] || {
            comparator: 0,
          }
        ).comparator + 1,
      writable: true,
    });
    if (!res[hiddenId]) res[hiddenId] = HiddenCategoryChannel;
    return res;
  });

  //* Custom category or sorting order
  PluginInjector.after(ChannelListStore, "getGuild", (args: [string], res: Types.ChannelList) => {
    if (SettingValues.get("debugMode", defaultSettings.debugMode))
      PluginLogger.log("ChannelList", res);
    if (SettingValues.get("blacklistedGuilds", defaultSettings.blacklistedGuilds)[args[0]]) return;
    switch (SettingValues.get("sort", defaultSettings.sort)) {
      case "bottom": {
        Utils.sortChannels(res.guildChannels.favoritesCategory);
        Utils.sortChannels(res.guildChannels.recentsCategory);
        Utils.sortChannels(res.guildChannels.noParentCategory);

        for (const id in res.guildChannels.categories) {
          Utils.sortChannels(res.guildChannels.categories[id]);
        }

        break;
      }

      case "extra": {
        const hiddenId = `${args[0]}_hidden`;
        const HiddenCategory = res.guildChannels.categories[hiddenId];
        const hiddenChannels = Utils.getHiddenChannelRecord(
          [
            res.guildChannels.favoritesCategory,
            res.guildChannels.recentsCategory,
            res.guildChannels.noParentCategory,
            ...Object.values(res.guildChannels.categories).filter(
              (m: Types.ChannelListCategory) => m.id !== hiddenId,
            ),
          ],
          args[0],
        );

        HiddenCategory.channels = Object.fromEntries(
          Object.entries(hiddenChannels.records).map(
            ([id, channel]: [string, Types.ChannelRecord]) => {
              channel.category = HiddenCategory;
              return [id, channel];
            },
          ),
        );

        HiddenCategory.isCollapsed =
          SettingValues.get("alwaysCollapse", defaultSettings.alwaysCollapse) &&
          SettingValues.get("collapsed", defaultSettings.collapsed)[hiddenId] !== false;
        HiddenCategory.shownChannelIds =
          SettingValues.get("collapsed", {})[hiddenId] ||
          res.guildChannels.collapsedCategoryIds[hiddenId] ||
          HiddenCategory.isCollapsed
            ? []
            : hiddenChannels.channels
                .sort((x: Types.Channel, y: Types.Channel) => {
                  const xPos = x.position + (x.isGuildVocal() ? 1e4 : 1e5);
                  const yPos = y.position + (y.isGuildVocal() ? 1e4 : 1e5);
                  return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
                })
                .map((m: Types.Channel) => m.id);
        break;
      }
    }

    if (SettingValues.get("shouldShowEmptyCategory", defaultSettings.shouldShowEmptyCategory)) {
      Utils.patchEmptyCategoryFunction([
        ...Object.values(res.guildChannels.categories).filter(
          (m: Types.ChannelListCategory) => !m.id.includes("hidden"),
        ),
      ]);
    }

    return res;
  });
};
