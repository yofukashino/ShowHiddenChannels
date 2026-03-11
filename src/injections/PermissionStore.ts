import { constants } from "replugged/common";
import { PluginInjector, SettingValues } from "@this";
import { PermissionStore } from "@lib/RequiredModules";
import { DefaultSettings } from "@Consts";
import Utils from "@Utils";

const { Permissions, ChannelTypes } = constants;

PluginInjector.after(PermissionStore, "can", ([permission, channel, original], res) => {
  if (
    original ||
    !channel ||
    !Utils.isHidden(channel?.id, channel) ||
    permission !== Permissions.VIEW_CHANNEL
  )
    return res;
  if (permission === Permissions.CONNECT) return false;

  const guildBlacklist = SettingValues.get("blacklistedGuilds", DefaultSettings.blacklistedGuilds);
  const typeWhitelist = SettingValues.get("channels", DefaultSettings.channels);

  return (
    !(guildBlacklist[channel.guild_id] ?? false) &&
    (typeWhitelist[ChannelTypes[channel.type]] ?? true)
  );
});
