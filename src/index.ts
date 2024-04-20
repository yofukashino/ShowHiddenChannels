import { Injector, Logger, settings } from "replugged";
import { defaultSettings } from "./lib/consts";
import "./style.css";
export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("ShowHiddenChannels");
export const SettingValues = await settings.init("dev.tharki.ShowHiddenChannels", defaultSettings);
import Settings from "./Components/Settings";
import Injections from "./injections/index";

export const start = (): void => {
  Settings.registerSettings();
  void Injections.applyInjections();
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
  Injections.removeInjections();
};

export { Settings } from "./Components/Settings";
