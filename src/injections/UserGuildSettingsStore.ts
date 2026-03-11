import { PluginInjector, SettingValues } from "@this";
import { DefaultSettings } from "@Consts";
import { UserGuildSettingsStore } from "@lib/RequiredModules";
import Utils from "@Utils";

PluginInjector.after(
  UserGuildSettingsStore,
  "getMutedChannels",
  ([guildId]: [string], res: Set<string>) => {
    const faded = SettingValues.get("faded", DefaultSettings.faded);
    const sort = SettingValues.get("sort", DefaultSettings.sort);

    if (!faded || !guildId) return res;

    const HiddenChannelIDs = Utils.getHiddenChannels(guildId).channels.map((c) => c.id);
    const Category = sort === "extra" ? [`${guildId}_hidden`] : [];
    return new Set([...res, ...Category, ...HiddenChannelIDs]);
  },
);

PluginInjector.after(
  UserGuildSettingsStore,
  "isChannelMuted",
  ([guildId, channelId]: [string, string], res: boolean) => {
    if (!guildId) return res;
    const faded = SettingValues.get("faded", DefaultSettings.faded);
    const sort = SettingValues.get("sort", DefaultSettings.sort);
    const isHidden = Utils.isHidden(channelId);
    const isHiddenCategory = sort === "extra" || channelId.endsWith("hidden");

    if (!faded || (!isHidden && !isHiddenCategory)) return res;

    return true;
  },
);
