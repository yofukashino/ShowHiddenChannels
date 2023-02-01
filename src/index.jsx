/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import { Injector, Logger, components, settings } from "replugged";
import {
  CategoryStore,
  CategoryUtil,
  Channel,
  ChannelClasses,
  ChannelItem,
  ChannelListStore,
  ChannelPermissionStore,
  ChannelStore,
  ChannelUtil,
  DiscordConstants,
  GuildChannelsStore,
  GuildStore,
  IconClasses,
  MessageActions,
  Route,
  UnreadStore,
  UserMentions,
  Voice,
} from "./lib/requiredModules.jsx";
import { defaultSettings } from "./lib/consts.jsx";
import * as Utils from "./lib/utils.jsx";
import { registerSettings } from "./Components/Settings.jsx";

import * as Icons from "./Components/Icons.jsx";
import { Lockscreen } from "./Components/Lockscreen.jsx";
import "./style.css";
export const PluginInjector = new Injector();
export const PluginLogger = Logger.plugin("ShowHiddenChannels");
export const shc = await settings.init("Tharki.ShowHiddenChannels", defaultSettings);

const { Tooltip } = components;
export const originalCan =
  ChannelPermissionStore?.can?.prototype?.constructor ?? ChannelPermissionStore?.can;
Channel.prototype.isHidden = Utils.NOOP;
const applyInjections = () => {
  if (shc.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("UnreadStore", UnreadStore);
    PluginLogger.log("ChannelItem", ChannelItem);
    PluginLogger.log("UserMention", UserMentions);
  }
  PluginInjector.instead(Channel.prototype, "isHidden", (args, res, instance) => {
    return (
      ![1, 3].includes(instance.type) && !originalCan(DiscordConstants.Plq.VIEW_CHANNEL, instance)
    );
  });

  if (!shc.get("MarkUnread", defaultSettings.MarkUnread)) {
    PluginInjector.after(UnreadStore, "getGuildChannelUnreadState", (args, res, instance) => {
      return args[0]?.isHidden?.() ? { mentionCount: 0, hasNotableUnread: false } : res;
    });

    PluginInjector.after(UnreadStore, "getMentionCount", (args, res) => {
      return ChannelStore.getChannel(args[0])?.isHidden?.() ? 0 : res;
    });

    PluginInjector.after(UnreadStore, "getUnreadCount", (args, res) => {
      return ChannelStore.getChannel(args[0])?.isHidden?.() ? 0 : res;
    });

    PluginInjector.after(UnreadStore, "hasNotableUnread", (args, res) => {
      return res && !ChannelStore.getChannel(args[0])?.isHidden?.();
    });

    PluginInjector.after(UnreadStore, "hasRelevantUnread", (args, res) => {
      return res && !args[0].isHidden?.();
    });

    PluginInjector.after(UnreadStore, "hasTrackedUnread", (args, res) => {
      return res && !ChannelStore.getChannel(args[0])?.isHidden?.();
    });

    PluginInjector.after(UnreadStore, "hasUnread", (args, res) => {
      return res && !ChannelStore.getChannel(args[0])?.isHidden?.();
    });

    PluginInjector.after(UnreadStore, "hasUnreadPins", (args, res) => {
      return res && !ChannelStore.getChannel(args[0])?.isHidden?.();
    });
  }

  //* Make hidden channel visible
  PluginInjector.after(ChannelPermissionStore, "can", (args, res) => {
    if (!args[1]?.isHidden?.()) return res;
    if (args[0] == DiscordConstants.Plq.VIEW_CHANNEL)
      return (
        !shc.get("blacklistedGuilds", defaultSettings.blacklistedGuilds)[args[1].guild_id] &&
        shc.get("channels", defaultSettings.channels)[DiscordConstants.d4z[args[1].type]]
      );
    if (args[0] == DiscordConstants.Plq.CONNECT) return false;

    return res;
  });

  PluginInjector.after(Route, "Z", (args, res, instance) => {
    const channelId = res.props?.computedMatch?.params?.channelId;
    const guildId = res.props?.computedMatch?.params?.guildId;
    const channel = ChannelStore?.getChannel(channelId);
    if (guildId && channel?.isHidden?.() && channel?.id != Voice.getChannelId())
      res.props.render = () => (
        <Lockscreen
          {...{
            channel,
            guild: GuildStore.getGuild(guildId),
          }}></Lockscreen>
      );
    return res;
  });

  //* Stop fetching messages if the channel is hidden
  PluginInjector.instead(MessageActions, "fetchMessages", ([args], res) => {
    if (ChannelStore.getChannel(args.channelId)?.isHidden?.()) return;
    return res(args);
  });

  PluginInjector.after(ChannelItem, "Z", (args, res) => {
    if (shc.get("disableIcons", defaultSettings.disableIcons)) return res;
    const instance = args[0];
    if (!instance.channel?.isHidden?.()) return res;
    const item = res.props?.children?.props;
    if (item?.className)
      item.className += ` shc-hidden-channel shc-hidden-channel-type-${instance.channel.type}`;

    const children = Utils.findInReactTree(res, (m) =>
      m?.props?.onClick?.toString().includes("stopPropagation"),
    );
    if (children?.props?.children)
      children.props.children = [
        <Tooltip
          text="Hidden Channel"
          {...{
            className: `${IconClasses.iconItem}`,
            style: {
              display: "block",
            },
          }}>
          {Utils.getParameterCaseInsensitive(
            Icons,
            shc.get("hiddenChannelIcon", defaultSettings.hiddenChannelIcon),
          )}
        </Tooltip>,
      ];

    if (instance.channel.type == DiscordConstants.d4z.GUILD_VOICE && !instance.connected) {
      const wrapper = Utils.findInReactTree(res, (n) =>
        n?.props?.className?.includes(ChannelClasses.wrapper),
      );
      if (wrapper) {
        wrapper.props.onMouseDown = () => {};
        wrapper.props.onMouseUp = () => {};
      }
      const mainContent = Utils.findInReactTree(res, (n) =>
        n?.props?.className?.includes(ChannelClasses.mainContent),
      );

      if (mainContent) {
        mainContent.props.onClick = () => {};
        mainContent.props.href = null;
      }
    }
  });

  //* Remove lock icon from hidden voice channels
  PluginInjector.before(ChannelUtil, "KS", (args, instance) => {
    if (!args[2]) return;
    if (args[0]?.isHidden?.() && args[2].locked) {
      args[2].locked = false;
    }
  });

  //* Manually collapse hidden channel category
  PluginInjector.after(CategoryStore, "getCollapsedCategories", (args, res) => {
    return { ...res, ...shc.get("collapsed", {}) };
  });

  PluginInjector.after(CategoryStore, "isCollapsed", (args, res) => {
    if (!args[0]?.endsWith("hidden")) {
      return res;
    }

    if (!shc.get("alwaysCollapse", defaultSettings.alwaysCollapse))
      return shc.get("collapsed", {})[args[0]];

    return (
      shc.get("alwaysCollapse", defaultSettings.alwaysCollapse) &&
      shc.get("collapsed", {})[args[0]] !== false
    );
  });

  PluginInjector.after(CategoryUtil, "c4", (args, res, instance) => {
    if (!args[0]?.endsWith("hidden") || shc.get("collapsed", {})[args[0]]) return;
    const collapsed = shc.get("collapsed", {});
    collapsed[args[0]] = true;
    Utils.rerenderChannels();
    shc.set("collapsed", collapsed);
  });

  PluginInjector.after(CategoryUtil, "N5", (args, res, instance) => {
    if (shc.get("collapsed", {})[`${args[0]}_hidden`]) return;
    const collapsed = shc.get("collapsed", {});
    collapsed[`${args[0]}_hidden`] = true;
    Utils.rerenderChannels();
    shc.set("collapsed", collapsed);
  });

  PluginInjector.after(CategoryUtil, "mJ", (args, res, instance) => {
    if (!args[0]?.endsWith("hidden")) return;
    const collapsed = shc.get("collapsed", {});
    collapsed[args[0]] = false;
    Utils.rerenderChannels();
    shc.set("collapsed", collapsed);
  });

  PluginInjector.after(CategoryUtil, "lc", (args, res, instance) => {
    const collapsed = shc.get("collapsed", {});
    collapsed[`${args[0]}_hidden`] = false;
    Utils.rerenderChannels();
    shc.set("collapsed", collapsed);
  });

  PluginInjector.after(GuildChannelsStore, "getChannels", (args, res, instance) => {
    const GuildCategories = res[DiscordConstants.d4z.GUILD_CATEGORY];
    const hiddenId = `${args[0]}_hidden`;
    const hiddenCategory = GuildCategories?.find((m) => m.channel.id == hiddenId);
    if (!hiddenCategory) return res;
    const noHiddenCats = GuildCategories.filter((m) => m.channel.id !== hiddenId);
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
  PluginInjector.after(ChannelStore, "getMutableGuildChannelsForGuild", (args, res, instance) => {
    if (
      shc.get("sort", defaultSettings.sort) !== "extra" ||
      shc.get("blacklistedGuilds", defaultSettings.blacklistedGuilds)[args[0]]
    )
      return;
    const hiddenId = `${args[0]}_hidden`;
    const HiddenCategoryChannel = new Channel({
      guild_id: args[0],
      id: hiddenId,
      name: "Hidden Channels",
      type: DiscordConstants.d4z.GUILD_CATEGORY,
    });
    const GuildCategories = GuildChannelsStore.getChannels(args[0])[
      DiscordConstants.d4z.GUILD_CATEGORY
    ];
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
  PluginInjector.after(ChannelListStore, "getGuild", (args, res, instance) => {
    if (shc.get("debugMod", defaultSettings.debugMode)) PluginLogger.log("ChannelList", res);
    if (shc.get("blacklistedGuilds", defaultSettings.blacklistedGuilds)[args[0]]) return;
    switch (shc.get("sort", defaultSettings.sort)) {
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
            ...Object.values(res.guildChannels.categories).filter((m) => m.id !== hiddenId),
          ],
          args[0],
        );

        HiddenCategory.channels = Object.fromEntries(
          Object.entries(hiddenChannels.records).map(([id, channel]) => {
            channel.category = HiddenCategory;
            return [id, channel];
          }),
        );

        HiddenCategory.isCollapsed =
          shc.get("alwaysCollapse", defaultSettings.alwaysCollapse) &&
          shc.get("collapsed", {})[hiddenId] !== false;
        HiddenCategory.shownChannelIds =
          shc.get("collapsed", {})[hiddenId] ||
          res.guildChannels.collapsedCategoryIds[hiddenId] ||
          HiddenCategory.isCollapsed
            ? []
            : hiddenChannels.channels
                .sort((x, y) => {
                  const xPos = x.position + (x.isGuildVocal() ? 1e4 : 1e5);
                  const yPos = y.position + (y.isGuildVocal() ? 1e4 : 1e5);

                  return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
                })
                .map((m) => m.id);
        break;
      }
    }

    if (shc.get("shouldShowEmptyCategory", defaultSettings.shouldShowEmptyCategory)) {
      Utils.patchEmptyCategoryFunction([
        ...Object.values(res.guildChannels.categories).filter((m) => !m.id.includes("hidden")),
      ]);
    }

    return res;
  });
};
const addChangeListener = () => {
  PluginInjector.after(shc, "set", () => {
    Utils.rerenderChannels();
  });
};
export const start = () => {
  registerSettings();
  applyInjections();
  addChangeListener();
  Utils.rerenderChannels();
};

export const stop = () => {
  PluginInjector.uninjectAll();
  Utils.rerenderChannels();
};

export { addSHCEntry } from "./lib/guild-context.jsx";

export { Settings } from "./Components/Settings.jsx";
