/* eslint-disable no-undefined */
import { settings, util } from "replugged";
import { React, lodash } from "replugged/common";
import { PluginInjector, PluginLogger } from "../index";
import {
  ChannelListClasses,
  ChannelListStore,
  ChannelStore,
  DiscordConstants,
  LocaleManager,
  PermissionStore,
} from "./requiredModules";
import Types from "../types";

export const isObject = (testMaterial: unknown): boolean =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

export const capitalizeFirst = (string: string): string =>
  `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;

export const randomNo = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

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

export const useSetting = <
  T extends Record<string, Types.Jsonifiable>,
  D extends keyof T,
  K extends Extract<keyof T, string>,
  F extends Types.NestedType<T, P> | T[K] | undefined,
  P extends `${K}.${string}` | K,
>(
  settings: settings.SettingsManager<T, D>,
  key: P,
  fallback?: F,
): {
  value: Types.NestedType<T, P> | F;
  onChange: (newValue: Types.ValType<Types.NestedType<T, P> | F>) => void;
} => {
  const [initialKey, ...pathArray] = Object.keys(settings.all()).includes(key)
    ? ([key] as [K])
    : (key.split(".") as [K, ...string[]]);
  const path = pathArray.join(".");
  const initial = settings.get(initialKey, path.length ? ({} as T[K]) : (fallback as T[K]));
  const [value, setValue] = React.useState<Types.NestedType<T, P>>(
    path.length
      ? (lodash.get(initial, path, fallback) as Types.NestedType<T, P>)
      : (initial as Types.NestedType<T, P>),
  );

  return {
    value,
    onChange: (newValue: Types.ValType<Types.NestedType<T, P> | F>) => {
      const isObj = newValue && typeof newValue === "object";
      const value = isObj && "value" in newValue ? newValue.value : newValue;
      const checked = isObj && "checked" in newValue ? newValue.checked : undefined;
      const target =
        isObj && "target" in newValue && newValue.target && typeof newValue.target === "object"
          ? newValue.target
          : undefined;
      const targetValue = target && "value" in target ? target.value : undefined;
      const targetChecked = target && "checked" in target ? target.checked : undefined;
      const finalValue = checked ?? targetChecked ?? targetValue ?? value ?? newValue;

      setValue(finalValue as Types.NestedType<T, P>);
      settings.set(
        initialKey,
        path.length ? (lodash.set(initial, path, finalValue) as T[K]) : (finalValue as T[K]),
      );
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

  const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId) as Record<
    string,
    Types.Channel
  >;
  const hiddenChannels = Object.values(guildChannels).filter(
    (m) => m.isHidden() && m.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY,
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

export const forceRerenderElement = (selector: string): void => {
  const element = document.querySelector(selector);

  if (!element) return;

  const ownerInstance = util.getOwnerInstance(element);

  const unpatchRender = PluginInjector.instead(ownerInstance, "render", () => {
    unpatchRender();
    return null;
  });

  ownerInstance.forceUpdate(() => ownerInstance.forceUpdate(() => {}));
};

export const rerenderChannels = (): void => {
  PermissionStore.clearVars();

  PermissionStore.initialize();

  ChannelListStore.clearVars();

  ChannelListStore.initialize();

  forceRerenderElement(`.${ChannelListClasses.container}`);
};

export default {
  ...util,
  capitalizeFirst,
  randomNo,
  convertToHMS,
  getDateFromSnowflake,
  useSetting,
  patchEmptyCategoryFunction,
  sortChannels,
  getHiddenChannels,
  getHiddenChannelRecord,
  forceRerenderElement,
  rerenderChannels,
};
