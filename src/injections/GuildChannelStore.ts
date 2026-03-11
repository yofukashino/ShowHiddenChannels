import { constants } from "replugged/common";
import { PluginInjector } from "@this";
import { GuildChannelStore } from "@lib/RequiredModules";

import type { GuildChannel } from "@lib/RequiredModules/GuildChannelStore";

const { ChannelTypes } = constants;

PluginInjector.after(GuildChannelStore, "getChannels", ([guildId], res) => {
  if (!guildId) return res;
  const GuildCategories = res[ChannelTypes.GUILD_CATEGORY] as GuildChannel[];
  const hiddenId = `${guildId}_hidden`;
  const hiddenCategory = GuildCategories?.find((m) => m.channel.id === hiddenId);
  if (!hiddenCategory) return res;

  const defaultCategories = GuildCategories.filter((m) => m.channel.id !== hiddenId);

  const lastCategory = defaultCategories.at(-1) || {
    channel: { position: Infinity },
    comparator: 0,
  };
  const hiddenPosition = lastCategory.channel.position + 1;
  const hiddenComparator = lastCategory.comparator + 1;

  Object.defineProperty(hiddenCategory.channel, "position", {
    value: hiddenPosition,
    writable: true,
  });

  Object.defineProperty(hiddenCategory, "comparator", {
    value: hiddenComparator,
    writable: true,
  });
  return res;
});
