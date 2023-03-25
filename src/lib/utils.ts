import { common, util } from "replugged";
import { PluginInjector, PluginLogger, SettingValues, lodash } from "../index";
import {
  ChannelListClasses,
  ChannelListStore,
  ChannelStore,
  DiscordConstants,
  LocaleManager,
  PermissionStore,
} from "./requiredModules";
import * as Types from "../types";
const { React } = common;
export const findInTree = (
  tree: object,
  searchFilter: Types.DefaultTypes.AnyFunction,
  searchOptions: { ignore?: string[]; walkable?: null | string[] },
): unknown => {
  const { walkable = null, ignore = [] } = searchOptions;
  if (typeof searchFilter === "string") {
    if (Object.hasOwnProperty.call(tree, searchFilter)) return tree[searchFilter];
  } else if (searchFilter(tree)) {
    return tree;
  }
  if (typeof tree !== "object" || tree == null) return;

  let tempReturn: unknown;
  if (Array.isArray(tree)) {
    for (const value of tree) {
      tempReturn = findInTree(value, searchFilter, { walkable, ignore });
      if (typeof tempReturn !== "undefined") return tempReturn;
    }
  } else {
    const toWalk = walkable == null ? Object.keys(tree) : walkable;
    for (const key of toWalk) {
      if (!Object.hasOwnProperty.call(tree, key) || ignore.includes(key)) continue;
      tempReturn = findInTree(tree[key], searchFilter, { walkable, ignore });
      if (typeof tempReturn !== "undefined") return tempReturn;
    }
  }
  return tempReturn;
};

export const findInReactTree = (
  tree: Types.ReactElement,
  searchFilter: Types.DefaultTypes.AnyFunction,
): unknown | Types.ReactElement => {
  return findInTree(tree, searchFilter, { walkable: ["props", "children", "child", "sibling"] });
};

export const isObject = (testMaterial: unknown): boolean =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

export const capitalizeFirst = (string: string): string =>
  `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;
export const randomNo = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);
export const NOOP = (): null => null;

export const convertToHMS = (seconds: string | number): string => {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? `${h}${h === 1 ? " hour" : " hours"}` : "";
  const mDisplay = m > 0 ? `${m}${m === 1 ? " minute" : " minutes"}` : "";
  const sDisplay = s > 0 ? `${s}${s === 1 ? " second" : " seconds"}` : "";
  return hDisplay + mDisplay + sDisplay;
};

export const getDateFromSnowflake = (number: string): string => {
  try {
    const id = parseInt(number, 10);
    const binary = id.toString(2).padStart(64, "0");
    const excerpt = binary.substring(0, 42);
    const decimal = parseInt(excerpt, 2);
    const unix = decimal + 1420070400000;
    return new Date(unix).toLocaleString(LocaleManager._chosenLocale);
  } catch (error) {
    PluginLogger.error(error);
    return "(Failed to get date)";
  }
};

export const getParameterCaseInsensitive = (object: object, key: string): unknown => {
  const asLowercase = key.toLowerCase();
  return object[Object.keys(object).find((k) => k.toLowerCase() === asLowercase)];
};
export const useSetting = (
  settingsManager: typeof SettingValues,
  path: string,
  defaultValue?: string,
  options?: { clearable?: boolean },
): {
  value: string;
  onChange: (newValue: string | { value: string }) => void;
  onClear: () => void;
} => {
  const { clearable = false } = options ?? {};
  const [key, ...realPath] = path.split(".");
  const realPathJoined = realPath.join(".");
  const setting = settingsManager.get(key as keyof Types.Settings);
  const initial = realPath.length
    ? lodash.get(setting, realPathJoined, defaultValue)
    : (setting as unknown as string);
  const [value, setValue] = React.useState(initial);

  return {
    value,
    onClear: clearable
      ? () => {
          setValue("");
          const changed = realPath.length
            ? lodash.set(setting as object, realPathJoined, "")
            : ("" as never);
          settingsManager.set(key as keyof Types.Settings, changed);
        }
      : () => null,
    onChange: (newValue) => {
      if (typeof newValue == "object" && Object.hasOwnProperty.call(newValue, "value"))
        newValue = newValue.value;
      setValue(newValue as unknown as string);
      const changed = realPath.length
        ? lodash.set(setting as object, realPathJoined, newValue)
        : (newValue as never);
      settingsManager.set(key as keyof Types.Settings, changed);
    },
  };
};

export const patchEmptyCategoryFunction = (categories: Types.ChannelListCategory[]): void => {
  for (const category of categories)
    PluginInjector.instead(category, "shouldShowEmptyCategory", () => true);
};

export const sortChannels = (category: Types.ChannelListCategory): void => {
  if (!category) return;
  const channelArray = Object.values(category.channels);
  category.shownChannelIds = channelArray
    .sort((x: Types.ChannelRecord, y: Types.ChannelRecord) => {
      const xPos =
        x.record.position + (x.record.isGuildVocal() ? 1e4 : 0) + (x.record.isHidden() ? 1e5 : 0);
      const yPos =
        y.record.position + (y.record.isGuildVocal() ? 1e4 : 0) + (y.record.isHidden() ? 1e5 : 0);
      return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
    })
    .map((n: Types.ChannelRecord) => n.id);
};

export const getHiddenChannels = (guildId: string): Types.HiddenChannels => {
  if (!guildId) return { channels: [], amount: 0 };

  const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
  const hiddenChannels = Object.values(guildChannels).filter(
    (m) => m.isHidden() && m.type !== DiscordConstants.ChanneTypes.GUILD_CATEGORY,
  );

  return { channels: hiddenChannels, amount: hiddenChannels.length };
};

export const hiddenChannelCache = {};

export const getHiddenChannelRecord = (
  categories: Types.ChannelListCategory[],
  guildId: string,
): Types.HiddenChannelRecord => {
  const hiddenChannels = getHiddenChannels(guildId);
  if (!hiddenChannelCache[guildId]) hiddenChannelCache[guildId] = [];

  for (const category of categories) {
    const channelRecords = Object.entries(category.channels);
    const filteredChannelRecords = channelRecords
      .map(
        ([channelID, channelRecord]: [string, Types.ChannelRecord]):
          | [string, Types.ChannelRecord]
          | boolean => {
          if (hiddenChannels.channels.some((m) => m.id === channelID)) {
            if (!hiddenChannelCache[guildId].some((m) => m[0] === channelID))
              hiddenChannelCache[guildId].push([channelID, channelRecord]);
            return false;
          }
          return [channelID, channelRecord];
        },
      )
      .filter(Boolean) as Array<[string, Types.ChannelRecord]>;
    category.channels = Object.fromEntries(filteredChannelRecords);
  }

  return { records: Object.fromEntries(hiddenChannelCache[guildId]), ...hiddenChannels };
};

export const forceUpdate = (element: Element): void => {
  if (!element) return;
  const toForceUpdate = util.getOwnerInstance(element);
  const forceRerender = PluginInjector.instead(toForceUpdate, "render", () => {
    forceRerender();
    return null;
  });

  toForceUpdate.forceUpdate(() => toForceUpdate.forceUpdate(() => {}));
};

export const rerenderChannels = (): void => {
  PermissionStore.clearVars();

  PermissionStore.initialize();

  ChannelListStore.clearVars();

  ChannelListStore.initialize();

  forceUpdate(document.querySelector(`.${ChannelListClasses.container}`));
};
