import { PluginInjector, SettingValues } from "../index";
import { ChannelStore, ReadStateStore } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";

export const patchReadStateStore = (): void => {
  PluginInjector.after(ReadStateStore, "getGuildChannelUnreadState", (args, res) => {
    return args[0]?.isHidden?.() &&
      !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? { mentionCount: 0, hasNotableUnread: false }
      : res;
  });

  PluginInjector.after(ReadStateStore, "getMentionCount", (args, res) => {
    return ChannelStore.getChannel(args[0])?.isHidden?.() &&
      !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? 0
      : res;
  });

  PluginInjector.after(ReadStateStore, "getUnreadCount", (args, res) => {
    return ChannelStore.getChannel(args[0])?.isHidden?.() &&
      !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? 0
      : res;
  });

  PluginInjector.after(ReadStateStore, "hasNotableUnread", (args, res) => {
    return SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });

  PluginInjector.after(ReadStateStore, "hasRelevantUnread", (args, res) => {
    return SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !args[0].isHidden?.();
  });

  PluginInjector.after(ReadStateStore, "hasTrackedUnread", (args, res) => {
    return SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });

  PluginInjector.after(ReadStateStore, "hasUnread", (args, res) => {
    return SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });

  PluginInjector.after(ReadStateStore, "hasUnreadPins", (args, res) => {
    return SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });
};
