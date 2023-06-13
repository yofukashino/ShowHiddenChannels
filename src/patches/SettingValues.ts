import { PluginInjector, SettingValues } from "../index";
import * as Utils from "../lib/utils";
export const patchSettingSetter = (): void => {
  PluginInjector.after(SettingValues, "set", () => {
    Utils.rerenderChannels();
  });
};
