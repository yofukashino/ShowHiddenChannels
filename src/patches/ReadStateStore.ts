import { PluginInjector, SettingValues } from "../index";
import { ChannelStore, ReadStateStore } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";

export default (): void => {
  PluginInjector.after(ReadStateStore, "getGuildChannelUnreadState", (args, res) =>
    args[0]?.isHidden?.() &&
    !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? { mentionCount: 0, unread: false }
      : res,
  );

  PluginInjector.after(ReadStateStore, "getMentionCount", (args, res) =>
    ChannelStore.getChannel(args[0])?.isHidden?.() &&
    !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? 0
      : res,
  );

  PluginInjector.after(ReadStateStore, "getUnreadCount", (args, res) =>
    ChannelStore.getChannel(args[0])?.isHidden?.() &&
    !SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? 0
      : res,
  );

  PluginInjector.after(ReadStateStore, "hasTrackedUnread", (args, res) =>
    SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.(),
  );

  PluginInjector.after(ReadStateStore, "hasUnread", (args, res) =>
    SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.(),
  );

  PluginInjector.after(ReadStateStore, "hasUnreadPins", (args, res) =>
    SettingValues.get("stopMarkingUnread", defaultSettings.stopMarkingUnread)
      ? res
      : res && !ChannelStore.getChannel(args[0])?.isHidden?.(),
  );
};
