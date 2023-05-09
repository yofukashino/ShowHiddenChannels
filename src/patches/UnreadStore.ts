import { PluginInjector, SettingValues } from "../index";
import { ChannelStore, UnreadStore } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";

export const patchUnreadStore = (): void => {
  if (SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)) return;
  PluginInjector.after(UnreadStore, "getGuildChannelUnreadState", (args, res) => {
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
};
