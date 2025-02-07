/* eslint-disable no-undefined */
import { settings, util, webpack } from "replugged";
import { React, lodash } from "replugged/common";
import { PluginInjector, PluginLogger } from "../index";
import Modules from "./requiredModules";
import Types from "../types";

export const isObject = (testMaterial: unknown): boolean =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

export const capitalizeFirst = (string: string): string =>
  `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;

export const randomNo = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const convertToHMS = (seconds: string | number): string => {
  seconds = Number(seconds);
  if (!seconds) return "0 seconds";
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
    return new Date(unix).toLocaleString(Modules.LocaleManager._chosenLocale);
  } catch (error) {
    PluginLogger.error(error);
    return "(Failed to get date)";
  }
};

export const isTextSvgHtml = (content: string): boolean => {
  const trimmedContent = content.trim();
  return (
    trimmedContent.startsWith("<svg") ||
    trimmedContent.startsWith("<?xml") ||
    trimmedContent.startsWith("<!DOCTYPE svg")
  );
};

export const getAcronym = (string: string): string =>
  string != null
    ? string
        .replace(/'s /g, " ")
        .replace(/\w+/g, (string) => string[0])
        .replace(/\s/g, "")
    : "";

export const useSetting = <
  T extends Record<string, Types.Jsonifiable>,
  D extends keyof T,
  K extends Extract<keyof T, string>,
  F extends Types.NestedType<T, P> | T[K] | undefined,
  P extends `${K}.${string}` | `${K}/${string}` | `${K}-${string}` | K,
  V extends P extends `${K}.${string}` | `${K}/${string}` | `${K}-${string}`
    ? NonNullable<Types.NestedType<T, P>>
    : P extends D
    ? NonNullable<T[P]>
    : F extends null | undefined
    ? T[P] | undefined
    : NonNullable<T[P]> | F,
>(
  settings: settings.SettingsManager<T, D>,
  key: P,
  fallback?: F,
): {
  value: V;
  onChange: (newValue: Types.ValType<Types.NestedType<T, P>> | Types.ValType<T[K]>) => void;
} => {
  const initial = settings.get(key as K) ?? lodash.get(settings.all(), key) ?? fallback;
  const [value, setValue] = React.useState(initial as V);

  return {
    value,
    onChange: (newValue: Types.ValType<Types.NestedType<T, P>> | Types.ValType<T[K]>) => {
      const isObj = newValue && typeof newValue === "object";
      const value = isObj && "value" in newValue ? newValue.value : newValue;
      const checked = isObj && "checked" in newValue ? newValue.checked : undefined;
      const target =
        isObj && "target" in newValue && newValue.target && typeof newValue.target === "object"
          ? newValue.target
          : undefined;
      const targetValue = target && "value" in target ? target.value : undefined;
      const targetChecked = target && "checked" in target ? target.checked : undefined;
      const finalValue = (checked ?? targetChecked ?? targetValue ?? value ?? newValue) as T[K];

      setValue(finalValue as V);

      if (settings.get(key as K)) {
        settings.set(key as K, finalValue);
      } else {
        const [rootKey] = key.split(/[-/.]/);
        const setting = lodash.set(settings.all(), key, finalValue)[rootKey as K];
        settings.set(rootKey as K, setting);
      }
    },
  };
};

export const useSettingArray = <
  T extends Record<string, Types.Jsonifiable>,
  D extends keyof T,
  K extends Extract<keyof T, string>,
  F extends Types.NestedType<T, P> | T[K] | undefined,
  P extends `${K}.${string}` | `${K}/${string}` | `${K}-${string}` | K,
  V extends P extends `${K}.${string}` | `${K}/${string}` | `${K}-${string}`
    ? NonNullable<Types.NestedType<T, P>>
    : P extends D
    ? NonNullable<T[P]>
    : F extends null | undefined
    ? T[P] | undefined
    : NonNullable<T[P]> | F,
>(
  settings: settings.SettingsManager<T, D>,
  key: P,
  fallback?: F,
): [V, (newValue: Types.ValType<Types.NestedType<T, P>> | Types.ValType<T[K]>) => void] => {
  const { value, onChange } = useSetting(settings, key, fallback);

  return [value as V, onChange];
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

  const guildChannels = Modules.ChannelStore.getMutableGuildChannelsForGuild(guildId) as Record<
    string,
    Types.Channel
  >;
  const hiddenChannels = Object.values(guildChannels).filter(
    (m) => m.isHidden() && m.type !== Modules.DiscordConstants.ChannelTypes.GUILD_CATEGORY,
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
    if (category.hiddenChannelIds)
      category.hiddenChannelIds = category.hiddenChannelIds.filter((v) =>
        filteredChannelRecords.some(([id]) => id == v),
      );

    if (category.shownChannelIds)
      category.shownChannelIds = category.shownChannelIds.filter((v) =>
        filteredChannelRecords.some(([id]) => id == v),
      );
  }

  return { records: Object.fromEntries(hiddenChannelCache[guildId]), ...hiddenChannels };
};

export const forceRerenderElement = (selector: string): void => {
  try {
    const element = document.querySelector(selector);

    if (!element) return;

    const ownerInstance = util.getOwnerInstance(element);

    const unpatchRender = PluginInjector.instead(ownerInstance, "render", () => {
      unpatchRender();
      return null;
    });

    ownerInstance.forceUpdate(() => ownerInstance.forceUpdate(() => {}));
  } catch {}
};

export const rerenderChannels = (): void => {
  try {
    Modules.PermissionStore?.clearVars();

    Modules.PermissionStore?.initialize();

    Modules.ChannelListStore?.clearVars();

    Modules.ChannelListStore?.initialize();

    forceRerenderElement(`.${Modules.ChannelListClasses?.container}`);
  } catch (err) {
    PluginLogger.error("Error Rerendering the channels", err);
  }
};

export const unmangleExports = <T>(
  moduleFilter: Types.DefaultTypes.Filter | Types.DefaultTypes.RawModule,
  map: Record<string, string | string[] | RegExp | Types.DefaultTypes.AnyFunction>,
): T => {
  const getExportKeyFinder = (
    mapValue: string | string[] | RegExp | Types.DefaultTypes.AnyFunction,
  ): Types.DefaultTypes.AnyFunction => {
    if (typeof mapValue === "function") {
      return (mod: Types.DefaultTypes.RawModule["exports"]) => {
        return mapValue(mod);
      };
    }

    if (Array.isArray(mapValue)) {
      return (mod: Types.DefaultTypes.RawModule["exports"]) => {
        if (!isObject(mod)) return "";
        for (const [k, exported] of Object.entries(mod)) {
          if (mapValue.every((p) => Object.hasOwnProperty.call(exported, p))) return k;
        }
      };
    }

    return (mod: Types.DefaultTypes.RawModule["exports"]) =>
      webpack.getFunctionKeyBySource(mod, mapValue as string);
  };

  const mod: Types.DefaultTypes.RawModule =
    typeof moduleFilter === "function"
      ? webpack.getModule(moduleFilter, { raw: true })
      : moduleFilter;

  if (!mod) return {} as T;

  const unmangled = {} as T;

  for (const key in map) {
    const findKey = getExportKeyFinder(map[key]);
    const valueKey = findKey(mod.exports) as string;
    Object.defineProperty(unmangled, key, {
      get: () => mod.exports[valueKey],
      set: (v) => {
        mod.exports[valueKey] = v;
      },
    });
  }

  // Return the unmangled object
  return unmangled;
};

export default {
  ...util,
  capitalizeFirst,
  randomNo,
  convertToHMS,
  getDateFromSnowflake,
  isTextSvgHtml,
  getAcronym,
  useSetting,
  useSettingArray,
  patchEmptyCategoryFunction,
  sortChannels,
  getHiddenChannels,
  getHiddenChannelRecord,
  forceRerenderElement,
  rerenderChannels,
  unmangleExports,
};
