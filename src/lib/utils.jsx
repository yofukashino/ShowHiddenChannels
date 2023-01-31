/* eslint-disable no-undefined */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-prototype-builtins */
import { PluginInjector, PluginLogger } from "../index.jsx";
import { util } from "replugged";
import {
  ChannelListStore,
  ChannelPermissionStore,
  ChannelStore,
  DiscordConstants,
  LocaleManager,
  container,
} from "./requiredModules.jsx";
export const isObject = (testMaterial) =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

export const getFunctionKeyFromStrings = (Module, StringArray) =>
  Object.keys(Module).find((FunctionKey) =>
    StringArray.every((s) => Module[FunctionKey].toString().includes(s)),
  );

const findInTree = (tree, searchFilter, { walkable = null, ignore = [] } = {}) => {
  if (typeof searchFilter === "string") {
    if (tree.hasOwnProperty(searchFilter)) return tree[searchFilter];
  } else if (searchFilter(tree)) {
    return tree;
  }
  if (typeof tree !== "object" || tree == null) return undefined;
  let tempReturn;
  if (Array.isArray(tree)) {
    for (const value of tree) {
      tempReturn = findInTree(value, searchFilter, { walkable, ignore });
      if (typeof tempReturn != "undefined") return tempReturn;
    }
  } else {
    const toWalk = walkable == null ? Object.keys(tree) : walkable;
    for (const key of toWalk) {
      if (!tree.hasOwnProperty(key) || ignore.includes(key)) continue;
      tempReturn = findInTree(tree[key], searchFilter, { walkable, ignore });
      if (typeof tempReturn != "undefined") return tempReturn;
    }
  }
  return tempReturn;
};

export const findInReactTree = (tree, searchFilter) => {
  return findInTree(tree, searchFilter, { walkable: ["props", "children", "child", "sibling"] });
};

export const capitalizeFirst = (string) =>
  `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;
export const randomNo = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const NOOP = () => null;

export const convertToHMS = (seconds) => {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

export const getDateFromSnowflake = (number) => {
  try {
    const id = parseInt(number, 10);
    const binary = id.toString(2).padStart(64, "0");
    const excerpt = binary.substring(0, 42);
    const decimal = parseInt(excerpt, 2);
    const unix = decimal + 1420070400000;
    return new Date(unix).toLocaleString(LocaleManager._chosenLocale);
  } catch (err) {
    PluginLogger.error(err);
    return "(Failed to get date)";
  }
};

export const getParameterCaseInsensitive = (object, key) => {
  const asLowercase = key.toLowerCase();
  return object[Object.keys(object).find((k) => k.toLowerCase() === asLowercase)];
};

export const patchEmptyCategoryFunction = (categories) => {
  for (const category of categories) {
    if (!category.shouldShowEmptyCategory.__originalFunction) {
      PluginInjector.instead(category, "shouldShowEmptyCategory", () => true);
    }
  }
};

export const sortChannels = (category) => {
  if (!category) return;
  const channelArray = Object.values(category.channels);
  category.shownChannelIds = channelArray
    .sort((x, y) => {
      const xPos =
        x.record.position + (x.record.isGuildVocal() ? 1e4 : 0) + (x.record.isHidden() ? 1e5 : 0);
      const yPos =
        y.record.position + (y.record.isGuildVocal() ? 1e4 : 0) + (y.record.isHidden() ? 1e5 : 0);
      return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
    })
    .map((n) => n.id);
};

export const getHiddenChannels = (guildId) => {
  if (!guildId) return { channels: [], amount: 0 };

  const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
  const hiddenChannels = Object.values(guildChannels).filter(
    (m) => m.isHidden() && m.type != DiscordConstants.d4z.GUILD_CATEGORY,
  );

  return { channels: hiddenChannels, amount: hiddenChannels.length };
};

export const hiddenChannelCache = {};

export const getHiddenChannelRecord = (categories, guildId) => {
  const hiddenChannels = getHiddenChannels(guildId);
  if (!hiddenChannelCache[guildId]) {
    hiddenChannelCache[guildId] = [];
  }

  for (const category of categories) {
    const channels = Object.entries(category.channels);
    for (const channel of channels) {
      if (hiddenChannels.channels.some((m) => m.id == channel[0])) {
        if (!hiddenChannelCache[guildId].some((m) => m[0] == channel[0]))
          hiddenChannelCache[guildId].push(channel);
        delete category.channels[channel[0]];
      }
    }
  }

  return { records: Object.fromEntries(hiddenChannelCache[guildId]), ...hiddenChannels };
};

export const forceUpdate = (element) => {
  if (!element) return;
  const toForceUpdate = util.getOwnerInstance(element);
  const forceRerender = PluginInjector.instead(toForceUpdate, "render", () => {
    forceRerender();
    return null;
  });

  toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => {}));
};

export const rerenderChannels = () => {
  const ChannelPermsssionCache = ChannelPermissionStore.__getLocalVars();

  for (const key in ChannelPermsssionCache) {
    if (
      typeof ChannelPermsssionCache[key] != "object" &&
      Array.isArray(ChannelPermsssionCache[key]) &&
      ChannelPermsssionCache[key] === null
    ) {
      return;
    }

    for (const id in ChannelPermsssionCache[key]) {
      delete ChannelPermsssionCache[key][id];
    }
  }

  ChannelPermissionStore.initialize();

  const ChanneListCache = ChannelListStore.__getLocalVars();
  for (const guildId in ChanneListCache.state.guilds) {
    delete ChanneListCache.state.guilds[guildId];
  }

  ChannelListStore.initialize();

  forceUpdate(document.querySelector(`.${container}`));
};
