import { Injector, Logger, settings } from "replugged";
import { DefaultSettings } from "@Consts";
import Injections from "@Injections";
import Settings from "@components/Settings";
import Types from "@Types";

import "./style.css";

export const PluginInjector = new Injector();
export const { utils: PluginInjectorUtils } = PluginInjector;
export const PluginLogger = Logger.plugin("ShowHiddenChannels", "#ffffff80");
export const SettingValues = settings.init<Types.Settings>(
  "dev.tharki.ShowHiddenChannels",
  DefaultSettings,
);

export const start = (): void => {
  Settings.registerSettings();
  void Injections.applyInjections().catch((err: unknown) => PluginLogger.error(err));
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
  Injections.removeInjections();
};

export { Settings } from "@components/Settings";
