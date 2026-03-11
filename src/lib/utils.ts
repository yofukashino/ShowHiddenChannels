import { util } from "replugged";
import { channels, constants, i18n } from "replugged/common";
import { PluginInjector, PluginLogger, SettingValues } from "@this";
import {
  ChannelListClasses,
  ChannelListStore,
  GuildCategoryStore,
  GuildChannelStore,
  PermissionStore,
} from "@lib/RequiredModules";
import Types from "@Types";
import { DefaultSettings } from "@Consts";

export const isObject = (testMaterial: unknown): boolean =>
  typeof testMaterial === "object" && !Array.isArray(testMaterial) && testMaterial != null;

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
    const locale = i18n.intl.currentLocale as string;
    const id = parseInt(number, 10);
    const binary = id.toString(2).padStart(64, "0");
    const excerpt = binary.substring(0, 42);
    const decimal = parseInt(excerpt, 2);
    const unix = decimal + 1420070400000;
    return new Date(unix).toLocaleString(locale);
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

export const isHidden = (channelId: string, channel?: Partial<Types.Channel>): boolean => {
  channel ??= channels.getChannel(channelId);
  if (!channel) return false;
  const isDM = [1, 3].includes(channel.type);
  const canView = PermissionStore.can(constants.Permissions.VIEW_CHANNEL, channel, true);

  return !isDM && !canView;
};

export const getHiddenChannels = (
  guildId: string,
): { channels: Types.Channel[]; amount: number } => {
  if (!guildId) return { channels: [], amount: 0 };

  const guildChannels = channels.getMutableGuildChannelsForGuild(guildId) as Record<
    string,
    Types.Channel
  >;
  const hiddenChannels = Object.values(guildChannels).filter(
    (c) => isHidden(c.id, c) && c.type !== constants.ChannelTypes.GUILD_CATEGORY,
  );

  return { channels: hiddenChannels, amount: hiddenChannels.length };
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

    ownerInstance.forceUpdate(() => ownerInstance.forceUpdate(() => void 0));
  } catch {}
};

export const rerenderChannels = (): void => {
  try {
    PermissionStore?.clearVars();

    PermissionStore?.initialize();

    ChannelListStore?.clearVars();

    ChannelListStore?.initialize();

    GuildChannelStore?.clearVars();

    GuildChannelStore?.initialize();

    GuildCategoryStore?.clearVars();

    GuildCategoryStore?.initialize();
    forceRerenderElement(`.${ChannelListClasses?.container}`);
  } catch (err) {
    PluginLogger.error("Error Rerendering the channels", err);
  }
};

export const debug = (...args: unknown[]): void => {
  const debug = SettingValues.get("debugMode", DefaultSettings.debugMode);
  if (debug) PluginLogger.verbose(...args);
};

export default {
  ...util,
  convertToHMS,
  getDateFromSnowflake,
  isTextSvgHtml,
  getAcronym,
  isHidden,
  getHiddenChannels,
  forceRerenderElement,
  rerenderChannels,
  debug,
};
