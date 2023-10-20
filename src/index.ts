import { Injector, Logger, settings } from "replugged";
import { PermissionStore } from "./lib/requiredModules";
import { defaultSettings } from "./lib/consts";
import { registerSettings } from "./Components/Settings";
import Utils from "./lib/utils";
import "./style.css";
export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("ShowHiddenChannels");
export const SettingValues = await settings.init("dev.tharki.ShowHiddenChannels", defaultSettings);
export const originalCan = PermissionStore?.can?.prototype?.constructor;
import { applyInjections } from "./patches/index";

export const start = (): void => {
  registerSettings();
  applyInjections();
  Utils.rerenderChannels();
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
  Utils.rerenderChannels();
};

export { _assignMemberRow } from "./plaintextFunctions";
export { Settings } from "./Components/Settings";
