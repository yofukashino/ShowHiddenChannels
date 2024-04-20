import { PluginInjector, PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import injectMessageAPI from "./MessageAPI";
import injectChannel from "./Channel";
import injectChannelCategories from "./ChannelsCategories";
import injectPermissions from "./Permissions";
import injectReadStateStore from "./ReadStateStore";
import injectVisuals from "./Visuals";
import injectGuildContextMenu from "./GuildContextMenu";
import injectSettingSetter from "./SettingValues";
export const applyInjections = async (): Promise<void> => {
  if (SettingValues.get("debugMode", defaultSettings.debugMode))
    PluginLogger.log("Starting to load Modules.");
  await Modules.loadModules();
  if (SettingValues.get("debugMode", defaultSettings.debugMode)) {
    PluginLogger.log("Loaded Modules.");
    PluginLogger.log("Below are the Modules used.");
    for (const ModuleName in Modules) {
      if (ModuleName === "loadModules") continue;
      PluginLogger.log(ModuleName, Modules[ModuleName]);
    }
  }
  injectChannel();
  injectChannelCategories();
  injectMessageAPI();
  injectPermissions();
  injectReadStateStore();
  injectVisuals();
  injectGuildContextMenu();
  injectSettingSetter();
  Utils.rerenderChannels();
};

export const removeInjections = (): void => {
  PluginInjector.uninjectAll();
  Utils.rerenderChannels();
};

export default { applyInjections, removeInjections };
