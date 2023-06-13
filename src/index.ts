import { Injector, Logger, common, settings } from "replugged";
import { PermissionStore } from "./lib/requiredModules";
import { defaultSettings } from "./lib/consts";
import { registerSettings } from "./Components/Settings";
import * as Utils from "./lib/utils";
import "./style.css";
export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("ShowHiddenChannels");
export const SettingValues = await settings.init("dev.tharki.ShowHiddenChannels", defaultSettings);
export const { lodash } = common;
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

export { makeChannelBrowerLockIcon } from "./patches/index";

export { Settings } from "./Components/Settings";
