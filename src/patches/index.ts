import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import UsedModules from "../lib/requiredModules";
import patchMessageAPI from "./MessageAPI";
import patchChannel from "./Channel";
import patchChannelCategories from "./ChannelsCategories";
import patchPermissions from "./Permissions";
import patchReadStateStore from "./ReadStateStore";
import patchVisuals from "./Visuals";
import patchGuildContextMenu from "./GuildContextMenu";
import patchSettingSetter from "./SettingValues";
export const applyInjections = (): void => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("Below are the Modules used by Show Hidden Channels Plugins.");
    for (const ModuleName in UsedModules) PluginLogger.log(ModuleName, UsedModules[ModuleName]);
  }
  patchChannel();
  patchChannelCategories();
  patchMessageAPI();
  patchPermissions();
  patchReadStateStore();
  patchVisuals();
  patchGuildContextMenu();
  patchSettingSetter();
};
