import { PluginInjector, SettingValues } from "@this";
import { ReadStateStore } from "@lib/RequiredModules";
import { DefaultSettings } from "@Consts";
import Utils from "@Utils";

const getStopMarkingRead = (): boolean =>
  SettingValues.get("stopMarkingUnread", DefaultSettings.stopMarkingUnread);

PluginInjector.after(ReadStateStore, "getGuildChannelUnreadState", ([channel], res) =>
  Utils.isHidden(channel.id, channel) && !getStopMarkingRead()
    ? { mentionCount: 0, unread: false }
    : res,
);

PluginInjector.after(ReadStateStore, "getMentionCount", ([channelId], res) =>
  Utils.isHidden(channelId) && !getStopMarkingRead() ? 0 : res,
);

PluginInjector.after(ReadStateStore, "getUnreadCount", ([channelId], res) =>
  Utils.isHidden(channelId) && !getStopMarkingRead() ? 0 : res,
);

PluginInjector.after(ReadStateStore, "hasTrackedUnread", ([channelId], res) =>
  getStopMarkingRead() ? res : res && !Utils.isHidden(channelId),
);

PluginInjector.after(ReadStateStore, "hasUnread", ([channelId], res) =>
  getStopMarkingRead() ? res : res && !Utils.isHidden(channelId),
);

PluginInjector.after(ReadStateStore, "hasUnreadPins", ([channelId], res) =>
  getStopMarkingRead() ? res : res && !Utils.isHidden(channelId),
);
