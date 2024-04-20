import { PluginInjector, SettingValues } from "../index";
import Utils from "../lib/utils";
export default (): void => {
  PluginInjector.after(SettingValues, "set", () => {
    Utils.rerenderChannels();
  });
};
