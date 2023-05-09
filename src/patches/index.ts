import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import * as UsedModules from "../lib/requiredModules";
import { patchMessageAPI } from "./MessageAPI";
import { patchChannel } from "./Channel";
import { patchChannelCategories } from "./ChannelsCategories";
import { patchPermissions } from "./Permissions";
import { patchUnreadStore } from "./UnreadStore";
import { patchVisuals } from "./Visuals";
export { makeChannelBrowerLockIcon } from "./Visuals";
export { addSHCEntry } from "./GuildContextMenu";
export const applyInjections = (): void => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("Below are the Modules used by Show Hidden Channels Plugins.");
    for (const ModuleName in UsedModules) PluginLogger.log(ModuleName, UsedModules[ModuleName]);
  }
  patchChannel();
  patchChannelCategories();
  patchMessageAPI();
  patchPermissions();
  patchUnreadStore();
  patchVisuals();
};
