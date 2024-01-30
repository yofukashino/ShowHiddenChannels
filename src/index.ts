import { Injector, Logger, settings } from "replugged";
import { defaultSettings } from "./lib/consts";
import Settings from "./Components/Settings";
import Utils from "./lib/utils";
import "./style.css";
export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("ShowHiddenChannels");
export const SettingValues = await settings.init("dev.tharki.ShowHiddenChannels", defaultSettings);
import Injections from "./patches/index";

export const start = (): void => {
  Settings.registerSettings();
  Injections.applyInjections();
  Utils.rerenderChannels();
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
  Utils.rerenderChannels();
};

export { Settings } from "./Components/Settings";
