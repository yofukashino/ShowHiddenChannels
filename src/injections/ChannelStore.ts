import { webpack } from "replugged";
import { channels, constants } from "replugged/common";
import { PluginInjector, SettingValues } from "@this";
import { Channels, GuildChannelStore } from "@lib/RequiredModules";
import { DefaultSettings } from "@Consts";

import type { GuildChannel } from "@lib/RequiredModules/GuildChannelStore";
import type { BaseChannel } from "@lib/RequiredModules/Channels";

const { ChannelTypes } = constants;

const Channel = webpack.getFunctionBySource<BaseChannel>(Channels, "get permissionOverwrites");

PluginInjector.after(channels, "getChannel", ([channelId], res) => {
  const sort = SettingValues.get("sort", DefaultSettings.sort);
  const blacklistedGuilds = SettingValues.get(
    "blacklistedGuilds",
    DefaultSettings.blacklistedGuilds,
  );

  const guildId = channelId?.replace("_hidden", "");
  if (sort !== "extra" || blacklistedGuilds[guildId] || !channelId?.endsWith("_hidden")) return res;

  const hiddenCategory = new Channel({
    guild_id: guildId,
    id: channelId,
    name: "Hidden Channels",
    type: 4,
  });
  return hiddenCategory;
});

PluginInjector.after(channels, "getMutableGuildChannelsForGuild", ([guildId], res) => {
  const sort = SettingValues.get("sort", DefaultSettings.sort);
  const blacklistedGuilds = SettingValues.get(
    "blacklistedGuilds",
    DefaultSettings.blacklistedGuilds,
  );
  if (sort !== "extra" || !guildId || blacklistedGuilds[guildId]) return res;

  const hiddenId = `${guildId}_hidden`;
  const hiddenCategory = new Channel({
    guild_id: guildId,
    id: hiddenId,
    name: "Hidden Channels",
    type: 4,
  });

  const defaultCategories = GuildChannelStore.getChannels(guildId)[
    ChannelTypes.GUILD_CATEGORY
  ] as GuildChannel[];

  const lastCategory = defaultCategories.at(-1) || {
    channel: { position: Object.keys(res).length },
  };
  const hiddenPosition = lastCategory.channel.position + 1;

  hiddenCategory.position_ = hiddenPosition;

  Object.defineProperty(hiddenCategory, "position", {
    value: hiddenPosition,
    writable: true,
  });

  if (!res[hiddenId]) res[hiddenId] = hiddenCategory;

  return res;
});
